import { crawlTranscript } from "../youtube";
import { ServerInferResponses, ServerInferRequest } from "@ts-rest/core";
import { apiYoutube } from "contract";

type GetTranscriptResponse = ServerInferResponses<
  typeof apiYoutube.fetchTranscript
>;
type GetTranscriptRequest = ServerInferRequest<
  typeof apiYoutube.fetchTranscript
>;

export async function fetchTranscript({
  query,
}: GetTranscriptRequest): Promise<GetTranscriptResponse> {
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
}
