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
import {
  TodoSchema , Todo , todoSchema , initialFormData
} from  "./Form4/Schema";
import TodoForm from "./Form4/TodoForm";
//
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
          return json({ errors: validationErrors , data : data },
            { status: 400 }
          );
        }
      }
      console.log(error);
      return json({ error: "不明なエラーが発生しました" }, { status: 500 });
    }

  }

  if (action === "delete") {
    const id = formData.get("id");
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
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState<Todo>(initialFormData);

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
      if(actionData?.errors){
        setFormData(actionData?.data);
        console.log(actionData?.errors);
      }
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
        setCurrentTodo(null)
        setIsOpen(false);
      }
    }
  }, [actionData]);

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleEdit = (todo: Todo) => {
    //console.log(todo);
    setCurrentTodo(todo);
    setFormData(todo);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentTodo(null);
    //setErrors({});
  };

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
            <Button onClick={resetForm}>新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentTodo ? "Edit" : "Create"}
              </DialogTitle>
            </DialogHeader>
            <TodoForm action="create" currentTodo={currentTodo}
            formData={formData} actionData={actionData} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <div className="space-x-2">
                <Button variant="outline"
                  onClick={() => {
                    handleEdit(todo);
                  }}
                >
                  Edit
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => {
                    const sendFormData = new FormData();
                    sendFormData.append("_action", "delete");
                    sendFormData.append("id", todo.id.toString());
                    submit(sendFormData, { method: "post" });
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
