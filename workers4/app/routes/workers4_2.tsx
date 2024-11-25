// app/types.ts
export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}
  
// app/lib/validations/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
title: z.string().min(1, "タイトルは必須です"),
description: z.string().optional(),
completed: z.boolean().default(false),
});

export type TodoFormData = z.infer<typeof todoSchema>;

// app/routes/_index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
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
import { AddTodoDialog } from "~/components/AddTodoDialog";
import { EditTodoDialog } from "~/components/EditTodoDialog";
//import { type Todo } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  //console.log("search=", search);
  let apiUrl = "/api/todos";
  console.log("apiUrl=", apiUrl);
  if (search) {
      apiUrl = `/api/todos/search?q=${encodeURIComponent(search)}`;
  }

  const response = await fetch(`${apiUrlBase}${apiUrl}`);
  const todos = await response.json();

  return json({ todos, search });
}

export default function Index() {
  const { todos, search } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleSearch = (value: string) => {
    submit({ q: value }, { method: "get" });
  };

  const handleDelete = async (id: number) => {
    let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
    if (!confirm("このTODOを削除してもよろしいですか？")) return;

    await fetch(`${apiUrlBase}/api/todos/${id}`, {
      method: "DELETE",
    });
    submit(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TODOリスト</h1>
        <Button onClick={() => setIsAddOpen(true)}>新規作成</Button>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="TODOを検索..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>説明</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo: Todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>
                {todo.completed ? "完了" : "未完了"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTodo(todo);
                      setIsEditOpen(true);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(todo.id)}
                  >
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddTodoDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={() => submit(null)}
      />

      <EditTodoDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        todo={selectedTodo}
        onSuccess={() => submit(null)}
      />
    </div>
  );
}

// app/components/AddTodoDialog.tsx
import { useState } from "react";
//  import { todoSchema, type TodoFormData } from "~/lib/validations/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTodoDialog({ open, onOpenChange, onSuccess }: AddTodoDialogProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    completed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        completed: formData.get("completed") === "true",
      };
      console.log(data);

      todoSchema.parse(data);
      setErrors({});
      
      formData.append("_action", action);
      submit(formData, { method: "post" });
      //setIsEditDialogOpen(false);
      onOpenChange(false);
      setFormData({ title: "", description: "", completed: false });
      //toast.success(`Todo ${action === "create" ? "created" : "updated"} successfully`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as { [key: string]: string });
        setErrors(errors);
      }
    }    
    /*
    try {
      const validated = todoSchema.parse(formData);
      let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
      await fetch(`${apiUrlBase}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      onSuccess();
      onOpenChange(false);
      setFormData({ title: "", description: "", completed: false });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
    */
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規TODO作成</DialogTitle>
        </DialogHeader>
        {/* form onSubmit={handleSubmit} className="space-y-4" */}
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-4">
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <Button type="submit">作成</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// app/components/EditTodoDialog.tsx
import { useEffect, useState } from "react";
//  import { todoSchema, type TodoFormData } from "~/lib/validations/todo";
//import { type Todo } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EditTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
  onSuccess: () => void;
}

export function EditTodoDialog({
  open,
  onOpenChange,
  todo,
  onSuccess,
}: EditTodoDialogProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        completed: todo.completed,
      });
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo) return;

    try {
      const validated = todoSchema.parse(formData);
      let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
      await fetch(`${apiUrlBase}/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      onSuccess();
      onOpenChange(false);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>TODO編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">タイトル</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-description">説明</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-completed"
              checked={formData.completed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, completed: checked as boolean })
              }
            />
            <Label htmlFor="edit-completed">完了</Label>
          </div>
          <Button type="submit">更新</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
