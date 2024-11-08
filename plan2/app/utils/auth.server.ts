import { createCookieSessionStorage, redirect } from "@remix-run/node";

const users = [
  { 
    email: import.meta.env.VITE_AUTH_USER_MAIL, 
    passwordHash: import.meta.env.VITE_AUTH_PASSWORD 
  }
];

// セッションの設定
const sessionSecret = "your-secret-key"; // 環境変数に設定推奨
const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// ログイン処理
export async function login(email: string, password: string) {
//console.log("VITE_AUTH_USER_MAIL=" , import.meta.env.VITE_AUTH_USER_MAIL);
//console.log("VITE_AUTH_USER_ID=" , import.meta.env.VITE_AUTH_USER_ID);
  const user = users.find((user) => user.email === email);
console.log("email=", email);
console.log("password=", password);
  //console.log(user);
  if (!user) return null;

  if(password !== user.passwordHash){
    return null;
  }

  const session = await storage.getSession();
  session.set("userId", email);
  //return redirect("/dashboard"
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// ユーザー認証判定
export async function requireUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");
  return userId;
}

// ログアウト処理
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
