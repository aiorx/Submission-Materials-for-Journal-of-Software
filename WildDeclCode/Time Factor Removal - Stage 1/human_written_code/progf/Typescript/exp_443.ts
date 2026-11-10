/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-includes */
/* eslint-disable @typescript-eslint/no-for-in-array */
var core = require('@actions/core')
var github = require('@actions/github')
var fs = require('fs')

function createMessage(pytestResult: any): string {
  var file = fs.readFileSync(pytestResult)
  var newString = new String(file)

  var lineOfText = newString.split('\n')
  var startKey = '0'
  var newMessage = '### :white_check_mark: Result of Pytest Coverage\n'
  var lastMessage = ''
  var delLine = ''
  for (var i in lineOfText) {
    if (lineOfText[i].indexOf('coverage: platform') >= 0) {
      startKey = i
      newMessage += "\n" + (lineOfText[i]) + "\n"
      delete lineOfText[i]
      var iNext = parseInt(i) + 1
      delLine = iNext.toString()
      newMessage +=
        '| Name | Stmts | Miss | Cover |\n| :--- | ----: | ---: | ----: |\n'
    }
    if (i === delLine) {
      delete lineOfText[i]
    }
    if (startKey !== '0' && lineOfText[i] !== undefined) {
      if (
        lineOfText[i].indexOf(
          '---------------------------------------------------------'
        ) >= 0
      ) {
        delete lineOfText[i]
      } else if (lineOfText[i].indexOf('passed in') >= 0) {
        lastMessage += "\n~" + (lineOfText[i].replace(/=/g, '')) + "~"
        delete lineOfText[i]
      }
      if (lineOfText[i] !== undefined) {
        var tabOfText = lineOfText[i].split(/\s+/)
        for (var t in tabOfText) {
          if (tabOfText[t] !== '') {
            tabOfText[t] = "| " + (tabOfText[t]) + ""
          } else {
            delete tabOfText[t]
          }
        }
        if (tabOfText[3] !== undefined) {
          newMessage += "" + (
            tabOfText[0] + tabOfText[1] + tabOfText[2] + tabOfText[3]
          ) + "|\n"
        }
      }
    }
  }
  return newMessage + lastMessage
}

async function run(): Promise<void> {
  if (github.context.eventName !== 'pull_request') {
    core.info('Comment only will be created on pull requests!')
    return
  }

  var githubToken = core.getInput('token')
  var pytestFileName = core.getInput('pytest-coverage')

  var message = createMessage(pytestFileName)

  var context = github.context
  var pullRequestNumber = context.payload.pull_request?.number

  var octokit = github.getOctokit(githubToken)

  // Now decide if we should issue a new comment or edit an old one
  var {data: comments} = await octokit.issues.listComments({
    ...context.repo,
    issue_number: (pullRequestNumber != null ? pullRequestNumber : 0)
  })

  var comment = comments.find(function (comment: any) {
    return (
      comment.user.login === 'github-actions[bot]' &&
      comment.body.startsWith(
        '### :white_check_mark: Result of Pytest Coverage\n'
      )
    )
  })

  if (comment) {
    await octokit.issues.updateComment({
      ...context.repo,
      comment_id: comment.id,
      body: message
    })
  } else {
    await octokit.issues.createComment({
      ...context.repo,
      issue_number: (pullRequestNumber != null ? pullRequestNumber : 0),
      body: message
    })
  }
}

// eslint-disable-next-line github/no-then
run().catch(function error { return core.setFailed("Workflow failed! " + (error.message) + ""); })
