import React, { useState, useEffect } from 'react';
import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";

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
  console.log( editingTodo );
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
        <div className="space-y-2">
          <Label>公開設定</Label> 
          <RadioGroup defaultValue={editingTodo?.public} name="public">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">公開</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">非公開</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>フルーツ</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="food_orange"
                name="food_orange"
                defaultChecked={editingTodo?.food_orange}
              />
              <Label htmlFor="food_orange">オレンジ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="food_apple"
                name="food_apple"
                defaultChecked={editingTodo?.food_apple}
              />
              <Label htmlFor="food_apple">りんご</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="food_banana"
                name="food_banana"
                defaultChecked={editingTodo?.food_banana}
              />
              <Label htmlFor="food_banana">バナナ</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pub_date">公開日</Label>
          <Input
            id="pub_date"
            name="pub_date"
            type="date"
            defaultValue={editingTodo?.pub_date}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qty1">数量1*</Label>
          <Input
            id="qty1"
            name="qty1"
            defaultValue={editingTodo?.qty1}
          /> 
          {errors?.[`qty1`] && (
            <div className="text-red-400">{errors?.[`qty1`]}
            </div>
          )}            
        </div>

        <div className="space-y-2">
          <Label htmlFor="qty2">数量2*</Label>
          <Input
            id="qty2"
            name="qty2"
            defaultValue={editingTodo?.qty2}
          />
          {errors?.[`qty2`] && (
            <div className="text-red-400">{errors?.[`qty2`]}
            </div>
          )}              
        </div>

        <div className="space-y-2">
          <Label htmlFor="qty3">数量3*</Label>
          <Input
            id="qty3"
            name="qty3"
            defaultValue={editingTodo?.qty3}
          />
          {errors?.[`qty3`] && (
            <div className="text-red-400">{errors?.[`qty3`]}
            </div>
          )}             
        </div>                
        <Button type="submit">{BtnName}</Button>
      </Form>
    </>
  )
}
export default TodoForm;
