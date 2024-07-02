import {
  MessageWithFarcasterIdBody,
  MessageWithRecipientBody,
} from "../schemas.js";
import { dcsQueue, processDC } from "./dcs.js";
import { xmtpQueue, processXMTPMessage } from "./xmtp.js";

const DCS_JOB_NAME = "create-dc";
const XMTP_JOB_NAME = "send-xmtp-message";

export const addToDCsQueue = async (data: MessageWithFarcasterIdBody) => {
  if (dcsQueue) {
    await dcsQueue.add(`${DCS_JOB_NAME}-${data.id}`, data, {
      attempts: 1,
      delay: 1000,
    });
    return;
  }
  await processDC({ data });
};

export const addToXMTPQueue = async (data: MessageWithRecipientBody) => {
  if (xmtpQueue) {
    await xmtpQueue.add(`${XMTP_JOB_NAME}-${data.id}`, data, {
      attempts: 1,
      delay: 1000,
    });
    return;
  }
  await processXMTPMessage({ data });
};
