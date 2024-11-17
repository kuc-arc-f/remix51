import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(1, "Content is required"),
  public: z.enum(['public', 'private']),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string()
    .min(1, '数量1を入力してください'),
  qty2: z.string()
    .min(1, '数量2を入力してください'),
  qty3: z.string()
    .min(1, '数量3を入力してください'),
});

export type Todo = z.infer<typeof TodoSchema>;

// app/routes/_index.tsx
import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState , useEffect } from "react";
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
import Head from '../components/Head';
import FormDialog from './form14_1/FormDialog';
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
console.log("action=", action);

  if (action === "create" || action === "edit") {
    //const title = formData.get("title");
    //const content = formData.get("content");
    const id = formData.get("id");
    const rawData = {
      id: id ? parseInt(id.toString()) : undefined,
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
  console.log(rawData);
    const result = TodoSchema.safeParse(rawData);

    if (!result.success) {
      return json<ActionData>(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (action === "create") {
      const newTodo = { ...result.data, id: Date.now() };
      TODOS.push(newTodo);
      return json({ todo: newTodo, success: true, });
    } else {
      TODOS = TODOS.map((todo) =>
        todo.id === parseInt(id!.toString())
          ? { ...result.data, id: parseInt(id!.toString()) }
          : todo
      );
      return json({ todo: result.data , success: true, });
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
  const [errors, setErrors] = useState({});
  const { todos } = useLoaderData<{ todos: Todo[] }>();
  const actionData = useActionData<ActionData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  console.log(todos);

  useEffect(() => {
    if(actionData){
      console.log(actionData);
      if(actionData.success){
        //setEditingTodo(null);
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
      }
      if(actionData?.errors){
        setErrors(actionData?.errors);
        console.log(actionData?.errors);
      }
    }
  }, [actionData]);

  const initialData = {
    title: '',
    content: '',
    public: 'private',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: '',
    qty1: '0',
    qty2: '0',
    qty3: '0',
  };

  const resetForm = () => {
    setEditingTodo(initialData);
    setErrors({});
  };

  const handleEdit = (todo: Todo) => {
    //console.log(todo);
    setErrors({});
    setEditingTodo(todo);
    setIsEditDialogOpen(true)
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <>
    <Head />
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
          <Button className="mb-4" onClick={()=>{resetForm()}}>Add New TODO</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New TODO</DialogTitle>
          </DialogHeader>
          <FormDialog 
          mode="create"
          editingTodo={editingTodo}
          errors={errors} 
          />
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit TODO</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <FormDialog 
            mode="edit"
            errors={errors} 
            editingTodo={editingTodo}
            />
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
                onClick={() => handleEdit(todo)}
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
  </>

  );
}
