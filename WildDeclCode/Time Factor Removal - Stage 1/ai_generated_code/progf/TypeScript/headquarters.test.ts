// Supported via standard GitHub programming aids
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var headquartersRouter = require('./headquarters');

var app = express();
app.use(express.json());
app.use('/headquarters', headquartersRouter);

describe('Headquarters API', function () {
	it('should create a new headquarters', async () => {
		var newHeadquarters = { 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		};
		var response = await request(app).post('/headquarters').send(newHeadquarters);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newHeadquarters);
	});

	it('should get all headquarters', async () => {
		var response = await request(app).get('/headquarters');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		}]);
	});

	it('should get a headquarters by ID', async () => {
		var response = await request(app).get('/headquarters/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		});
	});

	it('should update a headquarters by ID', async () => {
		var updatedHeadquarters = { 
			headquartersId: 1, 
			name: 'Updated Headquarters 1', 
			description: 'Updated headquarters' 
		};
		var response = await request(app).put('/headquarters/1').send(updatedHeadquarters);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedHeadquarters);
	});

	it('should delete a headquarters by ID', async () => {
		var response = await request(app).delete('/headquarters/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing headquarters', async () => {
		var response = await request(app).get('/headquarters/999');
		expect(response.status).toBe(404);
	});
});