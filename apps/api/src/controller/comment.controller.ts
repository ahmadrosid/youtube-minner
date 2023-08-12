import { crawlComments } from "../youtube";
import { ServerInferResponses, ServerInferRequest } from "@ts-rest/core";
import { apiYoutube } from "contract";

type GetCommentResponse = ServerInferResponses<typeof apiYoutube.fetchComments>;
type GetCommentRequest = ServerInferRequest<typeof apiYoutube.fetchComments>;

export async function fetchComments({
  query,
}: GetCommentRequest): Promise<GetCommentResponse> {
  try {
    const data = await crawlComments(query.url, Number(query.limit) || 2);
    return {
      status: 200,
      body: {
        comments: data.results,
        title: data.title || "",
        total: data.results.length,
      },
    };
  } catch (error: any) {
    return {
      status: 400,
      body: {
        message: error.message,
      },
    };
  }
}
