// app/routes/todo.tsx
import { ActionFunction, json, redirect } from '@remix-run/node';
import { useActionData, Form, useSubmit } from '@remix-run/react';

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
  success?: boolean;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const email = formData.get("email");
  const password = formData.get("password");
console.log("intent=", intent);
console.log("email=", email);

  // バリデーションチェック
  const errors: ActionData["errors"] = {};
  
  if (!email || typeof email !== "string") {
    errors.email = "メールアドレスは必須です";
  }
  
  if (!password || typeof password !== "string") {
    errors.password = "パスワードは必須です";
  }

  // エラーがある場合は早期リターン
  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  // intentによる分岐処理
  try {
    switch (intent) {
      case "login": {
        // ログイン処理
        //const user = await login({ email, password });
        return redirect("/");
      }
      
      case "register": {
        // 新規登録処理
        //const user = await register({ email, password });
        return redirect("/welcome");
      }
      
      case "forgot-password": {
        // パスワードリセット処理
        //await sendPasswordResetEmail(email);
        return json<ActionData>({ 
          success: true 
        });
      }
      
      default: {
        return json<ActionData>({
          errors: {
            general: "不正なリクエストです"
          }
        }, { status: 400 });
      }
    }
  } catch (error) {
    return json<ActionData>({
      errors: {
        general: "エラーが発生しました。しばらく経ってからお試しください。"
      }
    }, { status: 500 });
  }
};

// フォームの作成例
export default function TodoForm() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  //
  if(actionData){
    console.log(actionData);
    console.log(actionData?.errors);
    //console.log(actionData?.errors?.title);
    //if(actionData.ret === LibConfig.OK_CODE){
      //location.reload();
    //}
  }
  //
  return (
  <>
    <h1 className="text-4xl">Test3</h1>
    <Form method="post">
      email
      <input type="email" name="email" />
      <hr />
      password
      <input type="password" name="password" />
      <hr />
      <button type="submit" name="intent" value="login">
      ログイン
      </button>
      <button type="submit" name="intent" value="register">
      新規登録
      </button>
      <hr />
      {actionData?.errors?.general && (
          <div className="text-red-400">{actionData?.errors?.general}</div>
        )}
    </Form>
    <hr />
    <button onClick={() => {
      console.log("#submit");
      const formData = new FormData();
      formData.append('intent', "register");
      submit(formData, { method: 'post' });

    }}>[ submit ]</button>


  </>
  );
}

