import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";

const TodoForm = ({
  todo = null, action = null, currentTodo = null, formData = null,
  actionData = null ,
}) => {
  const submit = useSubmit();
  return (
    <form method="post" onSubmit={(e) => {
      e.preventDefault();
      const sendFormData = new FormData(e.currentTarget);
      submit(sendFormData, { method: "post" });
    }}>
      {/* JSON.stringify(formData) <span>id={todo.id}</span> (action !== "create")
       */}
      <input type="hidden" name="_action" value={currentTodo ? "edit" : "create"} />
      {currentTodo ? (
        <input type="hidden" name="todo_id" value={formData.id} />
      ) :null}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            name="title"
            defaultValue={formData?.title}
          />
        </div>
        {actionData?.errors?.title && (
          <div className="text-red-400">{actionData?.errors?.title[0]}</div>
        )}

        <div>
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            name="content"
            defaultValue={formData?.content}
          />
        </div>
        {actionData?.errors?.content && (
          <div className="text-red-400">{actionData?.errors?.content[0]}</div>
        )}
        <div>
          <Label>公開設定</Label>
          {/* <RadioGroup defaultValue="public" name="public"> */}
          <RadioGroup defaultValue={formData?.public}
           name="public">
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
          <Label>フルーツ選択</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="food_orange" name="food_orange" 
              defaultChecked={formData?.food_orange} />
              <Label htmlFor="food_orange">オレンジ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_apple" name="food_apple" 
              defaultChecked={formData?.food_apple} />
              <Label htmlFor="food_apple">りんご</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_banana" name="food_banana" 
              defaultChecked={formData?.food_banana} />
              <Label htmlFor="food_banana">バナナ</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="pub_date">公開日</Label>
          <Input
            type="date"
            id="pub_date"
            name="pub_date"
            defaultValue={formData?.pub_date}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <Label htmlFor={`qty${num}`}>数量{num}</Label>
              {formData ? (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={formData?.[`qty${num}`]}
                />
              ) : (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={0}
                />
              )}
            {actionData?.errors?.[`qty${num}`] && (
              <div className="text-red-400">{actionData?.errors?.[`qty${num}`]}
              </div>
            )}
            </div>

          ))}
        </div>

        <Button type="submit">
          {currentTodo ? "更新" : "追加"}
        </Button>
      </div>
    </form>
  )
};
export default TodoForm;