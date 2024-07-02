import express from "express";
import { sendHandler } from "./send.js";
import { validateBodySchema } from "../../validators.js";
import { messageSchema } from "../../schemas.js";
import { beearlyKeyMiddleware } from "../../middlewares.js";

const messagesRouter = express.Router();

messagesRouter.post("/", beearlyKeyMiddleware, validateBodySchema(messageSchema), sendHandler);

export { messagesRouter };
