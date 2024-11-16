// app/components/TodoList.tsx
import { useState , useEffect } from 'react';
import { TodoDialog } from './TodoDialog';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TodoSchemaType } from './todo-schema';

interface Todo extends TodoSchemaType {
  id: string;
}

interface TodoListProps {
  actionData?: {
    success: boolean;
    action?: string;
    errors?: string;
    data?: TodoSchemaType;
  };
}
let initialData = {}; 
let dialogMode = "add";

export function TodoList({ actionData }: TodoListProps) {
  const [errors, setErrors] = useState({}); 
  const [isOpen, setIsOpen] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if(actionData){
      console.log(actionData);
      if(actionData?.errors){
        //setFormData(actionData?.data);
        setErrors(actionData?.errors);
        console.log(actionData?.errors);
      }
      if (actionData?.success && actionData.data) {
        if (actionData.action === 'add') {
          setTodos(prev => [...prev, { ...actionData.data, id: Date.now().toString() }]);
        } else if (actionData.action === 'edit' && actionData.data.id) {
          setTodos(prev =>
            prev.map(todo => (todo.id === actionData.data.id ? actionData.data as Todo : todo))
          );
          setIsOpen(false); 
        }
      }      
    }
  }, [actionData]);

  const resetForm = () => {
    //setFormData(initialFormData);
    //setCurrentTodo(null);
    setIsOpen(true);
    setErrors({}); 
  };

  const handleEdit = (todo: Todo) => {
console.log(todo); 
    dialogMode = "edit"; 
    setErrors({});
    initialData= todo; 
    //setCurrentTodo(todo);
    //setFormData(todo);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('本当に削除しますか？')) {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* onSuccess={handleSuccess} */}
        <TodoDialog 
          mode={dialogMode}  
          initialData={initialData}
          actionData={actionData}
          errors={errors} 
          resetForm={resetForm}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <Input
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>公開設定</TableHead>
            <TableHead>フルーツ</TableHead>
            <TableHead>公開日</TableHead>
            <TableHead>数量</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>{todo.public === 'public' ? '公開' : '非公開'}</TableCell>
              <TableCell>
                {[
                  todo.food_orange && 'オレンジ',
                  todo.food_apple && 'りんご',
                  todo.food_banana && 'バナナ'
                ].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>{todo.pub_date}</TableCell>
              <TableCell>
                {[todo.qty1, todo.qty2, todo.qty3].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {/* onSuccess={handleSuccess}  */}
                  <Button variant="outline"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit 
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(todo.id)}
                  >
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
