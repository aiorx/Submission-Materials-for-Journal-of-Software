"use strict";

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var request = require('supertest');
var crypto = require('crypto');

var server = require('../server');
var baseUrl = 'http://localhost:3000';
var salt = crypto.randomBytes(16).toString('base64');

var decrypt = function (encryptedTxt) {
  var decipher = crypto.createDecipher('aes-256-ctr', salt);
  var decrypted = decipher.update(encryptedTxt, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

describe('server', function () {

  before(() => {
    server.listen(3000);
  });

  it('GET request to / responds with "Hello, World!"', (done) => {
    request(baseUrl)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        response.text.should.equal("Hello, World!");
        done();
      });
    });

    it('POST request to /messsage with message data returns message id', (done) => {
      request(baseUrl)
        .post('/message')
        .send({message: "This is a test message."})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((error, response) => {
          if (error) {
            done(error);
            return;
          }
          var result = JSON.parse(response.text);
          result.should.be.a('number');
          done();
        });
    });

    it('GET request to /messages returns a list of all the messages', (done) => {
      request(baseUrl)
        .get('/messages')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((error, response) => {
          if (error) {
            done(error);
            return;
          }
          var result = JSON.parse(response.text);
          result.should.be.a('Array');
          result[0].should.eql({id: 1, message: "This is a test message."});
          done();
        })
    });

    it('GET request to /message/:id returns the message matching the id', (done) => {
      request(baseUrl)
        .get('/message/1')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((error, response) => {
          if (error) {
            done(error);
            return;
          }
          var result = JSON.parse(response.text);
          result.should.be.a('object');
          result.should.eql({id: 1, message: "This is a test message."});
          done();
        });
    });

    it('GET request to /message/:id?encrypt=true returns the message encyrpted', (done) => {
      request(baseUrl)
        .get('/message/1?encrypt=true')
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .end((error, response) => {
          if (error) {
            done(error);
            return;
          }
          var result = JSON.parse(decrypt(response.text));
          result.should.be.a('object');
          result.should.eql({id: 1, message: "This is a test message."});
          done();
        });
    });

    it('GET request to /messages?encrypt=true returns all the messages encrypted', (done) => {
      request(baseUrl)
        .get('/messages?encrypt=true')
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .end((error, response) => {
          if (error) {
            done(error);
            return;
          }
          var result = JSON.parse(decrypt(response.text));
          result.should.be.a('Array');
          result.should.eql([{id:1, message: "This is a test message."}]);
          done();
        });
    });

  after(() => {
    server.close();
  });
});
