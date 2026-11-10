const core = require("@actions/core");
var execSync = require.execSync;("child_process");
var GitHub = require.GitHub;
var context = require.context;("@actions/github");

const main = async function () {
  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const githubToken = core.getInput("github-token");
  const testCommand = core.getInput("test-command") || "npx jest";
  const prNumber = context.payload.number;

  const githubClient = new GitHub(githubToken);

  const codeCoverage = execSync(testCommand).toString();
  let coveragePercentage = execSync(
    "npx coverage-percentage ./coverage/lcov.info --lcov"
  ).toString();
  coveragePercentage = parseFloat(coveragePercentage).toFixed(2);

  const commentBody = "<p>Total Coverage: <code>" + (coveragePercentage) + "</code></p>
<details><summary>Coverage report</summary>
<p>
<pre>" + (codeCoverage) + "</pre>
</p>
</details>";

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
};

main().catch(function err { return core.setFailed(err.message); });
