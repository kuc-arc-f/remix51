
// app/components/TodoList.tsx
import { useState , useEffect} from 'react'
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
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

interface TodoListProps {
  data: any[],
}

export function TodoList({ data }: TodoListProps) {
  const [todos, setTodos] = useState<TodoData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoData | undefined>()
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const submit = useSubmit();

  useEffect(() => {
    console.log(data);
    setTodos(data);
  }, []);

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTodo = (data: TodoData) => {
console.log(data);
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

  const handleDelete = async(index: number) => {
    try{
      const confirmed = window.confirm('Delete OK ？'); 
      if (confirmed) {
        const target = todos.filter((_, i) => i === index)
        const row = target[0]; 
        console.log(row); 
        const sendFormData = new FormData();
        sendFormData.append("_action", "delete");
        sendFormData.append("id", row.id.toString());
        submit(sendFormData, { method: "post" });
        const newTodos = todos.filter((_, i) => i !== index)
        setTodos(newTodos)
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleEdit = (todo: TodoData, index: number) => {
    console.log("handleEdit.idx=", index); 
    setEditingTodo(todo)
    setEditingIndex(index)
    setIsDialogOpen(true);
    setTimeout(() => {
      const elem = document.getElementById("public"); 
      if(elem) { 
        //console.log(elem); 
        elem.focus(); 
      } 
    }, 100);   
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
        <a href="/form12create"> 
          <Button>Add Todo</Button>
        </a>
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
                {/*
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(todo, index)}
                  className="mr-2"
                >
                  Edit
                </Button>
                */}
                <a href={`/form12edit?id=${todo.id}`}>
                  <Button variant="outline" size="icon" className="mr-2">
                    Edit  
                  </Button>      
                </a>

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

    </div>
  )
}
/*
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
 */