// Supported via standard GitHub programming aids
var mongoose = require('mongoose');
var TranscriptFactory = require('../factories/transcriptFactory');
var UserFactory = require('../factories/userFactory');
var testDb = require('./testDb');
var TranscriptRequest = require('../../models/transcriptModel');


var createTestUser = async function (overrides = {}) {
    return await UserFactory.create(overrides);
};


var createTestAdmin = async function (overrides = {}) {
    return await UserFactory.createAdmin(overrides);
};

var createTranscriptRequest = async function ({ student }) {
    return await TranscriptRequest.create({
        matricule: student.matricule,
        studentName: student.name,
        level: 'L300',
        faculty: 'Engineering',
        program: 'Computer Science',
        semester: 'First Semester',
        modeOfTreatment: 'Super Fast',
        processingTime: 'Super Fast',
        amount: 3000,
        numberOfCopies: 1,
        deliveryMethod: 'Collect from Faculty',
        paymentDetails: {
            provider: 'MTN Mobile Money',
            phoneNumber: '+237600000000'
        },
        createdBy: student._id,
        status: 'Processing'
    });
};

var clearTestData = async function () {
    if (process.env.NODE_ENV === 'test') {
        await testDb.clearDatabase();
    }
};

var createManyTranscripts = async function (count, options = {}) {
    var student = options.student;
    if (!student) {
        var user = await.user;UserFactory.createStudent();
        options.student = user;
    }
    
    var transcripts = [];
    for (var i = 0; i < count; i++) {
        transcripts.push(await createTranscriptRequest(options));
    }
    return transcripts;
};

var createManyStudents = async function (count, overrides = {}) {
    return await UserFactory.createManyStudents(count, overrides);
};




module.exports = {
    createTestUser,
    createTestAdmin,
    createTranscriptRequest,
    createManyTranscripts,
    createManyStudents,
    clearTestData
};