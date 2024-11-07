// app/routes/logout.tsx
import { ActionFunction } from "@remix-run/node";
import { logout } from "@/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};
