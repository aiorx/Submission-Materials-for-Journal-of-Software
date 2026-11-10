var TodoItem = require('../models/TodoItem').TodoItem;
var parseUserId = require('../auth/utils').parseUserId;
var CreateTodoRequest = require('../requests/CreateTodoRequest').CreateTodoRequest;
var UpdateTodoRequest = require('../requests/UpdateTodoRequest').UpdateTodoRequest;
var TodoUpdate = require('../models/TodoUpdate').TodoUpdate;
var ToDoAccess = require('../dataLayer/ToDoAccess').ToDoAccess;

const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}

function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return toDoAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  "https://" + (s3BucketName) + ".s3.amazonaws.com/" + (todoId) + "", 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todoId, userId);
}

function generateUploadUrl(todoId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todoId);
}