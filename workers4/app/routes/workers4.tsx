// app/routes/todos.tsx
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
//import { toast } from "sonner";
import Head from '../components/Head';

// スキーマの定義
const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

type Todo = z.infer<typeof todoSchema> & {
  id: number;
  created_at: string;
  updated_at: string;
};
// ローダー関数
export async function loader({ request }: LoaderFunctionArgs) {
  let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
  //console.log("apiUrlBase=", apiUrlBase);  
  let apiUrl = apiUrlBase + "/api/todo4";

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");

  if (searchQuery) {
    apiUrl = `http://your-worker-url/api/todo4/search?query=${encodeURIComponent(searchQuery)}`;
  }
  console.log("apiUrl=", apiUrl);  

  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);
  
  //if (!data.success) {
  //  throw new Error("Failed to fetch todos");
  //}
  return json({ todos: data });
}

// アクション関数
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  switch (action) {
    case "create":
    case "update": {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const completed = formData.get("completed") === "true";
      const id = formData.get("id") as string;

      try {
        const validatedData = todoSchema.parse({ title, description, completed });
        let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
        //console.log("apiUrlBase=", apiUrlBase);
        const response = await fetch(
          `${apiUrlBase}/api/todo4${action === "update" ? `/${id}` : ""}`,
          {
            method: action === "create" ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedData),
          }
        );

        //const result = await response.json();
        //if (!result.success) {
        //  throw new Error(result.error);
        //}

        return json({ success: true });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return json({ errors: error.errors }, { status: 400 });
        }
        return json({ error: "Failed to save todo" }, { status: 500 });
      }
    }
    case "delete": {
      let apiUrlBase = import.meta.env.VITE_WORKERS_URL;
      const id = formData.get("id") as string;
      const response = await fetch(`${apiUrlBase}/api/todo4/${id}`, {
        method: "DELETE",
      });
      
      //const result = await response.json();
      //console.log(result);
      //if (!result.success) {
      //  return json({ error: "Failed to delete todo" }, { status: 500 });
      //}
      
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
}

// メインコンポーネント
export default function Todos() {
  const { todos } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // 検索処理
  const handleSearch = () => {
    submit({ q: searchQuery }, { method: "get" });
  };

  // フォームのバリデーションと送信
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, action: "create" | "update") => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    try {
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        completed: formData.get("completed") === "true",
      };

      todoSchema.parse(data);
      setFormErrors({});
      
      formData.append("_action", action);
      submit(formData, { method: "post" });
      setIsEditDialogOpen(false);
      //toast.success(`Todo ${action === "create" ? "created" : "updated"} successfully`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as { [key: string]: string });
        setFormErrors(errors);
      }
    }
  };

  // 削除処理
  const handleDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  // 編集ダイアログを開く
  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditDialogOpen(true);
  };

  // 削除の確認
  const confirmDelete = () => {
    if (selectedTodo) {
      const formData = new FormData();
      formData.append("_action", "delete");
      formData.append("id", selectedTodo.id.toString());
      submit(formData, { method: "post" });
      setIsDeleteDialogOpen(false);
      //toast.success("Todo deleted successfully");
    }
  };

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">TODOリスト</h1>

      {/* 検索フォーム */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>検索</Button>
      </div>

      {/* 新規作成ボタン */}
      <Dialog open={isEditDialogOpen && !selectedTodo} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setSelectedTodo(null);
      }}>
        <DialogTrigger asChild>
          <Button className="mb-4">新規作成</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規TODO作成</DialogTitle>
            <DialogDescription>
              新しいTODOの詳細を入力してください。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, "create")}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">タイトル</Label>
                <Input id="title" name="title" />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">説明</Label>
                <Textarea id="description" name="description" />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">作成</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TODOリスト */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold">{todo.title}</h3>
              <p className="text-sm text-gray-600">{todo.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(todo)}
              >
                編集
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(todo)}
              >
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen && !!selectedTodo} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setSelectedTodo(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODO編集</DialogTitle>
            <DialogDescription>
              TODOの詳細を編集してください。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, "update")}>
            <input type="hidden" name="id" value={selectedTodo?.id} />
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">タイトル</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={selectedTodo?.title}
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-description">説明</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={selectedTodo?.description}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">更新</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>TODOの削除</AlertDialogTitle>
            <AlertDialogDescription>
              このTODOを削除してもよろしいですか？この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>  
  </>

  );
}
