//import type { MetaFunction } from "@remix-run/node";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const TodoFormDialog = ({ 
  title = "Add Todo",
  defaultValues = {
    title: "",
    content: "",
    public: "private",
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: "",
    qty1: "",
    qty2: "",
    qty3: "",
  },
  onSubmit
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form defaultValues={defaultValues} className="space-y-4">
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="public"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-3">
                      <RadioGroupItem value="public" />
                      <FormLabel className="font-normal">Public</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3">
                      <RadioGroupItem value="private" />
                      <FormLabel className="font-normal">Private</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Foods</FormLabel>
            <div className="flex space-x-4">
              <FormField
                name="food_orange"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Orange</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                name="food_apple"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Apple</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                name="food_banana"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Banana</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            name="pub_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="qty1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="qty2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="qty3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity 3</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoFormDialog;
