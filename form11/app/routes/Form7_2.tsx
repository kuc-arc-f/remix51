// schema.ts
import { z } from "zod";
import React from 'react';
import { useState } from 'react';
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
import { Search } from 'lucide-react';

export const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string().min(1, "qty1を入力してください"),
  qty2: z.string().min(1, "qty2を入力してください"),
  qty3: z.string().min(1, "qty3を入力してください"),
});

export type TodoSchema = z.infer<typeof todoSchema>;

// routes/todos.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
//import { todoSchema } from "~/schema";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  console.log("action=", action);

  const values = {
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

  // バリデーション実行
  const result = todoSchema.safeParse(values);

  if (!result.success) {
    return json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // バリデーション成功後の処理
  switch (action) {
    case "create":
      // TODO: データベースに保存する処理
      return json({ success: true, data: result.data });
    case "update":
      const id = formData.get("id");
      // TODO: データベースの更新処理
      return json({ success: true, data: { ...result.data, id } });
    case "delete":
      const deleteId = formData.get("id");
      // TODO: データベースの削除処理
      return json({ success: true, id: deleteId });
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
}

export default function TodoPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  console.log(actionData);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Form7_2</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>新規TODO</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新規TODO作成</DialogTitle>
            </DialogHeader>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="_action" value="create" />
              
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  name="title"
                  aria-invalid={actionData?.errors?.title ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.title ? "title-error" : undefined
                  }
                />
                {actionData?.errors?.title ? (
                  <div id="title-error" className="text-red-500 text-sm">
                    {actionData.errors.title}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">内容</Label>
                <Input
                  id="content"
                  name="content"
                  aria-invalid={actionData?.errors?.content ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.content ? "content-error" : undefined
                  }
                />
                {actionData?.errors?.content ? (
                  <div id="content-error" className="text-red-500 text-sm">
                    {actionData.errors.content}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>公開設定</Label>
                <RadioGroup defaultValue="public" name="public">
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
                <div className="space-y-2">
                  {['orange', 'apple', 'banana'].map((fruit) => (
                    <div key={fruit} className="flex items-center space-x-2">
                      <Checkbox
                        id={`food_${fruit}`}
                        name={`food_${fruit}`}
                      />
                      <Label htmlFor={`food_${fruit}`}>{fruit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub_date">公開日</Label>
                <Input
                  type="date"
                  id="pub_date"
                  name="pub_date"
                />
              </div>

              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <Label htmlFor={`qty${num}`}>数量{num}</Label>
                  <Input
                    type="text"
                    id={`qty${num}`}
                    name={`qty${num}`}
                    aria-invalid={actionData?.errors?.[`qty${num}`] ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.[`qty${num}`] ? `qty${num}-error` : undefined
                    }
                  />
                  {actionData?.errors?.[`qty${num}`] ? (
                    <div id={`qty${num}-error`} className="text-red-500 text-sm">
                      {actionData.errors[`qty${num}`]}
                    </div>
                  ) : null}
                </div>
              ))}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "送信中..." : "作成"}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
