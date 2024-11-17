// app/routes/_index.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { TodoList } from './form13_2/TodoList';
import { todoSchema } from './form13_2/todo-schema';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
console.log("action=", action);

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    public: formData.get("public"),
    food_orange: formData.get("food_orange") === "true",
    food_apple: formData.get("food_apple") === "true",
    food_banana: formData.get("food_banana") === "true",
    pub_date: formData.get("pub_date"),
    qty1: formData.get("qty1"),
    qty2: formData.get("qty2"),
    qty3: formData.get("qty3"),
  };
console.log(rawData);

  try {
    const validatedData = todoSchema.parse(rawData);

    return json({ 
      success: true, 
      action, 
      data: validatedData 
    });
  } catch (error) {
    if (error instanceof Error) {
//console.log(error.message);
      return json({
        success: false,
        action,
//        errors: error.message
        errors: error.flatten().fieldErrors
      }, { status: 400 });
    }
    return json({ 
      success: false, 
      action,
      errors: "予期せぬエラーが発生しました"
    }, { status: 500 });
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">TODOリスト</h1>
      <TodoList actionData={actionData} />
    </div>
  );
}
