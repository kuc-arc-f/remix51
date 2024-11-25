// app/types/todo.ts
export interface Todo {
  id?: number;
  title: string;
  content: string;
  public: boolean;
  foodOrange: boolean;
  foodApple: boolean;
  foodBanana: boolean;
  pubDate: string;
  qty1: string;
  qty2: string;
  qty3: string;
  createdAt?: string;
  updatedAt?: string;
}

// app/lib/validations/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});

export type TodoFormData = z.infer<typeof todoSchema>;

// app/routes/_index.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
//import { todoSchema } from "~/lib/validations/todo";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "~/components/ui/use-toast";
import Head from '../components/Head';

const API_BASE = import.meta.env.VITE_WORKERS_URL + "/api";

export async function loader() {
  const response = await fetch(`${API_BASE}/todo5`);
  const todos = await response.json();
  return json({ todos });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  console.log("action=", action);

  const data = {
    title: formData.get("title"),
    content: formData.get("content"),
    public: formData.get("public") === "true",
    foodOrange: formData.get("foodOrange") === "true",
    foodApple: formData.get("foodApple") === "true",
    foodBanana: formData.get("foodBanana") === "true",
    pubDate: formData.get("pubDate"),
    qty1: formData.get("qty1"),
    qty2: formData.get("qty2"),
    qty3: formData.get("qty3"),
  };
  //console.log(data);
  try{  
    if (action === "delete") {
      const id = formData.get("id");
      console.log("delete.id=", id);
      await fetch(`${API_BASE}/todo5/${id}`, {
        method: "DELETE",
      });
      return json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    todoSchema.parse(data);

    if (action === "create") {
      await fetch(`${API_BASE}/todo5`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else if (action === "update") {
      const id = formData.get("id");
      await fetch(`${API_BASE}/todo5/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else if (action === "delete") {
    }

    return json({ success: true });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return json({ errors: error.errors }, { status: 400 });
    }
    return json({ error: "An error occurred" }, { status: 500 });
  }
}

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTodos = todos.filter((todo: Todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        public: formData.get("public") === "true",
        foodOrange: formData.get("foodOrange") === "true",
        foodApple: formData.get("foodApple") === "true",
        foodBanana: formData.get("foodBanana") === "true",
        pubDate: formData.get("pubDate"),
        qty1: formData.get("qty1"),
        qty2: formData.get("qty2"),
        qty3: formData.get("qty3"),
      };
      //console.log(data);

      todoSchema.parse(data);
      //formData.append("_action", action);
      submit(formData, { method: "post" });
      
      if (editingTodo) {
        setIsEditOpen(false);
        setEditingTodo(null);
      } else {
        setIsCreateOpen(false);
      }
      
      //toast({
      //   title: editingTodo ? "TODOを更新しました" : "TODOを作成しました",
      //  duration: 3000,
      //});
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          //toast({
          //  title: "エラー",
          //  description: err.message,
          //  variant: "destructive",
          //});
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("このTODOを削除しますか？")) {
      console.log("id=", id);
      const formData = new FormData();
      formData.set("_action", "delete");
      formData.set("id", id.toString());
      submit(formData, { method: "post" });
      
      //toast({
      //  title: "TODOを削除しました",
      //  duration: 3000,
      //});
    }
  };

  const TodoForm = ({ todo }: { todo?: Todo }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_action" value={todo ? "update" : "create"} />
      {todo && <input type="hidden" name="id" value={todo.id} />}
      
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          name="title"
          defaultValue={todo?.title}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">内容</Label>
        <Input
          id="content"
          name="content"
          defaultValue={todo?.content}
          required
        />
      </div>

      <div>
        <Label>公開設定</Label>
        <RadioGroup
          name="public"
          defaultValue={todo?.public ? "true" : "false"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="public-yes" />
            <Label htmlFor="public-yes">公開</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="public-no" />
            <Label htmlFor="public-no">非公開</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>フルーツ選択</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="foodOrange"
            name="foodOrange"
            defaultChecked={todo?.foodOrange}
          />
          <Label htmlFor="foodOrange">オレンジ</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="foodApple"
            name="foodApple"
            defaultChecked={todo?.foodApple}
          />
          <Label htmlFor="foodApple">りんご</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="foodBanana"
            name="foodBanana"
            defaultChecked={todo?.foodBanana}
          />
          <Label htmlFor="foodBanana">バナナ</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="pubDate">公開日</Label>
        <Input
          type="date"
          id="pubDate"
          name="pubDate"
          defaultValue={todo?.pubDate}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="qty1">数量1</Label>
          <Input
            id="qty1"
            name="qty1"
            defaultValue={todo?.qty1}
          />
        </div>
        <div>
          <Label htmlFor="qty2">数量2</Label>
          <Input
            id="qty2"
            name="qty2"
            defaultValue={todo?.qty2}
          />
        </div>
        <div>
          <Label htmlFor="qty3">数量3</Label>
          <Input
            id="qty3"
            name="qty3"
            defaultValue={todo?.qty3}
          />
        </div>
      </div>

      <Button type="submit">
        {todo ? "更新" : "作成"}
      </Button>
    </form>
  );

  return (
  <>
    <Head />
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">TODOリスト</h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            新規作成
          </Button>
        </div>
        
        <Input
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTodos.map((todo: Todo) => (
          <div
            key={todo.id}
            className="p-4 border rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold">{todo.title}</h2>
            <p className="mt-2">{todo.content}</p>
            <div className="mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTodo(todo);
                  setIsEditOpen(true);
                }}
              >
                編集
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(todo.id!)}
              >
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規TODO作成</DialogTitle>
          </DialogHeader>
          <TodoForm />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODO編集</DialogTitle>
          </DialogHeader>
          {editingTodo && <TodoForm todo={editingTodo} />}
        </DialogContent>
      </Dialog>
    </div>
  </>

  );
}
