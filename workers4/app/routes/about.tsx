import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { Form } from "@remix-run/react";
//
import React from 'react';
import Head from '../components/Head';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return null;
};
const items = [
  {title: "about", path: "/about"},
  {title: "todo1", path: "/todo1"},
  {title: "todo4", path: "/todo4"},
  {title: "form4", path: "/form4"},
  {title: "form5", path: "/form5"},
  {title: "form6", path: "/form6"},
  {title: "form10", path: "/form10"},
  {title: "form11", path: "/form11"},
  {title: "form12", path: "/form12"},
  {title: "plan1", path: "/plan1"},
  {title: "plan2", path: "/plan2"},
  {title: "chat2", path: "/chat2"},
  {title: "chat3", path: "/chat3"},
];
//
const TodoApp = () => {

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">about</h1>
      <hr className="my-2" />
    </div>
  </>
  );
};
export default TodoApp;
