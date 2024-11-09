// app/routes/login.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login } from "~/utils/auth.server";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

//
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "メールアドレスとパスワードを入力してください" });
  }

  const redirectResponse = await login(email, password);
  if (!redirectResponse) {
    return json({ error: "認証に失敗しました" });
  }
  return redirectResponse;
};

export default function LoginPage() {
  const actionData = useActionData();

  return (
  <>
    <div className="flex items-center justify-center min-h-screen">
    <Card className="w-[350px] my-4" id="form1">
        <CardHeader>
          <CardTitle className="text-4xl text-gray-700 font-bold my-2">
            Login
          </CardTitle>
          <hr className="my-2" />
          <CardDescription>email , password input please 
          </CardDescription>
        </CardHeader>
        <Form method="post">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email :</Label>
                <Input type="email" id="email" name="email" placeholder=""
                required />
                <hr className="my-2" />
                <Label htmlFor="">Password :</Label>
                <Input type="password"
                id="password" name="password" placeholder="" required />
              </div>
              {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
            </div>
          </CardContent>
          <CardFooter className="">
            <Button type="submit" className="w-full">GO
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>  
  </>
  );
}
/*
<h1>ログイン</h1>
<Form method="post">
  <div>
    <label>
      メールアドレス:
      <input type="email" name="email" required />
    </label>
  </div>
  <div>
    <label>
      パスワード:
      <input type="password" name="password" required />
    </label>
  </div>
  <button type="submit">ログイン</button>
</Form>
*/