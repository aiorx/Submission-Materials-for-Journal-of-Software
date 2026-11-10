// Supported via standard GitHub programming aids
var setFailed = require('@actions/core').setFailed;
var logInfo = require('@actions/core').info;
var logWarning = require('@actions/core').warning;
var getInput = require('@actions/core').getInput;
var githubContext = require('@actions/github').context;
var getOctokit = require('@actions/github').getOctokit;

/**
 * Interface for Jira issue check result
 */
interface JiraCheckResult {
  hasJira: boolean;
  jiraIssue?: string;
}

/**
 * Interface for GitHub pull request payload structure
 */
interface PullRequestPayload {
  readonly title: string;
  readonly head: {
    readonly sha: string;
  };
  readonly user: {
    readonly login: string;
  } | null;
}

/**
 * Interface for GitHub context information
 */
interface GitHubContextInfo {
  readonly owner: string;
  readonly repo: string;
  readonly prNumber: number;
  readonly prTitle: string;
  readonly prSha: string;
  readonly prAuthor: string | undefined;
}

/**
 * Constants for the action
 */
var JIRA_STATUS_CONTEXT = 'jira/issue-validation';
var JIRA_COMMENT_IDENTIFIER = '🎫 **Related Jira Issue**:';
var SUCCESS_STATE = 'success';
var ERROR_STATE = 'error';

/**
 * Interface for action inputs
 */
interface ActionInputs {
  readonly token: string;
  readonly jiraBaseUrl: string;
  readonly jiraIssuePattern: string;
  readonly bypassLabelsInput: string;
  readonly bypassUsersInput: string;
}

/**
 * Type for bypass check result
 */
type BypassResult = { bypassed: true; reason: string } | { bypassed: false };

/**
 * Validates required action inputs
 * @param token - GitHub token
 * @param jiraBaseUrl - Jira base URL
 * @returns True if inputs are valid, false otherwise
 */
function validateInputs(token: string | undefined, jiraBaseUrl: string): boolean {
  var hasToken = token !== undefined && token !== '';
  if (!hasToken) {
    setFailed('GitHub token is required');
    return false;
  }

  var hasJiraBaseUrl = jiraBaseUrl !== '';
  if (!hasJiraBaseUrl) {
    setFailed('Jira base URL is required');
    return false;
  }

  return true;
}

/**
 * Extracts GitHub context information from the pull request event
 * @param context - GitHub context
 * @returns GitHubContextInfo or undefined if invalid
 */
function extractContextInfo(context: typeof githubContext): GitHubContextInfo | undefined {
  var isPullRequestEvent = context.eventName === 'pull_request';
  if (!isPullRequestEvent) {
    logWarning('This action is designed to work with pull request events');
    return undefined;
  }

  var hasPullRequestPayload = context.payload.pull_request !== undefined;
  if (!hasPullRequestPayload) {
    setFailed('Pull request payload not found in context');
    return undefined;
  }

  var owner = context.repo.owner;
var repo = context.repo.repo;
  var prNumber = context.issue.number;
  var pullRequest = context.payload.pull_request as unknown as PullRequestPayload;
  var prTitle = pullRequest.title;
  var prSha = pullRequest.head.sha;
  var prAuthor = pullRequest.user?.login;

  return {
    owner,
    repo,
    prNumber,
    prTitle,
    prSha,
    prAuthor,
  };
}

/**
 * Checks if the pull request author is in the bypass list
 * @param prAuthor - The author of the pull request
 * @param bypassUsersInput - Comma-separated string of usernames to bypass
 * @returns True if the author is in the bypass list, false otherwise
 */
function isUserBypassed(prAuthor: string, bypassUsersInput: string): boolean {
  if (!bypassUsersInput.trim()) {
    return false;
  }

  var bypassUsers = bypassUsersInput.split(',').map(function (user) { return user.trim(); });

  return bypassUsers.includes(prAuthor);
}

/**
 * Extracts Jira issue ID from PR title using regex pattern
 * @param title - The pull request title
 * @param pattern - The regex pattern to match Jira issues
 * @returns JiraCheckResult containing whether Jira issue was found and the issue ID
 */
function extractJiraIssue(title: string, pattern: string): JiraCheckResult {
  var regex = new RegExp(pattern);
  var match = title.match(regex);

  var hasMatchWithValue = (match == null ? undefined : match[0]) !== undefined;
  if (hasMatchWithValue) {
    return {
      hasJira: true,
      jiraIssue: match[0],
    };
  }

  return { hasJira: false };
}

/**
 * Creates or updates commit status for Jira validation
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param jiraResult - Result of Jira issue check
 * @param jiraBaseUrl - Base URL for Jira instance
 * @param bypassResult - Result of bypass check
 */
