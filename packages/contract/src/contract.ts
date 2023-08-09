import { initContract } from "@ts-rest/core";
import { z } from "zod";

export type Comment = {
  author: string;
  text: string;
  likes: string;
  time: string;
  is_question: number;
};

export interface Comments {
  comments: Comment[];
  title: string;
  total: number;
}

const TranscripSchema = z.object({
  title: z.string(),
  transcripts: z.array(
    z.object({
      text: z.string(),
      offset: z.number(),
      duration: z.number(),
    })
  ),
});

export type TranscriptResponse = z.infer<typeof TranscripSchema>;

const GetCommentsQuerySchema = z.object({
  url: z.string(),
  limit: z.number().optional(),
});

const CommentsSchema = z.object({
  comments: z.array(
    z.object({
      author: z.string(),
      text: z.string(),
      likes: z.string(),
      time: z.string(),
      is_question: z.number(),
    })
  ),
  title: z.string(),
  total: z.number(),
});

const contract = initContract();

export const apiYoutube = contract.router({
  fetchComments: {
    method: "GET",
    path: "/comments",
    responses: {
      200: CommentsSchema,
      400: z.object({ message: z.string() }),
    },
    query: GetCommentsQuerySchema,
    summary: "Fetch youtube comments",
  },
  fetchTranscript: {
    method: "GET",
    path: "/transcript",
    responses: {
      200: TranscripSchema,
      400: z.object({ message: z.string() }),
    },
    query: z.object({
      url: z.string(),
    }),
    summary: "Fetch youtube transcript",
  },
});
