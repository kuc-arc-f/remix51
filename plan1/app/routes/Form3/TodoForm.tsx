import React from 'react';
import { useActionData, Form } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ActionData } from "~/routes/todos";

interface TodoFormProps {
  initialData?: any;
  mode?: 'create' | 'edit';
}

export function TodoForm({ initialData = {}, mode = 'create' }: TodoFormProps) {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData.title || actionData?.fields?.title}
          aria-invalid={Boolean(actionData?.errors?.title)}
          aria-errormessage={actionData?.errors?.title ? "title-error" : undefined}
        />
        {actionData?.errors?.title && (
          <p className="text-sm text-red-500" id="title-error">
            {actionData.errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">内容</Label>
        <Input
          id="content"
          name="content"
          defaultValue={initialData.content || actionData?.fields?.content}
          aria-invalid={Boolean(actionData?.errors?.content)}
          aria-errormessage={actionData?.errors?.content ? "content-error" : undefined}
        />
        {actionData?.errors?.content && (
          <p className="text-sm text-red-500" id="content-error">
            {actionData.errors.content}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>公開設定</Label>
        <RadioGroup
          name="public"
          defaultValue={initialData.public || actionData?.fields?.public || "private"}
        >
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="food_orange"
              name="food_orange"
              defaultChecked={initialData.food_orange || actionData?.fields?.food_orange}
            />
            <Label htmlFor="food_orange">オレンジ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="food_apple"
              name="food_apple"
              defaultChecked={initialData.food_apple || actionData?.fields?.food_apple}
            />
            <Label htmlFor="food_apple">りんご</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="food_banana"
              name="food_banana"
              defaultChecked={initialData.food_banana || actionData?.fields?.food_banana}
            />
            <Label htmlFor="food_banana">バナナ</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pub_date">公開日</Label>
        <Input
          type="date"
          id="pub_date"
          name="pub_date"
          defaultValue={initialData.pub_date || actionData?.fields?.pub_date}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="qty1">数量1</Label>
          <Input
            id="qty1"
            name="qty1"
            defaultValue={initialData.qty1 || actionData?.fields?.qty1}
            aria-invalid={Boolean(actionData?.errors?.qty1)}
            aria-errormessage={actionData?.errors?.qty1 ? "qty1-error" : undefined}
          />
          {actionData?.errors?.qty1 && (
            <p className="text-sm text-red-500" id="qty1-error">
              {actionData.errors.qty1}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="qty2">数量2</Label>
          <Input
            id="qty2"
            name="qty2"
            defaultValue={initialData.qty2 || actionData?.fields?.qty2}
            aria-invalid={Boolean(actionData?.errors?.qty2)}
            aria-errormessage={actionData?.errors?.qty2 ? "qty2-error" : undefined}
          />
          {actionData?.errors?.qty2 && (
            <p className="text-sm text-red-500" id="qty2-error">
              {actionData.errors.qty2}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="qty3">数量3</Label>
          <Input
            id="qty3"
            name="qty3"
            defaultValue={initialData.qty3 || actionData?.fields?.qty3}
            aria-invalid={Boolean(actionData?.errors?.qty3)}
            aria-errormessage={actionData?.errors?.qty3 ? "qty3-error" : undefined}
          />
          {actionData?.errors?.qty3 && (
            <p className="text-sm text-red-500" id="qty3-error">
              {actionData.errors.qty3}
            </p>
          )}
        </div>
      </div>

      {actionData?.errors?.formError && (
        <p className="text-sm text-red-500">
          {actionData.errors.formError}
        </p>
      )}

      <Button type="submit">
        {mode === 'create' ? '追加' : '更新'}
      </Button>
    </Form>
  );
}

export default TodoForm;
