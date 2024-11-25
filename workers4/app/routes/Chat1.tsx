// app/routes/_index.tsx
import { useState } from "react"; 
import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types
interface Post {
  id: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
}

// Loader Function
export const loader: LoaderFunction = async () => {
  // TODO: Replace with actual database fetch
  const posts: Post[] = [
    {
      id: "1",
      content: "First post",
      createdAt: new Date().toISOString(),
      replies: [],
    },
  ];
  return json({ posts });
};

// Action Function
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create-post":
      // TODO: Implement post creation
      break;
    case "delete-post":
      // TODO: Implement post deletion
      break;
    case "create-reply":
      // TODO: Implement reply creation
      break;
    case "delete-reply":
      // TODO: Implement reply deletion
      break;
  }
  return null;
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: Post[] }>();
  const submit = useSubmit();
  const [newPostContent, setNewPostContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleCreatePost = () => {
    const formData = new FormData();
    formData.append("intent", "create-post");
    formData.append("content", newPostContent);
    submit(formData, { method: "post" });
    setNewPostContent("");
  };

  const handleDeletePost = (postId: string) => {
    const formData = new FormData();
    formData.append("intent", "delete-post");
    formData.append("postId", postId);
    submit(formData, { method: "post" });
  };

  const handleCreateReply = (postId: string) => {
    const formData = new FormData();
    formData.append("intent", "create-reply");
    formData.append("postId", postId);
    formData.append("content", newReplyContent);
    submit(formData, { method: "post" });
    setNewReplyContent("");
    setSelectedPostId(null);
  };

  const handleDeleteReply = (replyId: string) => {
    const formData = new FormData();
    formData.append("intent", "delete-reply");
    formData.append("replyId", replyId);
    submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>新規投稿</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規投稿</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="投稿内容を入力してください"
              />
              <Button onClick={handleCreatePost}>投稿</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      削除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>投稿を削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePost(post.id)}
                      >
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    返信
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>返信を作成</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      placeholder="返信内容を入力してください"
                    />
                    <Button onClick={() => handleCreateReply(post.id)}>
                      返信する
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>

            {/* Replies */}
            <div className="ml-8 space-y-2">
              {post.replies.map((reply) => (
                <Card key={reply.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              返信を削除しますか？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReply(reply.id)}
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{reply.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
