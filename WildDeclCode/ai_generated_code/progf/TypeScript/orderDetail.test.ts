// Aided with basic GitHub coding tools
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailRouter from './orderDetail';

const app = express();
app.use(express.json());
app.use('/order-details', orderDetailRouter);

describe('OrderDetail API', () => {
	it('should create a new order detail', async () => {
		const newOrderDetail = { 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 5,
			name: 'Order Detail 1', 
			description: 'Test order detail'
		};
		const response = await request(app).post('/order-details').send(newOrderDetail);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newOrderDetail);
	});

	it('should get all order details', async () => {
		const response = await request(app).get('/order-details');
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
		const response = await request(app).get('/order-details/1');
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
		const updatedOrderDetail = { 
			orderDetailId: 1, 
			productId: 1, 
			orderId: 1, 
			productQuantity: 10,
			name: 'Updated Order Detail 1', 
			description: 'Updated order detail'
		};
		const response = await request(app).put('/order-details/1').send(updatedOrderDetail);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedOrderDetail);
	});

	it('should delete an order detail by ID', async () => {
		const response = await request(app).delete('/order-details/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing order detail', async () => {
		const response = await request(app).get('/order-details/999');
		expect(response.status).toBe(404);
	});
});