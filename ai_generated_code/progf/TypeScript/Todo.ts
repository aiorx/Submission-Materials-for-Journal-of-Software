function generateRandomId(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomId;
} // Crafted with basic coding tools

class Todo {
  id: string;
  text: string;

  constructor(todoText: string) {
    this.text = todoText;
    this.id = generateRandomId(10);
  }
}

export default Todo;
