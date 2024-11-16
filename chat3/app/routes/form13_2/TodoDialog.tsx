// app/components/TodoDialog.tsx
import { useState , useEffect } from 'react';
import { Form } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TodoSchemaType } from './todo-schema'; 

interface TodoDialogProps {
  mode: 'add' | 'edit';
  initialData?: TodoSchemaType & { id?: string };
  actionData?: {
    success: boolean;
    action?: string;
    errors?: string;
    data?: TodoSchemaType;
  };
  onSuccess?: () => void;
  errors?: any
}

export function TodoDialog({ 
  mode, 
  initialData, 
  actionData,
  onSuccess,
  errors,
  resetForm,
  isOpen,
  setIsOpen
}: TodoDialogProps) {
  //const [isOpen, setIsOpen] = useState(false);
console.log("isOpen=", isOpen );
//console.log(initialData);
  // アクションが成功した場合の処理
  if (actionData?.success && isOpen) {
    //setIsOpen(false);
    onSuccess?.();
  }
  //useEffect(() => {
  //}, []);
  if(mode === "edit" && isOpen){
    console.log("mode= edit");   
      
  }
  console.log(initialData);  
//if (errors) {
   //console.log(errors);
  //}

  const defaultValues = {
    title: '',
    content: '',
    public: 'private',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: '',
    qty1: '',
    qty2: '',
    qty3: '',
    ...initialData
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild> 
        <Button variant="outline" onClick={()=>{resetForm()}}>
          {mode === 'add' ? 'タスクを追加' : 'タスクを編集'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'タスクの追加' : 'タスクの編集'}
          </DialogTitle>
        </DialogHeader>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value={mode} />
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル*</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues.title}
            />
            {errors?.title && (
              <div className="text-red-400">{errors?.title[0]}</div>
            )} 
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容*</Label>
            <Input
              id="content"
              name="content"
              defaultValue={defaultValues.content}
            />
            {errors?.content && (
              <div className="text-red-400">{errors?.content[0]}</div>
            )} 
          </div>

          <div className="space-y-2">
            <Label>公開設定</Label>
            <RadioGroup defaultValue={defaultValues.public} name="public">
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
                  defaultChecked={defaultValues.food_orange}
                />
                <Label htmlFor="food_orange">オレンジ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="food_apple"
                  name="food_apple"
                  defaultChecked={defaultValues.food_apple}
                />
                <Label htmlFor="food_apple">りんご</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="food_banana"
                  name="food_banana"
                  defaultChecked={defaultValues.food_banana}
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
              defaultValue={defaultValues.pub_date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty1">数量1*</Label>
            <Input
              id="qty1"
              name="qty1"
              defaultValue={defaultValues.qty1}
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
              defaultValue={defaultValues.qty2}
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
              defaultValue={defaultValues.qty3}
            />
            {errors?.[`qty3`] && (
              <div className="text-red-400">{errors?.[`qty3`]}
              </div>
            )}             
          </div>

          <Button type="submit">
            {mode === 'add' ? '追加' : '更新'}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
