/// <reference types="mongoose" />
/// <reference types="winston" />
var mongoose = require('mongoose');
var BaseModel = require('./model').BaseModel;
var Model = require('./decorators').Model;
var BaseError = require('../error/BaseError');
var LoggerInstance = require('winston').LoggerInstance;
declare var Schema: typeof mongoose.Schema;
module.exports.Model = Model;
module.exports.Schema = Schema;
module.exports.BaseModel = BaseModel;
module.exports.BaseModel = BaseModel;
module.exports.as = as;
module.exports.BaseDAO = BaseDAO;
export declare class DatabaseError extends BaseError {
}
export interface DatabaseOptions {
    url?: string;
    logger?: LoggerInstance;
    mongoose?: mongoose.Mongoose;
}
module.exports = class Database {;
    options: DatabaseOptions;
    logger: LoggerInstance;
    mongoose: mongoose.Mongoose;
    constructor(options: DatabaseOptions);
    /**
     * Gets or registers a moongoose model instance by its name or definition.
     *
     * @param {string} name The model name
     *
     * @returns {any}
     */
    model<T extends BaseModel>(name: string | T | any): BaseModel;
    /**
     * Connects to the remote database.
     *
     * @returns {Promise<void>}
     */
    connect(): Promise<DatabaseOptions>;
    /**
     * Disconnects the database.
     *
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
    /**
     * Checks if the database is connected and ready for transactions.
     *
     * @returns {boolean}
     */
    isReady(): boolean;
    /**
     * Handles database errors, can be extended to include process graceful shutdown.
     * @param error
     */
    onError(error: any): void;
}
