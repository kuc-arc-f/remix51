
import React, { useState } from 'react';
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

const ChatApp = () => {
  // 投稿とスレッドの状態管理
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);

  // 新規投稿を追加
  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        replies: [],
        timestamp: new Date().toLocaleString(),
      };
      setPosts([...posts, post]);
      setNewPost('');
      setShowPostDialog(false);
    }
  };

  // 投稿を削除
  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // 返信を追加
  const handleAddReply = () => {
    if (newReply.trim() && selectedPost) {
      const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            replies: [...post.replies, {
              id: Date.now(),
              content: newReply,
              timestamp: new Date().toLocaleString(),
            }],
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewReply('');
      setShowReplyDialog(false);
    }
  };

  // 返信を削除
  const handleDeleteReply = (postId, replyId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.filter(reply => reply.id !== replyId),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
  <>
    <Head />
    <div className="max-w-2xl mx-auto p-4">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>返信を追加</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Textarea
              placeholder="返信内容を入力してください"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddReply}>返信する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </>

  );
};

export default ChatApp;
