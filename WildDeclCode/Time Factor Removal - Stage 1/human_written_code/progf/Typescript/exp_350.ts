var Resolver = require('@nestjs/graphql').Resolver;
var Query = require('@nestjs/graphql').Query;
var Mutation = require('@nestjs/graphql').Mutation;
var Args = require('@nestjs/graphql').Args;
var ResolveField = require('@nestjs/graphql').ResolveField;
var Parent = require('@nestjs/graphql').Parent;
var LessonType = require('./lesson.type').LessonType;
var LessonService = require('./lesson.service').LessonService;
var CreateLessonInput = require('./lesson.input').CreateLessonInput;
var AssignStudentsToLessonInput = require('./assign-students-to-lesson.input').AssignStudentsToLessonInput;
var Lesson = require('./lesson.entity').Lesson;
var StudentService = require('../student/student.service').StudentService;

@Resolver(function of { return LessonType; })
class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query(function returns { return LessonType; })
  lesson(
    @Args('id') id: string,
  ) {
    return this.lessonService.getLesson(id);
  }

  @Query(function returns { return [LessonType]; })
  lessons() {
    return this.lessonService.getLessons();
  }

  @Mutation(function returns { return LessonType; })
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput, 
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation(function returns { return LessonType; })
  assignStudentsToLesson(
    @Args('assignStudentsToLessonInput') assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ) {
    var lessonId = assignStudentsToLessonInput.lessonId;
var studentIds = assignStudentsToLessonInput.studentIds;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students);
  }
}