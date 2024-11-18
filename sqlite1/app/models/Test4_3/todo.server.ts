import { db } from "~/db.server";
import type { Todo } from "@prisma/client";

export type { Todo } from "@prisma/client";

export async function getTodos() {
  return db.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getTodo(id: string) {
  return db.todo.findUnique({
    where: { id },
  });
}

export async function createTodo(title: string) {
  return db.todo.create({
    data: {
      title,
    },
  });
}

export async function updateTodo(id: string, title: string) {
  return db.todo.update({
    where: { id },
    data: { title },
  });
}

export async function deleteTodo(id: string) {
  return db.todo.delete({
    where: { id },
  });
}

export async function toggleTodo(id: string) {
  const todo = await db.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    throw new Error("Todo not found");
  }

  return db.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
}