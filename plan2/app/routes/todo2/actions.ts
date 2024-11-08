// app/schemas/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
  text: z.string().min(2, "TODOは2文字以上で入力してください"),
});

export type TodoSchema = z.infer<typeof todoSchema>;

// app/routes/todos.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
//import { todoSchema } from "~/schemas/todo";

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
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // TODOの追加
  if (intent === "create") {
    const text = formData.get("text");
    
    try {
      const validatedFields = todoSchema.parse({ text });
      
      // ここでデータベースへの保存処理を行う
      // 例: await db.todo.create({ data: validatedFields });
      
      return json<ActionData>({ 
        success: true 
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
        success: true 
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
      success: true 
    });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
}
