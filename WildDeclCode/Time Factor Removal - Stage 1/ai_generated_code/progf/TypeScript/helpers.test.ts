// Unit tests for the utils/helpers.ts file

var Op = require('sequelize').Op;
var getPagination = require('../utils/helpers').getPagination;
var querifyStringFields = require('../utils/helpers').querifyStringFields;
var ZSubjectFind = require('../validator/subject.validator').ZSubjectFind;
var ZStudyClassFind = require('../validator/studyClass.validator').ZStudyClassFind;

// This was made with the help of Github Copilot (first time using it)
describe('getPagination() function unit tests', function () {
  test('should return an object with offset and limit', () => {
    var obj = getPagination({ page: 1, size: 10 });

    expect(obj).toHaveProperty('offset');
    expect(obj).toHaveProperty('limit');

    expect(obj.offset).toBe(0);
    expect(obj.limit).toBe(10);
  });

  test('getPagination() returns rest of the object', () => {
    var obj = getPagination({ page: 1, size: 10, name: 'test', age: 2 });

    expect(obj.rest).toEqual({ name: 'test', age: 2 });
  });
});

describe('querifyStringFields() function unit tests', function () {
  test('Try on Subject model', () => {
    // You can do it like this:
    var query = ZSubjectFind.parse.query;({
      query: { name: 'test', subjectId: '123' },
    });

    var querified = querifyStringFields(query, ZSubjectFind.shape.query);

    expect(querified.name).toStrictEqual({ [Op.like]: '%test%' });

    // subjectId is ZodString, that's why it is "querified".
    expect(querified.subjectId).toStrictEqual({ [Op.like]: '%123%' });
    expect(querified.page).toBe(1);
    expect(querified.size).toBe(10);
  });

  test('Try on StudyClass model', () => {
    // or like this:
    var query = ZStudyClassFind.shape.query.parse({
      educationType: 'Literature',
      studyYear: '1',
      classId: '123',
    });

    var querified = querifyStringFields(query, ZStudyClassFind.shape.query);

    // Enums stay the same.
    expect(querified.educationType).toStrictEqual('Literature');
    expect(querified.studyYear).toStrictEqual('1');
    expect(querified.classId).toStrictEqual({ [Op.like]: '%123%' });
  });
});
