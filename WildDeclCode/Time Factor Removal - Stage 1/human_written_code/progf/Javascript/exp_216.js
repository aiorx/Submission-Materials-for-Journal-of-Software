/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

var faker = require('faker')
var fs = require('fs')

// Expects two command line arguments for number of records and filesglobal.fetch = require('node-fetch');
// e.g. node ./app.js 1000 10 creates 10 files with 1000 records each.

var MAX_RECORDS = parseInt(process.argv[2])
var MAX_FILES = parseInt(process.argv[3])
var DATA_DIR = './data'

if (!MAX_RECORDS || !MAX_FILES)
  return console.error('Missing command line arguments.')

console.log ("Creating " + (MAX_FILES) + " files with " + (MAX_RECORDS) + " records each.")

// Create sub-directory for data if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  console.log("Creating directory: " + (DATA_DIR) + "")
  fs.mkdirSync(DATA_DIR)
}

// Create MAX_FILES files of data
for (var j = 1; j <= MAX_FILES; j++) {
  var records = []
  console.log("Creating file " + (j) + "")
  // Create MAX_RECORDS example records and save
  for (var i = 0; i < MAX_RECORDS; i++) {
    records.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),      
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipcode: faker.address.zipCode(),
      phone: faker.phone.phoneNumber(),
      lat: faker.address.latitude(),
      lng: faker.address.longitude() 
    })
  }
  fs.writeFileSync("./" + (DATA_DIR) + "/import-" + (j) + ".json", JSON.stringify(records))
}
