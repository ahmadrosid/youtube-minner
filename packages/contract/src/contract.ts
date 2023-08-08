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
    query: z.object({
      url: z.string(),
      limit: z.string().nullable(),
    }),
    summary: "Fetch youtube comments",
  },
});
