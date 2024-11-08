import { z } from "zod";

// Zodスキーマの定義
export const todoSchema = z.object({
    title: z.string().min(2, "タイトルは2文字以上で入力してください"),
    content: z.string().min(1, "内容を入力してください"),
    public: z.enum(["public", "private"]),
    food_orange: z.boolean().optional(),
    food_apple: z.boolean().optional(),
    food_banana: z.boolean().optional(),
    pub_date: z.string(),
    qty1: z.string().min(1, "数量1を入力してください"),
    qty2: z.string().min(1, "数量2を入力してください"),
    qty3: z.string().min(1, "数量3を入力してください"),
  });
export type TodoSchema = z.infer<typeof todoSchema>;

export  interface Todo extends TodoSchema {
    id: number;
}
export const initialFormData = {
  title: '',
  content: '',
  public: 'public',
  food_orange: true,
  food_apple: true,
  food_banana: true,
  pub_date: '',
  qty1: '1',
  qty2: '1',
  qty3: '1',
}; 
