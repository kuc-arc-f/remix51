// app/routes/_index.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Todo {
  id: string;
  title: string;
  content: string;
  public: boolean;
  foods: {
    orange: boolean;
    apple: boolean;
    banana: boolean;
    melon: boolean;
    grape: boolean;
  };
  dates: string[];
  quantities: string[];
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const initialTodoState: Todo = {
    id: "",
    title: "",
    content: "",
    public: true,
    foods: {
      orange: false,
      apple: false,
      banana: false,
      melon: false,
      grape: false,
    },
    dates: ["", "", "", "", "", ""],
    quantities: ["", "", "", "", "", ""],
  };

  const [newTodo, setNewTodo] = useState<Todo>({ ...initialTodoState });

  const handleSubmit = () => {
    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? { ...newTodo, id: todo.id } : todo
      ));
    } else {
      setTodos([...todos, { ...newTodo, id: Date.now().toString() }]);
    }
    setNewTodo({ ...initialTodoState });
    setEditingTodo(null);
    setIsOpen(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
      
      <div className="mb-4">
        <Input
          type="text"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>新規TODO作成</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? "TODO編集" : "新規TODO作成"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">内容</Label>
              <Input
                id="content"
                value={newTodo.content}
                onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>公開設定</Label>
              <RadioGroup
                value={newTodo.public ? "public" : "private"}
                onValueChange={(value) => setNewTodo({ ...newTodo, public: value === "public" })}
              >
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

            <div className="grid gap-2">
              <Label>フルーツ選択</Label>
              <div className="flex flex-wrap gap-4">
                {Object.entries({
                  orange: "オレンジ",
                  apple: "りんご",
                  banana: "バナナ",
                  melon: "メロン",
                  grape: "ぶどう"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={newTodo.foods[key as keyof typeof newTodo.foods]}
                      onCheckedChange={(checked) => 
                        setNewTodo({
                          ...newTodo,
                          foods: { ...newTodo.foods, [key]: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>日付と数量</Label>
              <div className="grid gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      type="date"
                      value={newTodo.dates[i]}
                      onChange={(e) => {
                        const newDates = [...newTodo.dates];
                        newDates[i] = e.target.value;
                        setNewTodo({ ...newTodo, dates: newDates });
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="数量"
                      value={newTodo.quantities[i]}
                      onChange={(e) => {
                        const newQuantities = [...newTodo.quantities];
                        newQuantities[i] = e.target.value;
                        setNewTodo({ ...newTodo, quantities: newQuantities });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSubmit}>
              {editingTodo ? "更新" : "作成"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 mt-4">
        {filteredTodos.map((todo) => (
          <Card key={todo.id}>
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{todo.content}</p>
              <p>公開設定: {todo.public ? "公開" : "非公開"}</p>
              <div className="mt-2">
                <p>選択されたフルーツ:</p>
                <ul>
                  {Object.entries(todo.foods)
                    .filter(([_, checked]) => checked)
                    .map(([fruit]) => (
                      <li key={fruit}>{fruit}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-2">
                <p>日付と数量:</p>
                {todo.dates.map((date, i) => (
                  date && (
                    <div key={i}>
                      {date}: {todo.quantities[i]}
                    </div>
                  )
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleEdit(todo)}>編集</Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDelete(todo.id)}
                >
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
