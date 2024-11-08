import React from 'react';
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    public: 'public',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: '',
    qty1: '',
    qty2: '',
    qty3: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? { ...formData, id: todo.id } : todo
      ));
    } else {
      setTodos([...todos, { ...formData, id: Date.now() }]);
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      public: 'public',
      food_orange: false,
      food_apple: false,
      food_banana: false,
      pub_date: '',
      qty1: '',
      qty2: '',
      qty3: '',
    });
    setEditingTodo(null);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData(todo);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(search.toLowerCase()) ||
    todo.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODO App</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="検索..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                新規TODO
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTodo ? 'TODO編集' : '新規TODO作成'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">内容</Label>
                  <Input
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>公開設定</Label>
                  <RadioGroup
                    name="public"
                    value={formData.public}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, public: value }))}
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

                <div className="space-y-2">
                  <Label>フルーツ選択</Label>
                  <div className="space-y-2">
                    {['orange', 'apple', 'banana'].map((fruit) => (
                      <div key={fruit} className="flex items-center space-x-2">
                        <Checkbox
                          id={`food_${fruit}`}
                          name={`food_${fruit}`}
                          checked={formData[`food_${fruit}`]}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({ ...prev, [`food_${fruit}`]: checked }))
                          }
                        />
                        <Label htmlFor={`food_${fruit}`}>{fruit}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub_date">公開日</Label>
                  <Input
                    type="date"
                    id="pub_date"
                    name="pub_date"
                    value={formData.pub_date}
                    onChange={handleInputChange}
                  />
                </div>

                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`qty${num}`}>数量{num}</Label>
                    <Input
                      type="text"
                      id={`qty${num}`}
                      name={`qty${num}`}
                      value={formData[`qty${num}`]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}

                <Button type="submit" className="w-full">
                  {editingTodo ? '更新' : '作成'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="p-4 border rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-600">{todo.content}</p>
                <div className="mt-2 space-y-1">
                  <p>公開設定: {todo.public}</p>
                  <p>公開日: {todo.pub_date}</p>
                  <p>
                    フルーツ: {['orange', 'apple', 'banana']
                      .filter(fruit => todo[`food_${fruit}`])
                      .join(', ')}
                  </p>
                  <p>数量: {todo.qty1}, {todo.qty2}, {todo.qty3}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleEdit(todo)}
                >
                  編集
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(todo.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
