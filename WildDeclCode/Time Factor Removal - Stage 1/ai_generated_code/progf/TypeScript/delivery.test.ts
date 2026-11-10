// Assisted using common GitHub development utilities
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var deliveryRouter = require('./delivery');

var app = express();
app.use(express.json());
app.use('/deliveries', deliveryRouter);

describe('Delivery API', function () {
	it('should create a new delivery', async () => {
		var newDelivery = { 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-01').toISOString(), 
			supplierId: 1,
			name: 'Delivery 1', 
			description: 'Test delivery'
		};
		var response = await request(app).post('/deliveries').send(newDelivery);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newDelivery);
	});

	it('should get all deliveries', async () => {
		var response = await request(app).get('/deliveries');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-01').toISOString(), 
			supplierId: 1,
			name: 'Delivery 1', 
			description: 'Test delivery'
		}]);
	});

	it('should get a delivery by ID', async () => {
		var response = await request(app).get('/deliveries/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-01').toISOString(), 
			supplierId: 1,
			name: 'Delivery 1', 
			description: 'Test delivery'
		});
	});

	it('should update a delivery by ID', async () => {
		var updatedDelivery = { 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-02').toISOString(), 
			supplierId: 1,
			name: 'Updated Delivery 1', 
			description: 'Updated delivery'
		};
		var response = await request(app).put('/deliveries/1').send(updatedDelivery);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedDelivery);
	});

	it('should delete a delivery by ID', async () => {
		var response = await request(app).delete('/deliveries/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing delivery', async () => {
		var response = await request(app).get('/deliveries/999');
		expect(response.status).toBe(404);
	});
});