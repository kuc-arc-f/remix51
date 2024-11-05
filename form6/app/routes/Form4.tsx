// app/routes/todo.tsx
import { json, type ActionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { useState , useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Head from '../components/Head';

// Zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean().optional(),
  food_apple: z.boolean().optional(),
  food_banana: z.boolean().optional(),
  pub_date: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
});

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const todoId = formData.get("todo_id");
  console.log("action=", action);

  if (action === "create" || action === "edit") {
    const data = {
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

    try {
      const validated = todoSchema.parse(data);
      // ここでデータベースへの保存処理を行う
      if (action === "create") {
        return json({ success: true , action: "create", data: data, });
      }else{
        data.id = Number(todoId);
        return json({
          success: true, action: "edit", data: data, id: Number(todoId) 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            if (!validationErrors[path]) {
              validationErrors[path] = [];
            }
            validationErrors[path].push(err.message);
          });
          return json({ errors: validationErrors }, { status: 400 });
        }
      }
      return json({ error: "不明なエラーが発生しました" }, { status: 500 });
    }

  }

  if (action === "delete") {
    const id = formData.get("id");
    // ここで削除処理を実装
    return json({ success: true, action: "delete", id: Number(id), });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};
const LOCAL_STORAGE_KEY = "remix51_form4";
const saveStorage = function(items: any){
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}
//
export default function TodoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [todos, setTodos] = useState<TodoData[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        console.log(parsedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if(actionData){
      console.log(actionData);
      //console.log(actionData?.errors);
      if(actionData.success){
        if(actionData.action && actionData.action === "create"){
          console.log("#success.create");
          const newEntry = actionData.data;
          newEntry.id = Date.now();
          const target = todos;
          target.push(newEntry);
          saveStorage(target);
        }
        if(actionData.action && actionData.action === "delete"){
          console.log("id=", Number(actionData.id) );
          if (window.confirm("Delete, OK ?")) {
            const target = todos.filter(todo => todo.id !== Number(actionData.id));
            setTodos(target);
            saveStorage(target);
          }          
        }
        if(actionData.action && actionData.action === "edit"){
          console.log("action.edit.id=", Number(actionData.id) );
          //console.log("text=", todoText);
          const out: any[] = [];
          todos.forEach((item) => {
            console.log(item)
            if(item.id ===  Number(actionData.id)){
              item  = actionData.data;
              out.push(item);
            }else{
              out.push(item);
            }
          });
          console.log(out);
          saveStorage(out);
          location.reload();
        }
        setIsOpen(false);
      }
    }
  }, [actionData]);
  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //
  const TodoForm = ({ todo = null }) => (
    <form method="post" onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      submit(formData, { method: "post" });
      //setIsOpen(false);
    }}>
      {/* <span>id={todo.id}</span> */}
      <input type="hidden" name="_action" value={todo ? "edit" : "create"} />
      {todo ? (
        <input type="hidden" name="todo_id" value={todo.id} />
      ) :null}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            name="title"
            defaultValue={todo?.title}
          />
        </div>
        {actionData?.errors?.title && (
          <div className="text-red-400">{actionData?.errors?.title[0]}</div>
        )}

        <div>
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            name="content"
            defaultValue={todo?.content}
          />
        </div>
        {actionData?.errors?.content && (
          <div className="text-red-400">{actionData?.errors?.content[0]}</div>
        )}
        <div>
          <Label>公開設定</Label>
          {/* <RadioGroup defaultValue="public" name="public"> */}
          <RadioGroup defaultValue={todo ? todo?.public: 'public'}
           name="public">
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

        <div className="space-y-2">
          <Label>フルーツ選択</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="food_orange" name="food_orange" 
              defaultChecked={todo ? todo?.food_orange: true} />
              <Label htmlFor="food_orange">オレンジ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_apple" name="food_apple" 
              defaultChecked={todo ? todo?.food_apple: true} />
              <Label htmlFor="food_apple">りんご</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_banana" name="food_banana" 
              defaultChecked={todo ? todo?.food_banana: true} />
              <Label htmlFor="food_banana">バナナ</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="pub_date">公開日</Label>
          <Input
            type="date"
            id="pub_date"
            name="pub_date"
            defaultValue={todo?.pub_date}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <Label htmlFor={`qty${num}`}>数量{num}</Label>
              {todo ? (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={todo?.[`qty${num}`]}
                />
              ) : (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={0}
                />
              )}
            {actionData?.errors?.[`qty${num}`] && (
              <div className="text-red-400">{actionData?.errors?.[`qty${num}`]}
              </div>
            )}
            </div>

          ))}
        </div>

        <Button type="submit">
          {todo ? "更新" : "追加"}
        </Button>
      </div>
    </form>
  );

  return (
  <>
    <Head />
    <div className="p-4">
      <h1 className="text-4xl font-bold">Form4</h1>
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>新規追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>TODO追加</DialogTitle>
            </DialogHeader>
            <TodoForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">編集</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>TODO編集</DialogTitle>
                    </DialogHeader>
                    <TodoForm todo={todo} />
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="destructive"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("_action", "delete");
                    formData.append("id", todo.id.toString());
                    submit(formData, { method: "post" });
                  }}
                >
                  削除
                </Button>
              </div>
            </div>
            <p>{todo.content}</p>
          </div>
        ))}
      </div>
    </div>
  </>

  );
}
