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
//
const TodoApp = () => {

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">hello</h1>
      <hr className="my-2" />
      <Form method="post" action="/logout">
        <button type="submit">[ Logout ]</button>
      </Form>
    </div>
  </>
  );
};

export default TodoApp;

