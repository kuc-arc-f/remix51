// app/routes/todo.tsx
import { json, type ActionFunction } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { Form, useActionData , useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean().optional(),
  food_apple: z.boolean().optional(),
  food_banana: z.boolean().optional(),
  food_melon: z.boolean().optional(),
  food_grape: z.boolean().optional(),
  pub_date1: z.string().optional(),
  pub_date2: z.string().optional(),
  pub_date3: z.string().optional(),
  pub_date4: z.string().optional(),
  pub_date5: z.string().optional(),
  pub_date6: z.string().optional(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
  qty4: z.string().min(1, "数量4を入力してください"),
  qty5: z.string().min(1, "数量5を入力してください"),
  qty6: z.string().min(1, "数量6を入力してください"),
});

export type TodoSchema = z.infer<typeof todoSchema>;

interface Todo {
  id: string;
  title: string;
  content: string;
  public: boolean;
  food_orange: boolean;
  food_apple: boolean;
  food_banana: boolean;
  food_melon: boolean;
  food_grape: boolean;
  pub_date1: string;
  pub_date2: string;
  pub_date3: string;
  pub_date4: string;
  pub_date5: string;
  pub_date6: string;
  qty1: string;
  qty2: string;
  qty3: string;
  qty4: string;
  qty5: string;
  qty6: string;
}
interface ActionData {
  errors?: {
    title?: string[];
    content?: string[];
    qty1?: string[];
    qty2?: string[];
    qty3?: string[];
    qty4?: string[];
    qty5?: string[];
    qty6?: string[];
    formError?: string[];
  };
}

export const TodoForm = ({ todo, mode }: { todo?: Todo; mode: "add" | "edit" }) => {
  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="id" value={todo?.id} />
      <input type="hidden" name="_action" value={mode} />
      
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
        <Textarea
          id="content"
          name="content"
          defaultValue={todo?.content}
          required
        />
      </div>

      <div>
        <Label>公開設定</Label>
        <RadioGroup defaultValue={todo?.public ? "public" : "private"} name="public">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">公開</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">非公開</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>フルーツ選択</Label>
        <div className="space-y-2">
          {[
            { id: "food_orange", label: "オレンジ" },
            { id: "food_apple", label: "りんご" },
            { id: "food_banana", label: "バナナ" },
            { id: "food_melon", label: "メロン" },
            { id: "food_grape", label: "ぶどう" },
          ].map((fruit) => (
            <div key={fruit.id} className="flex items-center space-x-2">
              <Checkbox
                id={fruit.id}
                name={fruit.id}
                defaultChecked={todo?.[fruit.id as keyof Todo] as boolean}
              />
              <Label htmlFor={fruit.id}>{fruit.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="space-y-2">
            <Label htmlFor={`pub_date${num}`}>日付 {num}</Label>
            <Input
              type="date"
              id={`pub_date${num}`}
              name={`pub_date${num}`}
              defaultValue={todo?.[`pub_date${num}` as keyof Todo] as string}
            />
            <Label htmlFor={`qty${num}`}>数量 {num}</Label>
            <Input
              type="text"
              id={`qty${num}`}
              name={`qty${num}`}
              defaultValue={todo?.[`qty${num}` as keyof Todo] as string}
            />
          </div>
        ))}
      </div>

      <Button type="submit">{mode === "add" ? "追加" : "更新"}</Button>
    </Form>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  //await requireUserSession(request);
  //const resulte = await CrudIndex.getList();
//console.log(resulte);
  return json({ todos: [] });
};

export default function TodoPage() {
  const [searchTerm, setSearchTerm] = useState("");
//  const { todos } = useLoaderData<{ todos: Todo[] }>();
  const { todos } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>新規追加</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>TODO追加</DialogTitle>
            </DialogHeader>
            <TodoForm mode="add" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{todo.title}</h2>
                <p className="mt-2">{todo.content}</p>
              </div>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditingTodo(todo)}
                    >
                      編集
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>TODO編集</DialogTitle>
                    </DialogHeader>
                    <TodoForm todo={todo} mode="edit" />
                  </DialogContent>
                </Dialog>
                <Form method="post" style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={todo.id} />
                  <input type="hidden" name="_action" value="delete" />
                  <Button variant="destructive" type="submit">
                    削除
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  // ここでデータベースとの連携処理を実装します
  // 例: prisma clientを使用してCRUD操作を行う

  switch (action) {
    case "add":
      // TODO追加の処理
      break;
    case "edit":
      // TODO編集の処理
      break;
    case "delete":
      // TODO削除の処理
      break;
  }

  return json({ success: true });
};
