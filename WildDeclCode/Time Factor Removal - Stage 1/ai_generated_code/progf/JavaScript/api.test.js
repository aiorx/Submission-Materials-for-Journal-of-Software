// Assisted using common GitHub development utilities
// Jest test for API connectivity
var fetch = require('node-fetch');

describe('API Connectivity', function () {
  var API_URL = 'http://localhost:8081/api/tasks';

  it('should confirm API is available', async () => {
    var response = await fetch(API_URL, {
      method: 'HEAD',
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.ok).toBe(true);
  });

  it('should GET tasks', async () => {
    var response = await fetch(API_URL);
    expect(response.ok).toBe(true);
    var tasks = await response.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should POST and DELETE a task', async () => {
    var testTaskTitle = 'Test task ' + new Date().toISOString();
    var postTask = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: testTaskTitle })
    });
    expect(postTask.ok).toBe(true);
    var newTask = await postTask.json();
    expect(newTask).toHaveProperty('id');

    // Delete the created task
    var deleteTask = await fetch("" + (API_URL) + "/" + (newTask.id) + "", {
      method: 'DELETE'
    });
    expect(deleteTask.ok).toBe(true);
  });
});
