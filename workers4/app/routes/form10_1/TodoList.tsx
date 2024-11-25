
// app/components/TodoList.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TodoDialog, TodoData } from './TodoDialog'

export function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoData | undefined>()
  const [editingIndex, setEditingIndex] = useState<number>(-1)

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTodo = (data: TodoData) => {
    setTodos([...todos, data])
    setIsDialogOpen(false)
  }

  const handleEditTodo = (data: TodoData) => {
    const newTodos = [...todos]
    newTodos[editingIndex] = data
    setTodos(newTodos)
    setIsDialogOpen(false)
    setEditingTodo(undefined)
    setEditingIndex(-1)
  }

  const handleDelete = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index)
    setTodos(newTodos)
  }

  const handleEdit = (todo: TodoData, index: number) => {
    setEditingTodo(todo)
    setEditingIndex(index)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsDialogOpen(true)}>Add Todo</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo, index) => (
            <TableRow key={index}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>{todo.content_type}</TableCell>
              <TableCell>{todo.public ? 'Public' : 'Private'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(todo, index)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingTodo(undefined)
          setEditingIndex(-1)
        }}
        onSubmit={editingTodo ? handleEditTodo : handleAddTodo}
        initialData={editingTodo}
        mode={editingTodo ? 'edit' : 'create'}
      />
    </div>
  )
}
