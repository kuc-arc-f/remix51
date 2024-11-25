// app/models/todo.server.ts
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(1, "Content is required"),
});

export type Todo = z.infer<typeof TodoSchema>;

// app/routes/_index.tsx
import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
//import { TodoSchema, type Todo } from "~/models/todo.server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Todosデータのモックストレージをサーバーサイドでシミュレート
let TODOS: Todo[] = [];

interface ActionData {
  errors?: {
    title?: string[];
    content?: string[];
  };
  todo?: Todo;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "create" || action === "edit") {
    const title = formData.get("title");
    const content = formData.get("content");
    const id = formData.get("id");

    const result = TodoSchema.safeParse({
      id: id ? parseInt(id.toString()) : undefined,
      title,
      content,
    });

    if (!result.success) {
      return json<ActionData>(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (action === "create") {
      const newTodo = { ...result.data, id: Date.now() };
      TODOS.push(newTodo);
      return json({ todo: newTodo });
    } else {
      TODOS = TODOS.map((todo) =>
        todo.id === parseInt(id!.toString())
          ? { ...result.data, id: parseInt(id!.toString()) }
          : todo
      );
      return json({ todo: result.data });
    }
  }

  if (action === "delete") {
    const id = formData.get("id");
    TODOS = TODOS.filter((todo) => todo.id !== parseInt(id!.toString()));
    return json({});
  }

  return null;
};

export const loader: LoaderFunction = async () => {
  return json({ todos: TODOS });
};

export default function Index() {
  const { todos } = useLoaderData<{ todos: Todo[] }>();
  const actionData = useActionData<ActionData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO App</h1>
      
      {/* 検索バー */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search todos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New TODO</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New TODO</DialogTitle>
          </DialogHeader>
          <Form method="post" className="grid gap-4">
            <input type="hidden" name="_action" value="create" />
            <div>
              <Input
                name="title"
                placeholder="Title"
                defaultValue=""
              />
              {actionData?.errors?.title && (
                <div className="text-red-500 text-sm mt-1">
                  {actionData.errors.title}
                </div>
              )}
            </div>
            <div>
              <Input
                name="content"
                placeholder="Content"
                defaultValue=""
              />
              {actionData?.errors?.content && (
                <div className="text-red-500 text-sm mt-1">
                  {actionData.errors.content}
                </div>
              )}
            </div>
            <Button type="submit">Add</Button>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit TODO</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <Form method="post" className="grid gap-4">
              <input type="hidden" name="_action" value="edit" />
              <input type="hidden" name="id" value={editingTodo.id} />
              <div>
                <Input
                  name="title"
                  placeholder="Title"
                  defaultValue={editingTodo.title}
                />
                {actionData?.errors?.title && (
                  <div className="text-red-500 text-sm mt-1">
                    {actionData.errors.title}
                  </div>
                )}
              </div>
              <div>
                <Input
                  name="content"
                  placeholder="Content"
                  defaultValue={editingTodo.content}
                />
                {actionData?.errors?.content && (
                  <div className="text-red-500 text-sm mt-1">
                    {actionData.errors.content}
                  </div>
                )}
              </div>
              <Button type="submit">Save</Button>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* TODOリスト */}
      <div className="grid gap-4">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{todo.title}</h3>
              <p className="text-gray-600">{todo.content}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingTodo(todo)}
              >
                Edit
              </Button>
              <Form method="post" className="inline">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="id" value={todo.id} />
                <Button
                  type="submit"
                  variant="destructive"
                >
                  Delete
                </Button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
