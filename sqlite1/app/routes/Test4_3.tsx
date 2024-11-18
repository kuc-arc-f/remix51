
import { z } from "zod";
export const todoSchema = z.object({
  title: z.string().min(1, { message: "TODOを入力してください" }),
});
export type TodoSchema = z.infer<typeof todoSchema>;

// app/routes/_index.tsx
import { useState , useEffect } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import * as TodoModel from "../models/Test4_3/todo.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await TodoModel.getTodos();
  return json({ data });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "create" || action === "update") {
    const title = formData.get("title");
    const result = todoSchema.safeParse({ title });

    if (!result.success) {
      return json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (action === "create") {
      const todo = await TodoModel.createTodo(result.data.title);
      return json({ todo });
    } else {
      const id = formData.get("id") as string;
      const todo = await TodoModel.updateTodo(id, result.data.title);
      return json({ todo });
    }
  }

  if (action === "delete") {
    const id = formData.get("id") as string;
    await TodoModel.deleteTodo(id);
    return json({ success: true });
  }

  if (action === "toggle") {
    const id = formData.get("id") as string;
    const todo = await TodoModel.toggleTodo(id);
    return json({ todo });
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const [todos, setTodos] = useState([]);
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoModel.Todo | null>(null);

  const isSubmitting = navigation.state === "submitting";

  // 検索結果のフィルタリング
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setTodos(data);
  }, []);  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO App</h1>
      
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="TODOを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規TODO作成</DialogTitle>
            </DialogHeader>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.set("_action", "create");
                submit(formData, { method: "post" });
                if (!actionData?.errors) {
                  setIsAddDialogOpen(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <Input
                  name="title"
                  placeholder="TODOを入力..."
                  disabled={isSubmitting}
                />
                {actionData?.errors?.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {actionData.errors.title}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "追加中..." : "追加"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>完了</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>作成日時</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <form method="post">
                  <input type="hidden" name="id" value={todo.id} />
                  <input type="hidden" name="_action" value="toggle" />
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                      const formData = new FormData();
                      formData.set("id", todo.id);
                      formData.set("_action", "toggle");
                      submit(formData, { method: "post" });
                    }}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                  />
                </form>
              </TableCell>
              <TableCell className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </TableCell>
              <TableCell>
                {new Date(todo.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingTodo(todo)}
                        disabled={isSubmitting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>TODO編集</DialogTitle>
                      </DialogHeader>
                      <form
                        method="post"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          formData.set("_action", "update");
                          formData.set("id", editingTodo?.id || "");
                          submit(formData, { method: "post" });
                          if (!actionData?.errors) {
                            setIsEditDialogOpen(false);
                            setEditingTodo(null);
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Input
                            name="title"
                            defaultValue={editingTodo?.title}
                            disabled={isSubmitting}
                          />
                          {actionData?.errors?.title && (
                            <p className="text-sm text-red-500 mt-1">
                              {actionData.errors.title}
                            </p>
                          )}
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "更新中..." : "更新"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <form
                    method="post"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData();
                      formData.set("id", todo.id);
                      formData.set("_action", "delete");
                      submit(formData, { method: "post" });
                    }}
                  >
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="_action" value="delete" />
                    <Button
                      variant="outline"
                      size="icon"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
