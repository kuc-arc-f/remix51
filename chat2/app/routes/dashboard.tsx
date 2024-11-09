import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { Form } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
console.log("NODE_ENV=", import.meta.env.NODE_ENV);
console.log("NODE_ENV=", process.env.NODE_ENV);
  await requireUserSession(request);
  return null;
};

export default function DashboardPage() {
  return (
    <div>
      <h1>ダッシュボード</h1>
      <Form method="post" action="/logout">
        <button type="submit">ログアウト</button>
      </Form>
    </div>
  );
}
