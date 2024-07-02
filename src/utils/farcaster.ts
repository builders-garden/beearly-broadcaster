import { env } from "../env.js";
import ky from "ky";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "./logger.js";
import { BeearlySender } from "../schemas.js";

const logger = new Logger("farcaster");

/**
 * @dev this function sends a direct cast to the given recipient
 * @param {string} text the text of the cast to send
 * @param {number} recipient farcaster id of the recipient
 */
export const sendDirectCast = async (
  recipient: number,
  text: string,
  sender: BeearlySender = BeearlySender.BEEARLYBOT
) => {
  let apiKey: string | undefined;
  if (sender === BeearlySender.BEEARLYBOT) {
    if (!env.BEEARLYBOT_WARPCAST_API_KEY) {
      logger.error(
        "No BEEARLYBOT_WARPCAST_API_KEY found, skipping direct cast send."
      );
      throw new Error("No BEEARLYBOT found.");
    }
    apiKey = env.BEEARLYBOT_WARPCAST_API_KEY;
  }

  if (apiKey === undefined) {
    logger.error("No API key found, skipping direct cast send.");
    throw new Error("No API key found.");
  }

  const {
    result: { success },
  } = await ky
    .put("https://api.warpcast.com/v2/ext-send-direct-cast", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      json: {
        recipientFid: recipient,
        message: text,
        idempotencyKey: uuidv4(),
      },
    })
    .json<{ result: { success: boolean } }>();

  if (!success) {
    logger.error(`error sending direct cast to ${recipient}.`);
  }
};
