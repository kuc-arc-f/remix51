import type { MetaFunction } from "@remix-run/node";

import React, { useState, useEffect } from 'react';
import { Form, useActionData, useSubmit } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import Head from '../components/Head';

//
export const todoSchema = z.object({
  text: z.string().min(2, "TODOは2文字以上で入力してください"),
});

export type TodoSchema = z.infer<typeof todoSchema>;

import { json, type ActionFunctionArgs } from "@remix-run/node";

interface TodoData {
  id: string;
  text: string;
}

// アクション関数の型定義
type ActionData = {
  errors?: {
    text?: string[];
  };
  success?: boolean;
  intent?: strin;
};
//
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log("intent=", intent);
  // TODOの追加
  if (intent === "create") {
    const text = formData.get("text");
    
    try {
      const validatedFields = todoSchema.parse({ text });
      
      // ここでデータベースへの保存処理を行う
      // 例: await db.todo.create({ data: validatedFields });
      
      return json<ActionData>({ 
        success: true, intent: "create", 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json<ActionData>({ 
          errors: { 
            text: error.errors.map(err => err.message)
          } 
        }, { 
          status: 400 
        });
      }
    }
  }

  // TODOの編集
  if (intent === "edit") {
    const id = formData.get("id");
    const text = formData.get("text");

    try {
      const validatedFields = todoSchema.parse({ text });
      
      // ここでデータベースの更新処理を行う
      // 例: await db.todo.update({ where: { id }, data: validatedFields });
      
      return json<ActionData>({ 
        success: true , intent: "edit", id: id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json<ActionData>({ 
          errors: { 
            text: error.errors.map(err => err.message)
          } 
        }, { 
          status: 400 
        });
      }
    }
  }

  // TODOの削除
  if (intent === "delete") {
    const id = formData.get("id");
    
    // ここでデータベースの削除処理を行う
    // 例: await db.todo.delete({ where: { id } });
    
    return json<ActionData>({ 
      success: true , intent: "delete", id: id
    });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
}
const LOCAL_STORAGE_KEY = "remix51_todo4";

const saveStorage = function(items: any){
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}
//
const TodoApp = () => {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [errors, setErrors] = useState({});
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [editingTodo, setEditingTodo] = useState<TodoData | null>(null);

  useEffect(() => {
    if(actionData){
      console.log(actionData);
      //console.log(actionData?.errors);

      if(actionData?.errors) {
        setErrors(actionData?.errors);
      }
      if(actionData.success){
        console.log("#success");
        if(actionData.intent && actionData.intent === "create"){
          const newEntry = {
            id: Date.now(), text: todoText, 
          };
          const target = todos;
          target.push(newEntry);
          saveStorage(target);
        }
        if(actionData.intent && actionData.intent === "delete"){
          console.log("id=", Number(actionData.id) );
          if (window.confirm("Delete, OK ?")) {
            const target = todos.filter(todo => todo.id !== Number(actionData.id));
            setTodos(target);
            saveStorage(target);
          }
        }
        if(actionData.intent && actionData.intent === "edit"){
          console.log("id=", Number(actionData.id) );
          console.log("text=", todoText);
          const out: any[] = [];
          todos.forEach((item) => {
            //console.log(item)
            if(item.id ===  Number(actionData.id)){
              item.text = todoText;
              out.push(item);
            }else{
              out.push(item);
            }
          });
          console.log(out);
          setTodos(out);
          saveStorage(out);
        }
        setIsAddOpen(false);
      }
    }
  }, [actionData]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTodos) {
      //console.log(savedTodos);
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  const addOpen = function(){
    setErrors({});
    setTodoText("");
    setIsAddOpen(true);
  }

  const editOpen = function(todo){
    setErrors({});
    setTodoText(todo.text);
    setEditingTodo(todo)
    setIsEditOpen(true);
  }

  // 検索結果のフィルタリング
  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <>
    <Head />
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>TODOリスト</span>
          <Button variant="outline" size="icon"
          onClick={() => { addOpen() }}><Plus className="h-4 w-4" />
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規TODO追加</DialogTitle>
              </DialogHeader>
              {/*  onSubmit={() => setIsAddOpen(false)} */}
              <Form method="post">
                <input type="hidden" name="intent" value="create" />
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="todo">TODO内容</Label>
                    <Input
                      id="todo"
                      name="text"
                      value={todoText}
                      onChange={(e) => setTodoText(e.target.value)}
                      placeholder="TODOを入力してください"
                    />
                    {errors?.text && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {errors?.text.join(", ")}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" name="intent" value="create">
                  新規登録
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="TODOを検索..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <span>{todo.text}</span>
              <div className="space-x-2">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => editOpen(todo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>TODO編集</DialogTitle>
                    </DialogHeader>
                    <Form method="post" onSubmit={() => setIsEditOpen(false)}>
                      <input type="hidden" name="intent" value="edit" />
                      <input type="hidden" name="id" value={editingTodo?.id} />
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-todo">TODO内容</Label>
                          <Input
                            id="edit-todo"
                            name="text"
                            value={todoText}
                            onChange={(e) => setTodoText(e.target.value)}
                          />
                          {actionData?.errors?.text && (
                            <Alert variant="destructive">
                              <AlertDescription>
                                {actionData.errors.text.join(", ")}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">更新</Button>
                      </DialogFooter>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Form method="post" className="inline">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={todo.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>  
  </>

  );
};

export default TodoApp;
