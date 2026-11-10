// Assisted using common GitHub development utilities
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter from './order';

const app = express();
app.use(express.json());
app.use('/orders', orderRouter);

describe('Order API', () => {
	it('should create a new order', async () => {
		const newOrder = { 
			orderId: 1, 
			orderDate: new Date('2023-01-01').toISOString(), 
			headquartersId: 1,
			name: 'Order 1', 
			description: 'Test order'
		};
		const response = await request(app).post('/orders').send(newOrder);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newOrder);
	});

	it('should get all orders', async () => {
		const response = await request(app).get('/orders');
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
		const response = await request(app).get('/orders/1');
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
		const updatedOrder = { 
			orderId: 1, 
			orderDate: new Date('2023-01-02').toISOString(), 
			headquartersId: 1,
			name: 'Updated Order 1', 
			description: 'Updated order'
		};
		const response = await request(app).put('/orders/1').send(updatedOrder);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedOrder);
	});

	it('should delete an order by ID', async () => {
		const response = await request(app).delete('/orders/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing order', async () => {
		const response = await request(app).get('/orders/999');
		expect(response.status).toBe(404);
	});
});