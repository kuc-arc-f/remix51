// app/routes/_index.tsx
import { json, type ActionFunction } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { TodoList } from "./form10_2/TodoList";
import { todoSchema } from "./form10_2/todo-validation";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
console.log("action=", action);

  // Convert FormData to object
  const data = Object.fromEntries(formData);
  console.log(action);
  try {
    const validatedData = todoSchema.parse(data);
    
    // Here you would typically save to a database
    // For now, we'll just return the validated data
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
};

export default function Index() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Todo Manager</h1>
      <TodoList />
    </div>
  );
}
