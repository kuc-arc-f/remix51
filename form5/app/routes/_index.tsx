import type { MetaFunction } from "@remix-run/node";

import React from 'react';
import Head from '../components/Head';

//
const TodoApp = () => {

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">hello</h1>
    </div>
  </>
  );
};

export default TodoApp;

