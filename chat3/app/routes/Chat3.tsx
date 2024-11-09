
import React, { useState , useEffect } from 'react';
import { json, type ActionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Trash2, Reply } from "lucide-react";
import Head from '../components/Head';
import CrudIndex from "./Chat3/CrudIndex";
//
export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const resulte = await CrudIndex.getList();
  return json({ data: resulte });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const action = formData.get("_action");
  console.log("action=", action);

  if (action === "create" || action === "edit") {
    try {
      if (action === "create") {
        const result = await CrudIndex.addItem(data);
        console.log(result)
        return json({ success: true , action: "create", data: data, });
      }else{
        console.log("edit.id=", data.id);
        const result = await CrudIndex.update(data, Number(data.id));
        console.log(result)
        return json({
          success: true, action: "edit", data: data, id: 0 
        });

      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            if (!validationErrors[path]) {
              validationErrors[path] = [];
            }
            validationErrors[path].push(err.message);
          });
          return json({ errors: validationErrors , data : data },
            { status: 400 }
          );
        }
      }
      console.log(error);
      return json({ error: "不明なエラーが発生しました" }, { status: 500 });
    }
  }
  if (action === "delete") {
    const id = formData.get("id");
    console.log("#action.delete.id", id);
    const result = await CrudIndex.delete(Number(id));
    console.log(result);
    return json({ success: true, action: "delete", id: 0, });
  }
  return json({ error: "Invalid action" }, { status: 400 });
};
const ChatApp = () => {
  const submit = useSubmit();
  const { data } = useLoaderData<typeof loader>();
  // 投稿とスレッドの状態管理
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);

  //console.log(posts);
  useEffect(() => {
    console.log(data);
    setPosts(data);
  }, []);

  // 新規投稿を追加
  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        replies: [],
        timestamp: new Date().toLocaleString(),
      };
      //POST_ADD
      const sendFormData = new FormData();
      sendFormData.append("_action", "create");
      sendFormData.append("content", newPost);
      sendFormData.append("replies", JSON.stringify([]));
      sendFormData.append("timestamp", new Date().toLocaleString());
      submit(sendFormData, { method: "post" });
      //
      setPosts([...posts, post]);
      setNewPost('');
      setShowPostDialog(false);
    }
  };

  // 投稿を削除
  const handleDeletePost = (postId) => {
    console.log("handleDeletePost.postId=", postId)
    const sendFormData = new FormData();
    sendFormData.append("_action", "delete");
    sendFormData.append("id", postId);
    submit(sendFormData, { method: "post" });
    //
    setPosts(posts.filter(post => post.id !== postId));
  };

  // 返信を追加
  const handleAddReply = () => {
    if (newReply.trim() && selectedPost) {
console.log("#handleAddReply");
      const target = posts.filter(post => post.id === selectedPost.id)
      if(target.length > 0){
        const row = target[0];
        console.log(row.replies);
        const newEntry = {
          id: Date.now(),
          content: newReply,
          timestamp: new Date().toLocaleString(),
        };
        row.replies.push(newEntry);
        console.log(row);
        const sendFormData = new FormData();
        sendFormData.append("_action", "edit");
        sendFormData.append("id", row.id);
        sendFormData.append("content", row.content);
        sendFormData.append("replies", JSON.stringify(row.replies));
        sendFormData.append("timestamp", row.timestamp);
        submit(sendFormData, { method: "post" });
      }
      setNewReply('');
      setShowReplyDialog(false);
    }
  };

  // 返信を削除
  const handleDeleteReply = (postId, replyId) => {
    console.log(`#handleDeleteReply.postId=${postId} , ${replyId}`);
    const target = posts.filter(post => post.id === postId);
    if(target.length > 0) {
      const row = target[0];
      const newReplies = row.replies.filter(reply => reply.id !== replyId)
      row.replies = newReplies;
      console.log(row);
      const sendFormData = new FormData();
      sendFormData.append("_action", "edit");
      sendFormData.append("id", row.id);
      sendFormData.append("content", row.content);
      sendFormData.append("replies", JSON.stringify(row.replies));
      sendFormData.append("timestamp", row.timestamp);
      submit(sendFormData, { method: "post" });
    }
  };

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-4xl font-bold">Chat3</h1>
      <hr className="my-2" />
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">チャットアプリ</h1>
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              新規投稿
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規投稿</DialogTitle>
            </DialogHeader>
            <div className="my-4">
              <Textarea
                placeholder="投稿内容を入力してください"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddPost}>投稿</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <span className="text-sm text-gray-500">{post.timestamp}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                返信 {post.replies.length}件
              </span>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedPost(post);
                  setShowReplyDialog(true);
                }}
              >
                <Reply className="mr-2 h-4 w-4" />
                返信
              </Button>
            </CardFooter>

            {post.replies.length > 0 && (
              <div className="border-t p-4">
                <div className="space-y-2">
                  {post.replies.map(reply => (
                    <div
                      key={reply.id}
                      className="ml-6 p-2 bg-gray-50 rounded-lg flex justify-between items-start"
                    >
                      <div>
                        <p className="text-sm whitespace-pre-wrap">
                          {reply.content}
                        </p>
                        <span className="text-xs text-gray-500">
                          {reply.timestamp}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReply(post.id, reply.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>返信を追加</DialogTitle>
          </DialogHeader>
          <div className="my-0">
            <Textarea
              placeholder="返信内容を入力してください"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
          </div>
          <div className="text-end">
            <Button onClick={handleAddReply}>返信する</Button>
          </div>
          {selectedPost && selectedPost.replies.length > 0 && (
            <div className="border-t p-4">
              <div className="space-y-2">
                {selectedPost.replies.map(reply => (
                  <div
                    key={reply.id}
                    className="ml-6 p-2 bg-gray-50 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="text-sm whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      <span className="text-xs text-gray-500">
                        {reply.timestamp}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReply(selectedPost.id, reply.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </>

  );
};

export default ChatApp;
