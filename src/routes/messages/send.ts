import { Request, Response } from "express";
import {
  ChannelService,
  MessageBody,
  MessageWithFarcasterIdBody,
  MessageWithRecipientBody,
} from "../../schemas.js";
import { Logger } from "../../utils/logger.js";
import { addToDCsQueue, addToXMTPQueue } from "../../queues/index.js";

const logger = new Logger("sendHandler");

export const sendHandler = async (req: Request, res: Response) => {
  try {
    const { text, sender, receiver, channels }: MessageBody = req.body;

    logger.log(`new message request received.`);

    const jobsToRun: Promise<void>[] = [];

    if (channels.includes(ChannelService.FarcasterDC)) {
      logger.log(`- [FDC] - send a message using farcaster direct casts.`);

      // check if the receiver is subscribed to this comunication channel
      logger.log(`- [FDC] - receiver is subscribed.`);
      const message: MessageWithFarcasterIdBody = {
        text,
        farcasterId: receiver as number,
        id: `${sender}-${receiver}-${Date.now()}`,
        sender,
      };

      jobsToRun.push(addToDCsQueue(message));
    }

    if (channels.includes(ChannelService.XMTP)) {
      // add xmtp message to queue
      logger.log(`- [XMTP] - send a message using xmtp.`);
      const message: MessageWithRecipientBody = {
          text,
          recipient: receiver as string,
          id: `${sender}-${receiver}-${Date.now()}`,
          sender,
      };

      jobsToRun.push(addToXMTPQueue(message));
    }

    await Promise.all(jobsToRun);

    return res.status(200).send({ status: "ok", body: req.body });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`error sending message: ${error.message}.`);
      return res.status(200).send({ status: "nok" });
    }
    throw error;
  }
};
