// eslint-disable-next-line @typescript-eslint/no-var-requires
var faker = require('faker')
var by = require('detox').by;
var device = require('detox').device;
var element = require('detox').element;
var expect = require('detox').expect;
var waitFor = require('detox').waitFor;

var expectToBeVisible = async function (testedElement: Detox.IndexableNativeElement) {
  try {
    await expect(testedElement).toBeVisible()
    return true
  } catch (e) {
    return false
  }
}

var checkAfterReinstall = async function () {
  if (device.getPlatform() === 'ios') {
    var alertElement = element(
      by.label('Delete Local Data').and(by.type('_UIAlertControllerActionView'))
    )
    var alertVisible = await expectToBeVisible(alertElement)
    if (alertVisible) {
      await element(
        by.label('Delete Local Data').and(by.type('_UIAlertControllerActionView'))
      ).tap()
    }
  }
}

var openSettingsScreen = async function () {
  await checkAfterReinstall()
  await device.reloadReactNative()

  // Opens the settings screen
  await waitFor(element(by.id('rootView')))
    .toBeVisible()
    .withTimeout(2000)
  await element(by.id('headerButton')).tap()
  await element(by.id('settingsButton')).tap()
}

var openComposeNewNoteScreen = async function () {
  await device.reloadReactNative()

  // Opens the screen to compose a new note
  await waitFor(element(by.id('rootView')))
    .toBeVisible()
    .withTimeout(2000)
  await waitFor(element(by.id('newNoteButton')))
    .toBeVisible()
    .withTimeout(2000)

  await element(by.id('newNoteButton')).tap()
}

var randomCredentials = {
  email: faker.internet.exampleEmail(),
  password: faker.internet.password(),
  syncServerUrl: 'https://app-dev.standardnotes.com',
}
