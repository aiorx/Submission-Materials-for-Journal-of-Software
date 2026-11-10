var iothub = require('azure-iothub');
var iothubMqtt = require('azure-iot-device-mqtt');
var Message = require('azure-iot-device').Message;
var dateformat = require('dateformat');

var DocDBHelper = require('./utils').DocDBHelper;
var config = require('./config').config;

let docdbHelper: DocDBHelper;
let iothubRetistry: any;
let databaseLink: any;
let collectionLink: any;

// ref to catalog.json
const productPrices = [20, 20, 60, 50, 40, 20, 15, 80, 120, 150, 100, 200, 150, 60, 250, 60];

function initAsync(): Promise<void> {
    return new Promise(function (resolve, reject) {
        // initialize IoT Hub client registry
        iothubRetistry  = iothub.Registry.fromConnectionString("HostName=" + (config.iothub.host) + ";SharedAccessKeyName=iothubowner;SharedAccessKey=" + (config.iothub.key) + "");

        docdbHelper = new DocDBHelper(config.docdb.host, config.docdb.authKey);
        docdbHelper.getOrCreateDatabase(config.docdb.databaseId)
            .then((db: any) => {
                databaseLink = db;
                docdbHelper.getOrCreateCollection(db._self, config.docdb.collectionId)
                    .then((coll) => {
                        collectionLink = coll;
                        resolve();
                    });
            });
    });
}

function registerNewDevices(deviceId: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        let device = { 'deviceId': deviceId };
        iothubRetistry.create(device, (err, deviceInfo, response) => {
            if (err) {
                iothubRetistry.get(device.deviceId, storeDeviceInDb);
            } else {
                storeDeviceInDb(err, deviceInfo, response);                
            }
            resolve(deviceInfo);
        });
    });
}

function storeDeviceInDb(err, deviceInfo, response) {
    docdbHelper.createDocument(collectionLink._self, deviceInfo)
        .then(function (response) {
            console.log("Device " + (deviceInfo.deviceId) + " has been stored in DocDB.");
        });
}

function createOrLoadDevices(): Promise<Array<any>> {
    return new Promise(function (resolve, reject) {
        // check if there's any devices stored in docdb
        docdbHelper.queryDocuments(collectionLink._self, { query: 'SELECT * FROM root' })
            .then((devices) => {
                if (devices.length == 0) {
                    // REGISTER new
                    let deviceCreationPromises: Array<Promise<void>> = [];
                    
                    for (let i = 0; i < config.num_devices; ++i) {
                        deviceCreationPromises.push(registerNewDevices("POS_" + (i) + ""));
                    }

                    Promise.all(deviceCreationPromises).then((devices) => {
                        resolve(devices);
                    })

                } else {
                    resolve(devices);
                }
            });
    });
}

initAsync()
    .then(function () {
        return createOrLoadDevices();
    }).then(function (devices: Array<any>) {
        for (let i = 0; i < devices.length; ++i) {
            let client = iothubMqtt.clientFromConnectionString("HostName=" + (config.iothub.host) + ";DeviceId=" + (devices[i].deviceId) + ";SharedAccessKey=" + (devices[i].authentication.symmetricKey.primaryKey) + "");
            /* send message in 1s interval. */
            setInterval(() => {
                let pid = 1 + Math.floor(Math.random() * 16),
                    qty = 1 + Math.floor(Math.random() * 4);

                let data = { 
                    deviceId: "" + (devices[i].deviceId) + "", 
                    userId: "" + (1 + Math.floor(Math.random() * 250)) + "",
                    productId: "" + (pid) + "", 
                    quantity: qty,
                    price: productPrices[pid - 1] * qty,
                    eventDate: dateformat(new Date(), "isoUtcDateTime")
                };
                let message = new Message(JSON.stringify(data));
                console.log("Sending message " + (message.getData()) + "...");
                client.sendEvent(message, (err, res) => {
                    if (err) console.error("[POS_" + (i) + "] error: " + (err.toString()) + "");
                    if (res) console.log("[POS_" + (i) + "]  status: " + (res.constructor.name) + "");
                })
            },1000);
        }

    }).catch(function (e) {
        console.error(e);
    });
