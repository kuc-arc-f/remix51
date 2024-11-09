import React from 'react';
import { json, type ActionFunction } from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//import { todoSchema } from "~/schemas/todo.schema";
import { todoSchema } from "./Form3/TodoSchema";
import TodoForm from "./Form3/TodoForm"
//
type ActionData = {
  errors?: {
    title?: string;
    content?: string;
    qty1?: string;
    qty2?: string;
    qty3?: string;
    formError?: string;
  };
  fields?: {
    title: string;
    content: string;
    public: "public" | "private";
    food_orange: boolean;
    food_apple: boolean;
    food_banana: boolean;
    pub_date: string;
    qty1: string;
    qty2: string;
    qty3: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fields = {
    title: formData.get("title"),
    content: formData.get("content"),
    public: formData.get("public"),
    food_orange: formData.get("food_orange") === "on",
    food_apple: formData.get("food_apple") === "on",
    food_banana: formData.get("food_banana") === "on",
    pub_date: formData.get("pub_date"),
    qty1: formData.get("qty1"),
    qty2: formData.get("qty2"),
    qty3: formData.get("qty3"),
  };

  const result = todoSchema.safeParse(fields);

  if (!result.success) {
    const errors = result.error.formErrors.fieldErrors;
    return json<ActionData>({
      errors,
      fields: fields as ActionData["fields"],
    });
  }

  try {
    // TODO: ここでデータベースに保存する処理を実装
    return json({ success: true });
  } catch (error) {
    return json<ActionData>({
      errors: {
        formError: "TODOの保存中にエラーが発生しました",
      },
      fields: fields as ActionData["fields"],
    });
  }
};

export default function TodoRoute() {
  const actionData = useActionData<ActionData>();
  const [todos, setTodos] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingTodo, setEditingTodo] = React.useState(null);

  const handleAddTodo = (newTodo) => {
    setTodos(prev => [...prev, { ...newTodo, id: Date.now() }]);
    setIsAddDialogOpen(false);
  };

  const handleEditTodo = (updatedTodo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    setEditingTodo(null);
  };

  const handleDeleteTodo = (todoId) => {
    if (window.confirm('本当に削除しますか？')) {
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ... 残りのコンポーネントコード
  return (
  <div className="p-4 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">TODOリスト</h1>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>新規追加</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規TODO追加</DialogTitle>
          </DialogHeader>
          <TodoForm onSubmit={handleAddTodo} mode="create" />
        </DialogContent>
      </Dialog>
    </div>
  </div>

  );
}
