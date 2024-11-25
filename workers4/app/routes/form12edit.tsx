import { useState , useEffect } from "react";
import { json, type ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { TodoList } from "./form12/TodoList"
import { todoSchema } from "./form12/todo-validation";
import Head from '../components/Head';
import CrudIndex from "./form12/CrudIndex";
import { TodoDialog, TodoData } from './form12/TodoDialog'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const id = searchParams.get("id");
console.log("id=", id);
  const resulte = await CrudIndex.getList();
//console.log(resulte);
  const target = resulte.filter(todo => todo.id === Number(id) );
  let out = {};
  if(target.length > 0) {
    out = target[0];
    console.log(out);
  }
  return json({ data: out, id: id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
console.log("action=" , action);
  // Convert FormData to object
  const data = Object.fromEntries(formData);
  console.log(data);

  if (action === "create" || action === "edit") {
    try {
      const validatedData = todoSchema.parse(data);
      
      // Here you would typically save to a database
      // For now, we'll just return the validated data
      const retObj = {ret: 500, message : "", data: {} }
      if (action === "create") {
        console.log("action.create");
        console.log(validatedData);
        const result = await CrudIndex.addItem(validatedData);
        console.log(result)
      }
      if (action === "edit") {
        const id = Number(data.todo_id);
        console.log("action.edit=", id);
        console.log(validatedData);
        const result = CrudIndex.update(validatedData , id);
        console.log(result);
      }
      return json({ 
        success: true, 
        action,
        data: validatedData 
      });
    } catch (error) {
      return json({ 
        success: false, 
        action,
        errors: error.flatten().fieldErrors 
      }, { status: 400 });
    }
  }
  if (action === "delete") {
    const id = formData.get("id");
    const result = await CrudIndex.delete(Number(id));
    console.log(result);
    return json({ success: true, action: "delete", id: Number(id), });
  }
};

export default function Index() {
  const { data , id } = useLoaderData<typeof loader>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoData | undefined>()
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  //console.log(data);
  console.log("id=", id);
  //useEffect(() => {
  //  console.log(data);
  //}, []);
  
  const handleEditTodo = (data: TodoData) => {
    setIsDialogOpen(false)
    setEditingTodo(undefined)
    setEditingIndex(-1)
  }
  //
  return (
  <>
    <Head />
    <div className="container mx-auto py-8">
      
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          //setEditingTodo(undefined)
          //setEditingIndex(-1)
        }}
        onSubmit={handleEditTodo}
        initialData={data}
        mode={'edit'}
      />
    </div>
  </>
  )
}
//<h1 className="text-3xl font-bold mb-8">Form12</h1>