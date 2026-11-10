// import * as functions from 'firebase-functions'
var dateformat = require('dateformat');
var auth = require('google-auth-library').auth;
// import { backupSlackNotification } from '../helpers';

// import { IncomingWebhook }  from '@slack/client'
var logErrors = require('../helpers/index').logErrors;

// const environment = functions.config()
// const webhook = new IncomingWebhook(environment.slack.deploymentWebhook)

var generateBackup = async function () {
  var client = await auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  })
  var timestamp = dateformat(Date.now(), 'yyyy-mm-dd')
  var path = "" + (timestamp) + ""
  var BUCKET_NAME = "devops101-backup"

  var projectId = await auth.getProjectId()
  var url = "https://firestore.googleapis.com/v1beta1/projects/" + (projectId) + "/databases/(default):exportDocuments"
  var backup_route = "gs://" + (BUCKET_NAME) + "/" + (path) + ""
  return client.request({
    url,
    method: 'POST',
    data: {
        outputUriPrefix: backup_route
    }
  }).then(async (res) => {
    console.log("Backup saved on folder on " + (backup_route) + "")
    // @ts-ignore
    //await webhook.send(backupSlackNotification(`completed`))
  })
  .catch(async (e) => {
    await logErrors(e, { message: e.message })
    // @ts-ignore
    // await webhook.send(backupSlackNotification(`error`))
    return Promise.reject({ message: e.message })
  })
}

var restoreBackup = async function () {
  var client = await auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  })
  var yesterday = new Date
  yesterday.setDate(yesterday.getDate() - 1)
  var timestamp = dateformat(yesterday, 'yyyy-mm-dd')
  var path = "" + (timestamp) + ""
  var BUCKET_NAME = "devops101-backup"

  var projectId = await auth.getProjectId()
  var url = "https://firestore.googleapis.com/v1beta1/projects/" + (projectId) + "/databases/(default):importDocuments"
  var backup_route = "gs://" + (BUCKET_NAME) + "/" + (path) + ""
  return client.request({
    url,
    method: 'POST',
    data: {
        inputUriPrefix: backup_route,
        // collectionIds: [] // if you want to import only certain collections
    }
  }).then(async (res) => {
    console.log("Backup restored from folder " + (backup_route) + "")
    // @ts-ignore
    // await webhook.send(backupSlackNotification(`completed`, `Restored`))
  })
  .catch(async (e) => {
    await logErrors(e, { message: e.message })
    // @ts-ignore
    // await webhook.send(backupSlackNotification(`error`, `Restored`))
    return Promise.reject({ message: e.message })
  })
}
