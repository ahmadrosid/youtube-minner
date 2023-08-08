import { Innertube, UniversalCache } from "youtubei.js";
import { Comment } from "contract";

type Parameter = {
  videoId: string;
  sortBy: "TOP_COMMENTS" | "NEWEST_FIRST";
  continuation?: string;
};

function getVideoId(url: string): string {
  const urlParsed = new URL(url);
  const searchParams = new URLSearchParams(urlParsed.search);
  return searchParams.get("v") || "";
}

const questionWords = [
  "apa",
  "mengapa",
  "bagaimana",
  "kenapa",
  "kapan",
  "dimana",
];

const isQuestion = (text: string | undefined) => {
  if (!text) return false;

  return (
    questionWords.some((word) => text.toLowerCase().includes(word)) ||
    text.includes("?")
  );
};

function formatComment(data: any): Comment[] {
  return data.contents.map(({ comment }: any) => ({
    author: comment?.author?.name,
    text: comment?.content.text,
    likes: comment?.vote_count,
    time: comment?.published.text,
    is_question: isQuestion(comment?.content.text) ? 1 : 0,
  }));
}

export async function crawlComments(url: string, limit: number) {
  const results = [];
  let params: Parameter = {
    videoId: getVideoId(url),
    sortBy: "NEWEST_FIRST",
  };

  const yt = await Innertube.create({
    cache: new UniversalCache(false),
  });

  const [info, commentResult] = await Promise.all([
    yt.getInfo(getVideoId(url)),
    yt.getComments(params.videoId, params.sortBy),
  ]);

  let result = commentResult;
  const comments = formatComment(result);
  for (let i = 0; i < comments.length; i++) {
    results.push(comments[i]);
  }

  let has_continuation = result.has_continuation;
  let loadMoreCounter = 0;
  while (has_continuation) {
    result = await result.getContinuation();
    const comments = formatComment(result);
    for (let i = 0; i < comments.length; i++) {
      results.push(comments[i]);
    }

    loadMoreCounter++;
    if (loadMoreCounter >= limit) {
      break;
    }
    has_continuation = false;
  }
  return { results, title: info.basic_info.title };
}
