import type { MetaFunction } from "@remix-run/node";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TodoFormDialog from './TodoFormDialog';

const TodoList = () => {
  const [todos, setTodos] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleAdd = (newTodo) => {
    setTodos([...todos, { ...newTodo, id: Date.now() }]);
  };

  const handleEdit = (id, updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...updatedTodo, id } : todo
    ));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <TodoFormDialog title="Add Todo" onSubmit={handleAdd} />
        <Input
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Foods</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Quantities</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>{todo.public}</TableCell>
              <TableCell>
                {[
                  todo.food_orange && 'Orange',
                  todo.food_apple && 'Apple',
                  todo.food_banana && 'Banana'
                ].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>{todo.pub_date}</TableCell>
              <TableCell>
                {[todo.qty1, todo.qty2, todo.qty3].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <TodoFormDialog
                    title="Edit"
                    defaultValues={todo}
                    onSubmit={(updatedTodo) => handleEdit(todo.id, updatedTodo)}
                  />
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodoList;
