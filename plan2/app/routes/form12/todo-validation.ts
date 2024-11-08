// app/validations/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(1, "Content is required"),
  content_type: z.string().min(1, "Content type is required"),
  age: z.string().optional(),
  public: z.enum(["true", "false"]).transform(val => val === "true"),
  food_orange: z.enum(["on", "off"]).optional().transform(val => val === "on"),
  food_apple: z.enum(["on", "off"]).optional().transform(val => val === "on"),
  food_banana: z.enum(["on", "off"]).optional().transform(val => val === "on"),
  food_melon: z.enum(["on", "off"]).optional().transform(val => val === "on"),
  food_grape: z.enum(["on", "off"]).optional().transform(val => val === "on"),
  date_publish: z.string().optional(),
  date_update: z.string().optional(),
  post_number: z.string().optional(),
  address_country: z.string().optional(),
  address_pref: z.string().optional(),
  address_city: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  text_option1: z.string().optional(),
  text_option2: z.string().optional(),
});

export type TodoSchemaType = z.infer<typeof todoSchema>;
