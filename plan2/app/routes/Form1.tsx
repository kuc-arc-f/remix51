import type { MetaFunction } from "@remix-run/node";

// app/routes/todos.jsx
import TodoList from './Form1/TodoList';

export default function Todos() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      <TodoList />
    </div>
  );
}
