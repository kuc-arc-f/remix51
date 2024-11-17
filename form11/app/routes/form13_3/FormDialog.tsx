import React, { useState, useEffect } from 'react';
import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";


//import { Button, Dialog, DialogContent, Input, Label } from '@shadcn/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { z } from 'zod';

let BtnName = "Add";
//
const TodoForm: React.FC<TodoFormProps> = ({ 
  mode,
  isAddDialogOpen , 
  setIsAddDialogOpen , 
  resetForm, 
  errors,
  editingTodo,
}) => 
{
  console.log("mode=", mode); 
  //console.log( editingTodo );
  if(mode === "edit"){ BtnName = "Save";} 
  return(
    <>
      <Form method="post" className="grid gap-4">
        {(mode === "create") ? (
          <input type="hidden" name="_action" value="create" />)
        : (
        <> 
          <input type="hidden" name="_action" value="edit" />
          <input type="hidden" name="id" value={editingTodo.id} />
        </>
        )}  
        <div>
          <Input
            name="title"
            placeholder="Title"
            defaultValue={editingTodo?.title} 
          />
          {errors?.title && (
            <div className="text-red-500 text-sm mt-1">
              {errors.title}
            </div>
          )}
        </div>
        <div>
          <Input
            name="content"
            placeholder="Content"
            defaultValue={editingTodo?.content}
          />
          {errors?.content && (
            <div className="text-red-500 text-sm mt-1">
              {errors.content}
            </div>
          )}
        </div>
        <Button type="submit">{BtnName}</Button>
      </Form>
    </>
  )
}
export default TodoForm;
