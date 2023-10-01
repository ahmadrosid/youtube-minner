"use client";

import { CopyIcon, Download, Loader2Icon } from "lucide-react";
import { useState, useCallback } from "react";
import { Input, Label, Button } from "ui";
import { toast } from "sonner";
import { client } from "@/lib/api";
import type { TranscriptResponse } from "contract";
import { downloadToTxtFile } from "@/lib/file";

export default function Page() {
  const [controller, setController] = useState<AbortController | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptResponse | null>(
    null
  );

  const handleCopyTranscription = useCallback(() => {
    navigator.clipboard
      .writeText(
        `# ${transcripts?.title}\n\n${transcripts.transcripts.map(
          (t) => t.text
        )}`
      )
      .then(() => {
        toast.success("Copied to clipboard!");
      });
  }, [transcripts]);

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
      client
        .fetchTranscript({
          query: {
            url: youtubeUrl,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setTranscripts(res.body);
          } else if (res.status === 400) {
            toast(res.body.message);
          }
        })
        .finally(() => setController(null));
    },
    [controller]
  );

  const handleDownloadFile = useCallback(() => {
    downloadToTxtFile(
      transcripts.transcripts.map((t) => t.text).join(" "),
      `${transcripts.title}.txt`
    );
    toast.success("Downloaded");
  }, [transcripts, toast]);

  return (
    <main className="p-8 container mx-auto grid gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold leading-relaxed tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl text-gray-800">
          YouTube Transcript
        </h1>
        <p className="text-slate-600">
          Get text transcriptions of YouTube videos
        </p>
      </div>
      <div className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 grow">
              <Label>YouTube video url</Label>
              <Input
                type="text"
                placeholder="https://youtube.com/watch?v=.."
                name="youtube_url"
              />
            </div>
            <Button>
              {controller && (
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {controller ? "Cancel" : "Get transcript"}
            </Button>
          </div>
        </form>
      </div>
      {transcripts?.transcripts.length > 0 && (
        <div>
          <div className="py-2 flex items-center">
            <h2 className="text-2xl">{transcripts.title}</h2>
            <div className="flex ml-auto gap-3">
              <Button onClick={handleCopyTranscription} variant="outline">
                <CopyIcon className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button onClick={handleDownloadFile} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 p-4 bg-white ring-2 ring-gray-100/50">
            <div className="space-y-2">
              {transcripts.transcripts.map((transcript) => (
                <span key={transcript.offset}>{transcript.text} </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
