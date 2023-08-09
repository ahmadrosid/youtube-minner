import { crawlComments, crawlTranscript } from "./youtube";
import { ServerInferResponses, ServerInferRequest } from "@ts-rest/core";
import { apiYoutube } from "contract";

type GetCommentResponse = ServerInferResponses<typeof apiYoutube.fetchComments>;
type GetCommentRequest = ServerInferRequest<typeof apiYoutube.fetchComments>;
type GetTranscriptResponse = ServerInferResponses<
  typeof apiYoutube.fetchTranscript
>;
type GetTranscriptRequest = ServerInferRequest<
  typeof apiYoutube.fetchTranscript
>;

const getComments = async ({
  query,
}: GetCommentRequest): Promise<GetCommentResponse> => {
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
};

const getTranscript = async ({
  query,
}: GetTranscriptRequest): Promise<GetTranscriptResponse> => {
  try {
    const data = await crawlTranscript(query.url);
    return {
      status: 200,
      body: {
        title: data.title || "",
        transcripts: data.transcript,
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
};

export default {
  getComments,
  getTranscript,
};
