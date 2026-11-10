/* eslint-disable no-console */

/** ADMIN CONTROLLER */

/** Node Imports */
var Request = require('express').Request;
var Response = require('express').Response;
var Mongoose = require('mongoose');

/** Custom Imports */
import {
  dbOptions as options,
  DB_URI as uri,
} from '../config/dbConfig';

var CRUDController = require('../types/interfaces').CRUDController;

var unsupported = (req: Request, res: Response): function void {
  res.send('This method is not supported.');
};

var readIndex = (req: Request, res: Response): function void {
  console.log('GET: /api/admin');
  res.send('Not yet implemented');
};

var createIndex = (req: Request, res: Response): function void {
  console.log('POST: /api/admin');
  res.send('Not yet implemented');
};

var createRequest = (req: Request, res: Response): function void {
  var username = req.body.rcsID;
  var password = req.body.password;

  console.log('Username:', username);
  console.log('Password:', password);

  Mongoose.connect(uri, options).then(() => {
    console.log('Database connected in route "/admin"!');
    Mongoose.disconnect();
    res.send('Not yet implemented');
  });
};

var createLogin = (req: Request, res: Response): function void {
  console.log('POST: /api/admin/login');
  res.send('Not yet implemented');
};

var Index: CRUDController = {
  create: createIndex,
  read: readIndex,
  update: unsupported,
  delete: unsupported,
};

var AdminRequest: CRUDController = {
  create: createRequest,
  read: unsupported,
  update: unsupported,
  delete: unsupported,
};

var Login: CRUDController = {
  create: createLogin,
  read: unsupported,
  update: unsupported,
  delete: unsupported,
};
