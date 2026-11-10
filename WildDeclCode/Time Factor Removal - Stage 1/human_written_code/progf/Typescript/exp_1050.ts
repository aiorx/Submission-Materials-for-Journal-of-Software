var config = require('config');
var express = require('express');
var AuthServiceCheck = require('../../data-layer/data-agents/UserDataAgent').AuthServiceCheck;
var IUserDocument = require('../../data-layer/data-abstracts/repositories/user/IUserDocument').IUserDocument;
var verifyToken = require('./token-helpers').verifyToken;
var jwt = require('jsonwebtoken');
var logger = require('../../middleware/common/logging').logger;
var moment = require('moment');


let authService = new AuthServiceCheck();
let opts = {
  secretOrKey: config.get('auth.jwt_secret').toString()
};


async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    const token:any =  request.headers['x-access-token'];
    if (token) {
       const payload = verifyToken(token);
       if(!(payload instanceof Error) ){
           let authResult = await authService.getAuthById(payload.userId);
           if(authResult && !(authResult instanceof Error)){
                 // uneccessary check... but could be used to refresh token
                 let userModel = <IUserDocument>authResult;
                 if(userModel.id == payload.userId){
                        return Promise.resolve({ authorizedUser:true  });
                 }else {
                      return Promise.reject(new Error('jwt token user cannot be verified BIG TROUBLE'));
                 }
           }else {
             return Promise.reject(new Error('jwt token user cannot be verified'));
           }
       }else {
          return Promise.reject(payload);
       }
    }else {
          return Promise.reject( new Error('jwt token malformed'));
    }
};

module.exports.expressAuthentication = expressAuthentication;
