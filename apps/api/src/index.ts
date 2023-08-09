import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { initServer, createExpressEndpoints } from "@ts-rest/express";
import { generateOpenApi } from "@ts-rest/open-api";
import { serve, setup } from "swagger-ui-express";
import { apiYoutube } from "contract";
import controller from "./contoller";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const s = initServer();

const router = s.router(apiYoutube, {
  fetchComments: controller.getComments,
  fetchTranscript: controller.getTranscript,
});

const openapiDocument = generateOpenApi(
  apiYoutube,
  {
    openapi: "3.0.0",
    info: { title: "YoutubeMinner API", version: "1.0.0" },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:8000/",
      },
    ],
  },
  {
    setOperationId: true,
  }
);

const apiDocs = express.Router();
apiDocs.use(serve);
apiDocs.get("/", setup(openapiDocument));
app.use("/docs", apiDocs);
app.get("/swagger.json", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.send(JSON.stringify(openapiDocument, null, 2));
});

createExpressEndpoints(apiYoutube, router, app);

const port = process.env.port || 8000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
