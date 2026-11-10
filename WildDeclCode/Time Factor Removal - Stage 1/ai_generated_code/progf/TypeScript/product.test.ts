// Aided with basic GitHub coding tools
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var productRouter = require('./product');

var app = express();
app.use(express.json());
app.use('/products', productRouter);

describe('Product API', function () {
	it('should create a new product', async () => {
		var newProduct = { productId: 1, supplierId: 1, price: 29.99, name: 'Product 1', description: 'Test product' };
		var response = await request(app).post('/products').send(newProduct);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newProduct);
	});

	it('should get all products', async () => {
		var response = await request(app).get('/products');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ productId: 1, supplierId: 1, price: 29.99, name: 'Product 1', description: 'Test product' }]);
	});

	it('should get a product by ID', async () => {
		var response = await request(app).get('/products/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ productId: 1, supplierId: 1, price: 29.99, name: 'Product 1', description: 'Test product' });
	});

	it('should update a product by ID', async () => {
		var updatedProduct = { productId: 1, supplierId: 1, price: 39.99, name: 'Updated Product 1', description: 'Updated product' };
		var response = await request(app).put('/products/1').send(updatedProduct);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedProduct);
	});

	it('should delete a product by ID', async () => {
		var response = await request(app).delete('/products/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing product', async () => {
		var response = await request(app).get('/products/999');
		expect(response.status).toBe(404);
	});
});