// Aided with basic GitHub coding tools
var User = require('../../models/userModel');
var jwt = require('jsonwebtoken');

class UserFactory {
    static async create(overrides = {}) {
        var defaultData = {
            name: "Test User " + (Date.now()) + "",
            email: "user" + (Date.now()) + "@test.com",
            matricule: "TST" + (Date.now()) + "",
            password: 'TestPass123!',
            role: 'student',
            status: 'Active'
        };

        if (defaultData.role === 'student' || overrides.role === 'student') {
            defaultData.faculty = 'Engineering';
            defaultData.program = 'Computer Engineering';
        }

        var userData = { ...defaultData, ...overrides };
        var user = await User.create(userData);
        var token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { user, token };
    }

    static async createStudent(overrides = {}) {
        var defaultData = {
            name: "Test Student " + (Date.now()) + "",
            email: "student" + (Date.now()) + "@test.com",
            matricule: "STU" + (Date.now()) + "",
            faculty: 'Engineering',
            program: 'Computer Engineering',
            password: 'Password123!',
            role: 'student',
            status: 'Active'
        };

        return await this.create({ ...defaultData, ...overrides });
    }

    static async createAdmin(overrides = {}) {
        var defaultData = {
            name: "Admin " + (Date.now()) + "",
            email: "admin" + (Date.now()) + "@test.com",
            matricule: "ADM" + (Date.now()) + "",
            password: 'AdminPass123!',
            role: 'admin',
            status: 'Active'
        };

        return await this.create({ ...defaultData, ...overrides });
    }

    static async createHOD(overrides = {}) {
        var defaultData = {
            name: "HOD " + (Date.now()) + "",
            email: "hod" + (Date.now()) + "@test.com",
            matricule: "HOD" + (Date.now()) + "",
            faculty: 'Engineering',
            program: 'Computer Engineering',
            password: 'HodPass123!',
            role: 'hod',
            status: 'Active'
        };

        return await this.create({ ...defaultData, ...overrides });
    }

    static async createManyStudents(count, overrides = {}) {
        var students = [];
        for (var i = 0; i < count; i++) {
            var student = await this.createStudent(overrides);
            students.push(student);
        }
        return students;
    }
}

module.exports = UserFactory;