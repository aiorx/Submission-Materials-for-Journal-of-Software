// Assisted using common GitHub development utilities
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var orderRouter = require('./order');

var app = express();
app.use(express.json());
app.use('/orders', orderRouter);

describe('Order API', function () {
	it('should create a new order', async () => {
		var newOrder = { 
			orderId: 1, 
			orderDate: new Date('2023-01-01').toISOString(), 
			headquartersId: 1,
			name: 'Order 1', 
			description: 'Test order'
		};
		var response = await request(app).post('/orders').send(newOrder);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newOrder);
	});

	it('should get all orders', async () => {
		var response = await request(app).get('/orders');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ 
			orderId: 1, 
			orderDate: new Date('2023-01-01').toISOString(), 
			headquartersId: 1,
			name: 'Order 1', 
			description: 'Test order'
		}]);
	});

	it('should get an order by ID', async () => {
		var response = await request(app).get('/orders/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ 
			orderId: 1, 
			orderDate: new Date('2023-01-01').toISOString(), 
			headquartersId: 1,
			name: 'Order 1', 
			description: 'Test order'
		});
	});

	it('should update an order by ID', async () => {
		var updatedOrder = { 
			orderId: 1, 
			orderDate: new Date('2023-01-02').toISOString(), 
			headquartersId: 1,
			name: 'Updated Order 1', 
			description: 'Updated order'
		};
		var response = await request(app).put('/orders/1').send(updatedOrder);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedOrder);
	});

	it('should delete an order by ID', async () => {
		var response = await request(app).delete('/orders/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing order', async () => {
		var response = await request(app).get('/orders/999');
		expect(response.status).toBe(404);
	});
});