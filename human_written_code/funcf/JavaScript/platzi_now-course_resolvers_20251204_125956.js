async createTodo(_, { content }) {
  const todo = await Todo.create({ id: uuid(), content, status: 'active' });
  pubsub.publish('todoCreated', todo);
  return todo;
}