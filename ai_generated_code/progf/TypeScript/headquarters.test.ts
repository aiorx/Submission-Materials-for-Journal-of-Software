// Supported via standard GitHub programming aids
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import headquartersRouter from './headquarters';

const app = express();
app.use(express.json());
app.use('/headquarters', headquartersRouter);

describe('Headquarters API', () => {
	it('should create a new headquarters', async () => {
		const newHeadquarters = { 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		};
		const response = await request(app).post('/headquarters').send(newHeadquarters);
		expect(response.status).toBe(201);
		expect(response.body).toEqual(newHeadquarters);
	});

	it('should get all headquarters', async () => {
		const response = await request(app).get('/headquarters');
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		}]);
	});

	it('should get a headquarters by ID', async () => {
		const response = await request(app).get('/headquarters/1');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ 
			headquartersId: 1, 
			name: 'Headquarters 1', 
			description: 'Test headquarters' 
		});
	});

	it('should update a headquarters by ID', async () => {
		const updatedHeadquarters = { 
			headquartersId: 1, 
			name: 'Updated Headquarters 1', 
			description: 'Updated headquarters' 
		};
		const response = await request(app).put('/headquarters/1').send(updatedHeadquarters);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(updatedHeadquarters);
	});

	it('should delete a headquarters by ID', async () => {
		const response = await request(app).delete('/headquarters/1');
		expect(response.status).toBe(204);
	});

	it('should return 404 for non-existing headquarters', async () => {
		const response = await request(app).get('/headquarters/999');
		expect(response.status).toBe(404);
	});
});