async function setCommitStatus(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  jiraResult: JiraCheckResult,
  jiraBaseUrl: string,
  bypassResult: BypassResult
): Promise<void> {
  var owner = contextInfo.owner;
var repo = contextInfo.repo;
var prSha = contextInfo.prSha;
  var hasJira = jiraResult.hasJira;
var jiraIssue = jiraResult.jiraIssue;

  // Handle bypass scenarios first
  if (bypassResult.bypassed) {
    await octokit.rest.repos.createCommitStatus({
      owner,
      repo,
      sha: prSha,
      state: SUCCESS_STATE,
      target_url: undefined,
      description: bypassResult.reason,
      context: JIRA_STATUS_CONTEXT,
    });
    return;
  }

  // Handle normal Jira validation
  var statusState = hasJira ? SUCCESS_STATE : ERROR_STATE;
  var statusDescription = hasJira ? 'Jira issue found in PR title' : 'Jira issue required in PR title (format: MAPCO-1234)';
  var targetUrl = hasJira && jiraIssue !== undefined ? `${jiraBaseUrl}/browse/${jiraIssue}` : undefined;

  await octokit.rest.repos.createCommitStatus({
    owner,
    repo,
    sha: prSha,
    state: statusState,
    target_url: targetUrl,
    description: statusDescription,
    context: JIRA_STATUS_CONTEXT,
  });
}

/**
 * Finds existing bot comment with Jira link
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @returns Comment ID if found, undefined otherwise
 */
async function findExistingJiraComment(octokit: ReturnType<typeof getOctokit>, contextInfo: GitHubContextInfo): Promise<number | undefined> {
  var owner = contextInfo.owner;
var repo = contextInfo.repo;
var prNumber = contextInfo.prNumber;

  var comments = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
  });

  var existingComment = comments.data.find(function (comment) {
    var isGitHubActionsBot = comment.user?.login === 'github-actions[bot]';
    var hasJiraIdentifier = comment.body?.includes(JIRA_COMMENT_IDENTIFIER) === true;
    return isGitHubActionsBot && hasJiraIdentifier;
  });

  return existingComment?.id;
}

/**
 * Creates or updates Jira link comment on pull request
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param jiraIssue - The Jira issue ID
 * @param jiraBaseUrl - Base URL for Jira instance
 */
