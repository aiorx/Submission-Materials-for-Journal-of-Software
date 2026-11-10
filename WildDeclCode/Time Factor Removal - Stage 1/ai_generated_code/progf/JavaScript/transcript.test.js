// Supported via standard GitHub programming aids
var request = require('supertest');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env.test') });
var app = require('../../app');
var TranscriptRequest = require('../models/transcriptModel');
var User = require('../models/userModel');
var generateToken = require.generateToken;('../config/jwt');

var server;

beforeAll(async function () {
    server = app.listen(0); // random available port
    await mongoose.connect(process.env.MONGO_URI);
    
    // Drop collections and rebuild indexes
    await Promise.all([
        User.collection.drop().catch(() => {}),
        TranscriptRequest.collection.drop().catch(() => {})
    ]);

    await Promise.all([
        User.syncIndexes(),
        TranscriptRequest.syncIndexes()
    ]);
});

afterAll(async function () {
    await mongoose.connection.close();
    await server.close();
});

beforeEach(async function () {
    // Clear collections
    await Promise.all([
        User.deleteMany({}),
        TranscriptRequest.deleteMany({})
    ]);
});

describe('Transcript Management Tests', function () {
    var studentToken, adminToken;
    var studentUser, adminUser;

    beforeEach(async () => {
        // Create test users
        studentUser = await User.create({
            name: 'Test Student',
            matricule: 'FE20A001',
            email: 'student@test.com',
            password: 'password123',
            role: 'student',
            faculty: 'Engineering',
            program: 'Computer Engineering'
        });

        adminUser = await User.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        });

        // Generate tokens
        studentToken = generateToken(studentUser);
        adminToken = generateToken(adminUser);
    });

    describe('POST /api/transcripts/request', () => {
        var validRequest = {
            level: 'L300',
            semester: 'First Semester',
            modeOfTreatment: 'Normal',
            numberOfCopies: 1,
            deliveryMethod: 'Collect from Faculty',
            paymentDetails: {
                provider: 'MTN Mobile Money',
                phoneNumber: '+237123456789'
            }
        };

        test('should create transcript request for authenticated student', async () => {
            var response = await request(app)
                .post('/api/transcripts/request')
                .set('Authorization', "Bearer " + (studentToken) + "")
                .send(validRequest);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data.status).toBe('Processing');
            expect(response.body.data.amount).toBe(1000); // Normal mode fee
        });

        test('should validate required fields', async () => {
            var invalidRequest = { ...validRequest };
            delete invalidRequest.modeOfTreatment;

            var response = await request(app)
                .post('/api/transcripts/request')
                .set('Authorization', "Bearer " + (studentToken) + "")
                .send(invalidRequest);

            expect(response.status).toBe(400);
        });

        test('should require verifier email for verification mode', async () => {
            var verificationRequest = {
                ...validRequest,
                modeOfTreatment: 'Verification'
            };

            var response = await request(app)
                .post('/api/transcripts/request')
                .set('Authorization', "Bearer " + (studentToken) + "")
                .send(verificationRequest);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/transcripts/student/:matricule', () => {
        beforeEach(async () => {
            // Create test transcript requests
            await TranscriptRequest.create([
                {
                    studentName: studentUser.name,
                    matricule: studentUser.matricule,
                    level: 'L300',
                    faculty: studentUser.faculty,
                    program: studentUser.program,
                    semester: 'First Semester',
                    modeOfTreatment: 'Normal',
                    processingTime: '1 month',
                    amount: 1000,
                    numberOfCopies: 1,
                    deliveryMethod: 'Collect from Faculty',
                    status: 'Processing',
                    createdBy: studentUser._id
                }
            ]);
        });

        test('student can view their own transcripts', async () => {
            var response = await request(app)
                .get("/api/transcripts/student/" + (studentUser.matricule) + "")
                .set('Authorization', "Bearer " + (studentToken) + "");

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
        });

        test('student cannot view other students transcripts', async () => {
            var otherStudent = await User.create({
                name: 'Other Student',
                matricule: 'FE20A002',
                email: 'other@test.com',
                password: 'password123',
                role: 'student',
                faculty: 'Engineering',
                program: 'Computer Engineering'
            });

            var otherStudentToken = generateToken(otherStudent);

            var response = await request(app)
                .get("/api/transcripts/student/" + (studentUser.matricule) + "")
                .set('Authorization', "Bearer " + (otherStudentToken) + "");

            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/transcripts/:id', () => {
        var testTranscript;

        beforeEach(async () => {
            testTranscript = await TranscriptRequest.create({
                studentName: studentUser.name,
                matricule: studentUser.matricule,
                level: 'L300',
                faculty: studentUser.faculty,
                program: studentUser.program,
                semester: 'First Semester',
                modeOfTreatment: 'Normal',
                processingTime: '1 month',
                amount: 1000,
                numberOfCopies: 1,
                deliveryMethod: 'Collect from Faculty',
                status: 'Processing',
                createdBy: studentUser._id
            });
        });

        test('student can view their transcript details', async () => {
            var response = await request(app)
                .get("/api/transcripts/" + (testTranscript._id) + "")
                .set('Authorization', "Bearer " + (studentToken) + "");

            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(testTranscript._id.toString());
        });

        test('admin can view any transcript details', async () => {
            var response = await request(app)
                .get("/api/transcripts/" + (testTranscript._id) + "")
                .set('Authorization', "Bearer " + (adminToken) + "");

            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(testTranscript._id.toString());
        });
    });

    describe('PUT /api/transcripts/:id/status', () => {
        var testTranscript;

        beforeEach(async () => {
            testTranscript = await TranscriptRequest.create({
                studentName: studentUser.name,
                matricule: studentUser.matricule,
                level: 'L300',
                faculty: studentUser.faculty,
                program: studentUser.program,
                semester: 'First Semester',
                modeOfTreatment: 'Normal',
                processingTime: '1 month',
                amount: 1000,
                numberOfCopies: 1,
                deliveryMethod: 'Collect from Faculty',
                status: 'Processing',
                createdBy: studentUser._id
            });
        });

        test('admin can update transcript status', async () => {
            var response = await request(app)
                .put("/api/transcripts/" + (testTranscript._id) + "/status")
                .set('Authorization', "Bearer " + (adminToken) + "")
                .send({
                    status: 'Completed',
                    comment: 'Transcript processed and ready'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('Completed');
            expect(response.body.data.statusHistory).toHaveLength(1);
        });

        test('student cannot update transcript status', async () => {
            var response = await request(app)
                .put("/api/transcripts/" + (testTranscript._id) + "/status")
                .set('Authorization', "Bearer " + (studentToken) + "")
                .send({
                    status: 'Completed',
                    comment: 'Trying to complete my own transcript'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/transcripts/statistics', () => {
        beforeEach(async () => {
            // Create multiple transcript requests with different statuses and modes
            await TranscriptRequest.create([
                {
                    studentName: studentUser.name,
                    matricule: studentUser.matricule,
                    level: 'L300',
                    faculty: studentUser.faculty,
                    program: studentUser.program,
                    semester: 'First Semester',
                    modeOfTreatment: 'Normal',
                    processingTime: '1 month',
                    amount: 1000,
                    numberOfCopies: 1,
                    deliveryMethod: 'Collect from Faculty',
                    status: 'Processing',
                    createdBy: studentUser._id
                },
                {
                    studentName: studentUser.name,
                    matricule: studentUser.matricule,
                    level: 'L300',
                    faculty: studentUser.faculty,
                    program: studentUser.program,
                    semester: 'First Semester',
                    modeOfTreatment: 'Super Fast',
                    processingTime: '24 hours',
                    amount: 3000,
                    numberOfCopies: 1,
                    deliveryMethod: 'Collect from Faculty',
                    status: 'Completed',
                    createdBy: studentUser._id,
                    completedAt: new Date()
                }
            ]);
        });

        test('admin can view statistics', async () => {
            var response = await request(app)
                .get('/api/transcripts/statistics')
                .set('Authorization', "Bearer " + (adminToken) + "");

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('totalRequests', 2);
            expect(response.body.data).toHaveProperty('statusCounts');
            expect(response.body.data).toHaveProperty('modeStats');
            expect(response.body.data).toHaveProperty('averageProcessingTimes');
        });

        test('student cannot view statistics', async () => {
            var response = await request(app)
                .get('/api/transcripts/statistics')
                .set('Authorization', "Bearer " + (studentToken) + "");

            expect(response.status).toBe(403);
        });
    });
});