import { useState } from "react";
//import { TodoForm } from "~/components/TodoForm";
//import { Dialog, DialogTrigger, DialogContent } from "shadcn/ui"; // Dialogコンポーネント
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

export function TodoForm({ onSave }: { onSave: (todo: any) => void }) {
  const [todo, setTodo] = useState({
    title: "",
    content: "",
    public: "private",
    food: {
      orange: false,
      apple: false,
      banana: false,
      melon: false,
      grape: false,
    },
    pub_dates: Array(6).fill(""),
    qtys: Array(6).fill(""),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setTodo(prev => ({ ...prev, food: { ...prev.food, [name]: checked } }));
    } else if (key === "dates" || key === "qtys") {
      const index = parseInt(name.replace(/[^\d]/g, "")) - 1;
      setTodo(prev => ({ ...prev, [key]: prev[key].map((val, idx) => (idx === index ? value : val)) }));
    } else {
      setTodo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => onSave(todo);

  return (
    <Dialog>
      <DialogTrigger className="button">新規TODOを追加</DialogTrigger>
      <DialogContent>
        <input name="title" type="text" placeholder="Title" onChange={(e) => handleChange(e, "")} />
        <textarea name="content" placeholder="Content" onChange={(e) => handleChange(e, "")} />
        <div>
          <label><input name="public" type="radio" value="public" onChange={(e) => handleChange(e, "")} /> 公開</label>
          <label><input name="public" type="radio" value="private" onChange={(e) => handleChange(e, "")} /> 非公開</label>
        </div>
        {["orange", "apple", "banana", "melon", "grape"].map(fruit => (
          <label key={fruit}>
            <input name={fruit} type="checkbox" onChange={(e) => handleChange(e, "")} /> {fruit}
          </label>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`date${i + 1}`}>
            <input name={`pub_date${i + 1}`} type="date" onChange={(e) => handleChange(e, "dates")} />
            <input name={`qty${i + 1}`} type="text" placeholder="Quantity" onChange={(e) => handleChange(e, "qtys")} />
          </div>
        ))}
        <button onClick={handleSave}>保存</button>
      </DialogContent>
    </Dialog>
  );
}

//
export default function Index() {
  const [todos, setTodos] = useState([]);
  const [query, setQuery] = useState("");

  const handleAddTodo = (todo: any) => {
    setTodos([...todos, { ...todo, id: Date.now() }]);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id: number, updatedTodo: any) => {
    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
  };

  const filteredTodos = todos.filter(todo => todo.title.includes(query));

  return (
    <div>
      <input
        type="text"
        placeholder="検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <TodoForm onSave={handleAddTodo} />
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.content}</p>
            <p>公開状態: {todo.public}</p>
            <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
            <button onClick={() => {/* 編集ダイアログの表示ロジック */}}>編集</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