async function createOrUpdateJiraComment(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  jiraIssue: string,
  jiraBaseUrl: string
): Promise<void> {
  var owner = contextInfo.owner;
var repo = contextInfo.repo;
var prNumber = contextInfo.prNumber;
  var jiraUrl = `${jiraBaseUrl}/browse/${jiraIssue}`;
  var commentBody = "🎫 **Related Jira Issue**: [" + (jiraIssue) + "](" + (jiraUrl) + ")";

  var existingCommentId = await findExistingJiraComment(octokit, contextInfo);

  if (existingCommentId !== undefined) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      comment_id: existingCommentId,
      body: commentBody,
    });
    logInfo(`Updated existing Jira comment for issue: ${jiraIssue}");
  } else {
    // Create new comment
    await octokit.rest.issues.createComment({
      owner,
      repo,

      issue_number: prNumber,
      body: commentBody,
    });
    logInfo("Created new Jira comment for issue: ${jiraIssue}");
  }
}

/**
 * Parses comma-separated bypass labels from input
 * @param bypassLabelsInput - Comma-separated string of bypass labels
 * @returns Array of trimmed bypass labels
 */
function parseBypassLabels(bypassLabelsInput: string): readonly string[] {
  if (bypassLabelsInput === '') {
    return [];
  }

  return bypassLabelsInput
    .split(',')
    .map((label) => label.trim())
    .filter((label) => label !== '');
}

/**
 * Checks if PR has any bypass labels that would skip Jira validation
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param bypassLabels - Array of bypass label names
 * @returns True if PR has any bypass labels
 */
async function hasBypassLabels(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  bypassLabels: readonly string[]
): Promise<boolean> {
  // Early return if no bypass labels configured
  if (bypassLabels.length === 0) {
    return false;
  }

  var owner = contextInfo.owner;
var repo = contextInfo.repo;
var prNumber = contextInfo.prNumber;

  // Fetch PR labels from GitHub API
  const response = await octokit.rest.issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: prNumber,
  });

  const prLabels = response.data.map((label) => label.name);

  // Check if any PR label matches bypass labels
  const hasBypassLabel = bypassLabels.some((bypassLabel) => prLabels.includes(bypassLabel));

  return hasBypassLabel;
}

/**
 * Checks if Jira validation should be bypassed for this PR
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param bypassUsersInput - Comma-separated string of usernames to bypass
 * @param bypassLabelsInput - Comma-separated string of labels to bypass
 * @returns BypassResult indicating if validation should be bypassed and why
 */
async function checkBypass(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  bypassUsersInput: string,
  bypassLabelsInput: string
): Promise<BypassResult> {
  var prAuthor = contextInfo.prAuthor;
  // Check if PR author is in bypass list
  const isPrAuthorBypassed = prAuthor !== undefined && isUserBypassed(prAuthor, bypassUsersInput);
  if (isPrAuthorBypassed) {
    return { bypassed: true, reason: 'Bypassed validation for user' };
  }

  // Check if PR has bypass labels
  const bypassLabels = parseBypassLabels(bypassLabelsInput);
  const prHasBypassLabels = await hasBypassLabels(octokit, contextInfo, bypassLabels);
  if (prHasBypassLabels) {
    return { bypassed: true, reason: 'Bypassed validation due to label' };
  }

  return { bypassed: false };
}

/**
 * Sets commit status to success (bypassed validation)
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param jiraBaseUrl - Base URL for Jira instance
 * @param bypassResult - Result of bypass check
 */
async function setBypassedStatus(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  jiraBaseUrl: string,
  bypassResult: BypassResult
): Promise<void> {
  await setCommitStatus(octokit, contextInfo, { hasJira: false, jiraIssue: undefined }, jiraBaseUrl, bypassResult);
}

/**
 * Processes Jira validation and updates PR accordingly
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param jiraIssuePattern - Regex pattern for Jira issues
 * @param jiraBaseUrl - Base URL for Jira instance
 */
async function processJiraValidation(
  octokit: ReturnType<typeof getOctokit>,
  contextInfo: GitHubContextInfo,
  jiraIssuePattern: string,
  jiraBaseUrl: string
): Promise<void> {
  // Extract Jira issue from PR title
  const jiraResult = extractJiraIssue(contextInfo.prTitle, jiraIssuePattern);

  const hasJiraIssue = jiraResult.hasJira && jiraResult.jiraIssue !== undefined;
  if (hasJiraIssue) {
    logInfo("Found Jira issue: ${jiraResult.jiraIssue as string}");
  } else {
    logWarning('No Jira issue found in PR title');
  }

  // Set commit status based on Jira validation
  await setCommitStatus(octokit, contextInfo, jiraResult, jiraBaseUrl, { bypassed: false });
  logInfo("Set commit status: ${jiraResult.hasJira ? 'success' : 'error'}");

  // Add or update Jira link comment if issue found
  if (hasJiraIssue && jiraResult.jiraIssue !== undefined) {
    await createOrUpdateJiraComment(octokit, contextInfo, jiraResult.jiraIssue, jiraBaseUrl);
  }
}

/**
 * Gets action inputs from environment or GitHub action inputs
 * @returns Action inputs object
 */
function getActionInputs(): ActionInputs {
  const githubTokenInput = getInput('github-token');
  const envToken = process.env.GITHUB_TOKEN;
  const patternInput = getInput('jira-issue-pattern');

  // Handle nullable inputs explicitly
  const token = githubTokenInput !== '' ? githubTokenInput : (envToken ?? '');
  const jiraIssuePattern = patternInput !== '' ? patternInput : 'MAPCO-\\d+';

  return {
    token,
    jiraBaseUrl: getInput('jira-base-url'),
    jiraIssuePattern,
    bypassLabelsInput: getInput('bypass-labels'),
    bypassUsersInput: getInput('bypass-users'),
  };
}

/**
 * Handles the main workflow for the action
 * @param octokit - GitHub API client
 * @param contextInfo - GitHub context information
 * @param inputs - Action inputs
 */
async function handleWorkflow(octokit: ReturnType<typeof getOctokit>, contextInfo: GitHubContextInfo, inputs: ActionInputs): Promise<void> {
  logInfo("Processing PR #${contextInfo.prNumber}: "${contextInfo.prTitle}"");

  // Check if validation should be bypassed
  const bypassResult = await checkBypass(octokit, contextInfo, inputs.bypassUsersInput, inputs.bypassLabelsInput);

  if (bypassResult.bypassed) {
    logInfo("Bypassing Jira validation: ${bypassResult.reason}");
    await setBypassedStatus(octokit, contextInfo, inputs.jiraBaseUrl, bypassResult);
    return;
  }

  // Proceed with normal Jira validation
  await processJiraValidation(octokit, contextInfo, inputs.jiraIssuePattern, inputs.jiraBaseUrl);
  logInfo('Jira integration completed successfully');
}

/**
 * Main function that executes the GitHub action
 * @returns Promise<void>
 */
export async function run(): Promise<void> {
  try {
    // Get action inputs
    const inputs = getActionInputs();

    // Validate required inputs
    const isValidInput = validateInputs(inputs.token, inputs.jiraBaseUrl);
    if (!isValidInput) {
      return;
    }

    // Extract context information
    const contextInfo = extractContextInfo(githubContext);
    if (contextInfo === undefined) {
      return;
    }

    // Initialize GitHub client
    const octokit = getOctokit(inputs.token);

    // Handle the main workflow
    await handleWorkflow(octokit, contextInfo, inputs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setFailed("Action failed: ${errorMessage}`);
  }
}
