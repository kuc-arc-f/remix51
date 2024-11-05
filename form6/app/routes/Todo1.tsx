import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";

import React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { z } from "zod";
import Head from '../components/Head';

// zodスキーマの定義
const todoSchema = z.object({
  text: z.string().min(2, "TODOは2文字以上で入力してください。")
});

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return null;
};

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ id: null, text: '' });
  const [newTodoText, setNewTodoText] = useState('');
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');

  // バリデーション関数
  const validateTodo = (text) => {
    try {
      todoSchema.parse({ text });
      return { success: true, error: null };
    } catch (error) {
      const formattedError = error.errors[0]?.message || "入力内容が不正です。";
      return { success: false, error: formattedError };
    }
  };

  // TODO追加
  const handleAddTodo = () => {
    const validation = validateTodo(newTodoText);
    
    if (!validation.success) {
      setAddError(validation.error);
      return;
    }

    setTodos([...todos, { id: Date.now(), text: newTodoText }]);
    setNewTodoText('');
    setAddError('');
    setIsAddDialogOpen(false);
  };

  // TODO編集
  const handleEditTodo = () => {
    const validation = validateTodo(currentTodo.text);
    
    if (!validation.success) {
      setEditError(validation.error);
      return;
    }

    setTodos(todos.map(todo => 
      todo.id === currentTodo.id ? { ...todo, text: currentTodo.text } : todo
    ));
    setEditError('');
    setIsEditDialogOpen(false);
  };

  // TODO削除
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 検索フィルター
  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold">TODOアプリ</h1>
        
        {/* 検索バー */}
        <div className="flex gap-2">
          <Input
            placeholder="TODOを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Search className="w-6 h-6 text-gray-400" />
        </div>

        {/* 新規追加ボタン */}
        <Button 
          onClick={() => {
            setIsAddDialogOpen(true);
            setAddError('');
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          新規TODO追加
        </Button>
      </div>

      {/* TODOリスト */}
      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <Card key={todo.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="flex-1">{todo.text}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentTodo(todo);
                    setEditError('');
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規TODO追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="TODOを入力..."
              value={newTodoText}
              onChange={(e) => {
                setNewTodoText(e.target.value);
                setAddError('');
              }}
            />
            {addError && (
              <Alert variant="destructive">
                <AlertDescription>{addError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setAddError('');
            }}>
              キャンセル
            </Button>
            <Button onClick={handleAddTodo}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>TODO編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="TODOを入力..."
              value={currentTodo.text}
              onChange={(e) => {
                setCurrentTodo({ ...currentTodo, text: e.target.value });
                setEditError('');
              }}
            />
            {editError && (
              <Alert variant="destructive">
                <AlertDescription>{editError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditError('');
            }}>
              キャンセル
            </Button>
            <Button onClick={handleEditTodo}>
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>  
  </>

  );
};

export default TodoApp;

