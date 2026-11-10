// Aided with basic GitHub coding tools
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter from './supplier';

const app = express();
app.use(express.json());
app.use('/suppliers', supplierRouter);

describe('Supplier API', () => {
	it('should create a new supplier', async () => {
		const newSupplier = { supplierId: 1, name: 'Supplier 1', description: 'Test supplier' };
		const response = await request(app).post('/suppliers').send(newSupplier);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newSupplier);
	});

	it('should get all suppliers', async () => {
		const response = await request(app).get('/suppliers');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ supplierId: 1, name: 'Supplier 1', description: 'Test supplier' }]);
	});

	it('should get a supplier by ID', async () => {
		const response = await request(app).get('/suppliers/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ supplierId: 1, name: 'Supplier 1', description: 'Test supplier' });
	});

	it('should update a supplier by ID', async () => {
		const updatedSupplier = { supplierId: 1, name: 'Updated Supplier 1', description: 'Updated supplier' };
		const response = await request(app).put('/suppliers/1').send(updatedSupplier);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedSupplier);
	});

	it('should delete a supplier by ID', async () => {
		const response = await request(app).delete('/suppliers/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing supplier', async () => {
		const response = await request(app).get('/suppliers/999');
		expect(response.status).toBe(404);
	});
});