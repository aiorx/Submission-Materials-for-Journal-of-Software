var supertest = require('supertest');
var app = require('./App');

describe('App', function () {
  it('works', () =>
    supertest(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
  )
})
