// Aided with basic GitHub coding tools
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var request = require('supertest');
var express = require('express');
var orderDetailRouter = require('./orderDetail');

var app = express();
app.use(express.json());
app.use('/order-details', orderDetailRouter);

describe('OrderDetail API', function () {
	it('should create a new order detail', async () => {
		var newOrderDetail = { 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 5,
			name: 'Order Detail 1', 
			description: 'Test order detail'
		};
		var response = await request(app).post('/order-details').send(newOrderDetail);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newOrderDetail);
	});

	it('should get all order details', async () => {
		var response = await request(app).get('/order-details');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 5,
			name: 'Order Detail 1', 
			description: 'Test order detail'
		}]);
	});

	it('should get an order detail by ID', async () => {
		var response = await request(app).get('/order-details/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 5,
			name: 'Order Detail 1', 
			description: 'Test order detail'
		});
	});

	it('should update an order detail by ID', async () => {
		var updatedOrderDetail = { 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 10,
			name: 'Updated Order Detail 1', 
			description: 'Updated order detail'
		};
		var response = await request(app).put('/order-details/1').send(updatedOrderDetail);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedOrderDetail);
	});

	it('should delete an order detail by ID', async () => {
		var response = await request(app).delete('/order-details/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing order detail', async () => {
		var response = await request(app).get('/order-details/999');
		expect(response.status).toBe(404);
	});
});