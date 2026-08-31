// Accessing a GitHub token from environment variables for GitHub API requests
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

// Built using basic development resources-4-0125-preview
