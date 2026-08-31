// Assisted using common GitHub development utilities
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter from './delivery';

const app = express();
app.use(express.json());
app.use('/deliveries', deliveryRouter);

describe('Delivery API', () => {
	it('should create a new delivery', async () => {
		const newDelivery = { 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-01').toISOString(), 
			supplierId: 1,
			name: 'Delivery 1', 
			description: 'Test delivery'
		};
		const response = await request(app).post('/deliveries').send(newDelivery);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newDelivery);
	});

	it('should get all deliveries', async () => {
		const response = await request(app).get('/deliveries');
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
		const response = await request(app).get('/deliveries/1');
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
		const updatedDelivery = { 
			deliveryId: 1, 
			deliveryDate: new Date('2023-01-02').toISOString(), 
			supplierId: 1,
			name: 'Updated Delivery 1', 
			description: 'Updated delivery'
		};
		const response = await request(app).put('/deliveries/1').send(updatedDelivery);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedDelivery);
	});

	it('should delete a delivery by ID', async () => {
		const response = await request(app).delete('/deliveries/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing delivery', async () => {
		const response = await request(app).get('/deliveries/999');
		expect(response.status).toBe(404);
	});
});