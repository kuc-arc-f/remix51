export interface Todo {
    id: string;
    title: string;
    completed: boolean;
  }
  
  // TODOリストをメモリ上で管理（実際のアプリではデータベースを使用）
  let todos: Todo[] = [];
  
  export function getTodos() {
    return todos;
  }
  
  export function addTodo(title: string) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    todos.push(todo);
    return todo;
  }
  
  export function updateTodo(id: string, title: string) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    );
    return todos.find((todo) => todo.id === id);
  }
  
  export function deleteTodo(id: string) {
    todos = todos.filter((todo) => todo.id !== id);
  }
  
  export function toggleTodo(id: string) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }
  