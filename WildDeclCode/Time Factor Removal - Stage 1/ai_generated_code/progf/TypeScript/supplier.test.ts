// Aided with basic GitHub coding tools
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var supplierRouter = require('./supplier');

var app = express();
app.use(express.json());
app.use('/suppliers', supplierRouter);

describe('Supplier API', function () {
	it('should create a new supplier', async () => {
		var newSupplier = { supplierId: 1, name: 'Supplier 1', description: 'Test supplier' };
		var response = await request(app).post('/suppliers').send(newSupplier);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newSupplier);
	});

	it('should get all suppliers', async () => {
		var response = await request(app).get('/suppliers');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ supplierId: 1, name: 'Supplier 1', description: 'Test supplier' }]);
	});

	it('should get a supplier by ID', async () => {
		var response = await request(app).get('/suppliers/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ supplierId: 1, name: 'Supplier 1', description: 'Test supplier' });
	});

	it('should update a supplier by ID', async () => {
		var updatedSupplier = { supplierId: 1, name: 'Updated Supplier 1', description: 'Updated supplier' };
		var response = await request(app).put('/suppliers/1').send(updatedSupplier);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedSupplier);
	});

	it('should delete a supplier by ID', async () => {
		var response = await request(app).delete('/suppliers/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing supplier', async () => {
		var response = await request(app).get('/suppliers/999');
		expect(response.status).toBe(404);
	});
});