"use client";

import { Toaster, toast } from "sonner";
import {
  CheckCircle2,
  ChevronsUpDown,
  Download,
  Loader2Icon,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button, Input, Label } from "ui";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui";
import { VerticalLine } from "@/app/components/vertical-line";
import { CopyClipboard } from "@/app/components/copy-clipboard";
import type { Comment } from "contract";
import { client } from "@/lib/api";

async function fetchComments(youtubeUrl: string, controller: AbortController) {
  return client.fetchComments({
    query: {
      url: youtubeUrl,
      limit: "2",
    },
  });
}

export default function Page() {
  const [controller, setController] = useState<AbortController | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [oldComments, setOldComments] = useState<Comment[]>([]);
  const [title, setTitle] = useState<string>("");

  const handleSortIsQuestion = useCallback(() => {
    setComments((prev) => {
      if (oldComments.length > 0) {
        setOldComments([]);
        return [...oldComments];
      }
      setOldComments([...prev]);
      return [...prev].sort((a, b) => b.is_question - a.is_question);
    });
  }, [oldComments, setOldComments, setComments]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const youtubeUrl = formData.get("youtube_url") as string;
      if (!youtubeUrl) {
        toast("Youtube url is required");
        return;
      }
      if (controller) {
        controller.abort();
        setController(null);
        return;
      }
      const signal = new AbortController();
      setController(signal);
      fetchComments(youtubeUrl, signal)
        .then((res) => {
          if (res.status === 200) {
            setComments(res.body.comments as Comment[]);
            setTitle(res.body.title);
          }
        })
        .finally(() => setController(null));
    },
    [controller]
  );

  return (
    <div>
      <main className="p-8 max-w-6xl mx-auto grid gap-8">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Label>Youtube url</Label>
            <Input
              type="text"
              placeholder="Youtube url..."
              name="youtube_url"
            />
            <Button>
              {controller && (
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {controller ? "Cancel" : "Get comments"}
            </Button>
          </div>
        </form>
        {comments.length > 0 && (
          <div className="space-y-4 grid">
            <div className="flex ml-auto items-center gap-2">
              <p>{title}</p>
              <VerticalLine />
              <p className="text-gray-700 text-sm">
                Total comments: {comments.length}
              </p>
              <VerticalLine />
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download csv
              </Button>
            </div>
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden ring-2 ring-gray-100/50">
              <Table>
                <TableCaption className="py-6 border-t">
                  A list youtube comments.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Author</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead
                      className="w-[140px] flex items-center cursor-pointer"
                      onClick={handleSortIsQuestion}
                    >
                      <ChevronsUpDown className="w-4 h-4 mr-2" /> Is Question?
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {comment.author}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <CopyClipboard text={comment.text} />
                        {comment.text}
                      </TableCell>
                      <TableCell>{comment.time}</TableCell>
                      <TableCell className="text-right">
                        {comment.likes}
                      </TableCell>
                      <TableCell className="flex justify-center">
                        {comment.is_question ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
