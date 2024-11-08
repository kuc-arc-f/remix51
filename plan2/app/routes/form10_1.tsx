// app/routes/_index.tsx
import { TodoList } from "./form10_1/TodoList"

export default function Index() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Todo Manager</h1>
      <TodoList />
    </div>
  )
}
