// app/routes/todo.tsx
import { ActionFunction, json, redirect } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';

export const action: ActionFunction = async ({ request }) => {
  // フォームからデータを取得
  const formData = await request.formData();
  const actionType = formData.get("actionType"); // フォーム内のhidden inputやボタンからタイプを取得
console.log("actionType=", actionType);
  switch (actionType) {
    case "create":
      // ここで新しいTodoを作成するロジック
      const title = formData.get("title");
      const content = formData.get("content");
console.log("title=", title);
console.log("content=", content);

      if (typeof title !== "string" || typeof content !== "string") {
        return json({ error: "タイトルとコンテンツが必要です" });
      }
      // データベース操作や他の処理をここで実行
      return redirect("/test1"); // 作成後のリダイレクト
      //return redirect("/todos"); // 作成後のリダイレクト

    case "update":
      // Todoの更新処理を実行
      const todoId = formData.get("id");
      const newContent = formData.get("content");
console.log("id=", todoId);
console.log("content=", newContent);

      if (typeof todoId !== "string" || typeof newContent !== "string") {
        return json({ error: "IDと新しいコンテンツが必要です" });
      }
      // 更新のためのデータベース操作
      return redirect(`/todos/${todoId}`);

    case "delete":
      // Todoの削除処理を実行
      const deleteId = formData.get("id");
      if (typeof deleteId !== "string") {
        return json({ error: "削除するIDが必要です" });
      }
      // データベース操作や削除ロジック
      return redirect("/todos");

    default:
      return json({ error: "無効なアクションタイプです" });
  }
};

// フォームの作成例
export default function TodoForm() {
  return (
  <>
    <h1>t1</h1>
    <Form method="post">
      {/* 作成用フォーム */}
      <input type="text" name="title" placeholder="タイトル" />
      <input type="text" name="content" placeholder="コンテンツ" />
      <br />
      <button type="submit" name="actionType" value="create"
      >Create</button>
      <hr className="my-2" />
      
      {/* 更新用フォーム（actionTypeとIDを分岐に使用） */}
      <input type="hidden" name="id" value="123" />
      <input type="text" name="content" placeholder="新しいコンテンツ" />
      <button type="submit" name="actionType" value="update"
      >Update</button>
      <hr className="my-2" />
      
      {/* 削除用フォーム */}
      <input type="hidden" name="id" value="123" />
      <button type="submit" name="actionType" value="delete">
        Delete</button>
      <hr className="my-2" />
    </Form>
  </>
  );
}
/*
<input type="hidden" name="actionType" value="create" />
<input type="hidden" name="actionType" value="update" />
<input type="hidden" name="actionType" value="delete" />

*/

