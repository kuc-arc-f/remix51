// app/schemas/todo.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string()
    .min(2, 'タイトルは2文字以上で入力してください'),
  content: z.string()
    .min(1, '内容を入力してください'),
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

export type TodoSchemaType = z.infer<typeof todoSchema>;
