// app/schemas/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.string(),
  foods: z.object({
    orange: z.string().optional(),
    apple: z.string().optional(),
    banana: z.string().optional(),
    melon: z.string().optional(),
    grape: z.string().optional(),
  }),
  dates: z.array(z.string()).length(6),
  quantities: z.array(z.string()).length(6).refine(
    (quantities) => quantities.every(qty => qty.length > 0),
    "すべての数量を入力してください"
  ),
});

export type TodoSchema = z.infer<typeof todoSchema>;

// app/routes/_index.tsx
import { useEffect, useState } from "react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
//import { todoSchema, type TodoSchema } from "~/schemas/todo";

interface Todo extends TodoSchema {
  id: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    public: formData.get("public"),
    foods: {
      orange: formData.get("food_orange"),
      apple: formData.get("food_apple"),
      banana: formData.get("food_banana"),
      melon: formData.get("food_melon"),
      grape: formData.get("food_grape"),
    },
    dates: [
      formData.get("pub_date1"),
      formData.get("pub_date2"),
      formData.get("pub_date3"),
      formData.get("pub_date4"),
      formData.get("pub_date5"),
      formData.get("pub_date6"),
    ],
    quantities: [
      formData.get("qty1"),
      formData.get("qty2"),
      formData.get("qty3"),
      formData.get("qty4"),
      formData.get("qty5"),
      formData.get("qty6"),
    ],
  };
console.log(rawData);
  try {
    const validatedData = todoSchema.parse(rawData);
    
    // ここでデータベースへの保存処理を行う
    // 今回は簡略化のため、検証だけを行います
    
    return json({ success: true, data: validatedData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ 
        success: false, 
        errors: error.errors.reduce((acc, curr) => {
          const path = curr.path.join(".");
          return { ...acc, [path]: curr.message };
        }, {})
      });
    }
    return json({ success: false, errors: { general: "エラーが発生しました" } });
  }
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.success) {
      setIsOpen(false);
      // TODO: ここでTODOリストを更新
    }
    if(actionData?.errors) {
      console.log(actionData?.errors);
      console.log(editingTodo);
    }
  }, [actionData]);

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
      
      <div className="mb-4">
        <Input
          type="text"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>新規TODO作成</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl  max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? "TODO編集" : "新規TODO作成"}
            </DialogTitle>
          </DialogHeader>
          
          <Form method="post" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingTodo?.title}
              />
              {actionData?.errors?.title && (
                <p className="text-red-500 text-sm">{actionData.errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                name="content"
                defaultValue={editingTodo?.content}
              />
              {actionData?.errors?.content && (
                <p className="text-red-500 text-sm">{actionData.errors.content}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>公開設定</Label>
              <RadioGroup defaultValue={editingTodo?.public ? "public" : "private"}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" name="public" />
                  <Label htmlFor="public">公開</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" name="public" />
                  <Label htmlFor="private">非公開</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>フルーツ選択</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "orange", label: "オレンジ" },
                  { id: "apple", label: "りんご" },
                  { id: "banana", label: "バナナ" },
                  { id: "melon", label: "メロン" },
                  { id: "grape", label: "ぶどう" }
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      name={`food_${id}`}
                      defaultChecked={editingTodo?.foods[id as keyof typeof editingTodo.foods]}
                    />
                    <Label htmlFor={id}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>日付と数量</Label>
              <div className="grid gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      type="date"
                      name={`pub_date${i + 1}`}
                      defaultValue={editingTodo?.dates[i]}
                    />
                    {/*
                    <div className="flex-1">
                    </div>
                    */}
                      <Input
                        type="text"
                        name={`qty${i + 1}`}
                        placeholder="数量"
                        defaultValue={editingTodo?.quantities[i]}
                      />
                      {actionData?.errors?.[`quantities.${i}`] && (
                        <p className="text-red-500 text-sm">{actionData.errors[`quantities.${i}`]}</p>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {actionData?.errors?.general && (
              <p className="text-red-500">{actionData.errors.general}</p>
            )}

            <Button type="submit">
              {editingTodo ? "更新" : "作成"}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 mt-4">
        {filteredTodos.map((todo) => (
          <Card key={todo.id}>
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{todo.content}</p>
              <p>公開設定: {todo.public === "public" ? "公開" : "非公開"}</p>
              <div className="mt-2">
                <p>選択されたフルーツ:</p>
                <ul>
                  {Object.entries(todo.foods)
                    .filter(([_, checked]) => checked)
                    .map(([fruit]) => (
                      <li key={fruit}>{fruit}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-2">
                <p>日付と数量:</p>
                {todo.dates.map((date, i) => (
                  date && (
                    <div key={i}>
                      {date}: {todo.quantities[i]}
                    </div>
                  )
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => {
                  setEditingTodo(todo);
                  setIsOpen(true);
                }}>
                  編集
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDelete(todo.id)}
                >
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
