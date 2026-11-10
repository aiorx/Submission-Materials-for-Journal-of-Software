"use strict";
var uuid = require('uuid').v4;
var AWSError = require('aws-sdk').AWSError;
var DynamoDB = require('aws-sdk').DynamoDB;
var Center = require('../lambda/definitions/types').Center;
var CenterParam = require('../lambda/definitions/types').CenterParam;
module.exports = class CenterTable {;
  client: DynamoDB.DocumentClient;
  constructor(serviceClient: DynamoDB.DocumentClient) {
    this.client = serviceClient;
  }

  getCenters() {
    var params: DynamoDB.ScanInput = {
      TableName: process.env.CENTER_TABLE_NAME!,
    };
    return new Promise(function (resolve, reject) {
      this.client.scan(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("getCenters Success!");
          resolve(data);
        }
      });
    });
  }

  getCenter(centerId: string): Promise<Center | AWSError> {
    var params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.CENTER_TABLE_NAME!,
      Key: {
        centerId: centerId,
      },
    };
    return new Promise(function (resolve, reject) {
      this.client.get(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("getCenter Success!");
          console.log(data.Item!);
          resolve(data.Item! as Center);
        }
      });
    });
  }

  postCenter(body: CenterParam) {
    var center = {
      ...body,
      centerId: uuid(),
    };
    console.log(center);
    var params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.CENTER_TABLE_NAME!,
      Item: center,
    };
    console.log(params);
    return new Promise(function (resolve, reject) {
      this.client.put(params, (err, data) => {
        console.log(data);
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("postCenter Success!");
          resolve(center);
        }
      });
    });
  }

  putCenter(centerId: string, body: CenterParam) {
    var center = {
      ...body,
      centerId: centerId,
    };
    var exp = Object.keys(body).reduce(
      function (previous: string, current: string) {
        if (previous === "") {
          return "" + (current) + " = :" + (current) + "";
        } else {
          previous = previous + ", " + current + " = :" + current;
          return previous;
        }
      },
      ""
    );
    var expvalues = Object.keys(body).reduce(
      function (previous: any, current: string) {
        previous[":" + (current) + ""] = body[current] as string;
        return previous;
      },
      {}
    );
    console.log(exp);
    console.log(expvalues);
    var params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.CENTER_TABLE_NAME!,
      Key: {
        centerId: center.centerId,
      },
      UpdateExpression: "set " + exp,
      ExpressionAttributeValues: expvalues,
    };
    console.log(params);
    return new Promise(function (resolve, reject) {
      this.client.update(params, (err, data) => {
        console.log(data);
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("putCenter Success!");
          resolve(center);
        }
      });
    });
  }
}
