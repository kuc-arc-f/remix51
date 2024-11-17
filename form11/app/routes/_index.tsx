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
//{title: "about", path: "/about"},
const items = [
  {title: "todo1", path: "/todo1"},
  {title: "todo4", path: "/todo4"},
  {title: "form4", path: "/form4"},
  {title: "form5", path: "/form5"},
  {title: "form6", path: "/form6"},
  {title: "form10", path: "/form10"},
  {title: "form11", path: "/form11"},
  {title: "form12", path: "/form12"},
  {title: "form13", path: "/form13"},
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
    <div className="max-w-2xl mx-auto px-4 pt-2 pb-24 ">
      <div className="flex flex-row">
        <div className="flex-1 p-2 m-1">
          <h1 className="text-2xl font-bold">home</h1>
        </div>
        <div className="flex-1 p-2 m-1 text-end">
          <Form method="post" action="/logout">
            <button type="submit">[ Logout ]</button>
          </Form>
        </div>
      </div>
      <hr className="my-2" />
      <div className="space-y-2">
        {items.map((todo, index) => (
          <div key={index} 
          className="border px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div>
                <a href={`${todo.path}`}>
                  <h3 className="font-bold">{todo.title}</h3>
                </a>
              </div>
              <div className="flex gap-2">
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};
export default TodoApp;
/*
<div className="max-w-2xl mx-auto p-4">
  <h1 className="text-2xl font-bold">hello</h1>
  <hr className="my-2" />
  <Form method="post" action="/logout">
    <button type="submit">[ Logout ]</button>
  </Form>
</div>
*/
