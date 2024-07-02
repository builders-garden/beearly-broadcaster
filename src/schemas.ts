import z from "zod";

export enum BeearlySender {
  BEEARLYBOT = "beearlybot",
}

export enum ChannelService {
  FarcasterDC = "farcaster-dc",
  XMTP = "xmtp",
}

export const simpleCastSchema = z.object({
  text: z.string().min(1),
  id: z.string().min(1),
});

export type SimpleCastBody = z.infer<typeof simpleCastSchema>;

export const replySchema = z.object({
  text: z.string().min(1),
  id: z.string().min(1),
  replyTo: z.string().min(1),
});

export type ReplyBody = z.infer<typeof replySchema>;

export const messageWithRecipientSchema = z.object({
  text: z.string().min(1),
  id: z.string().min(1),
  recipient: z.string().min(1),
  sender: z.optional(z.nativeEnum(BeearlySender)),
});

export type MessageWithRecipientBody = z.infer<
  typeof messageWithRecipientSchema
>;

export const messageWithFarcasterIdSchema = z.object({
  text: z.string().min(1),
  id: z.string().min(1),
  farcasterId: z.number(),
  sender: z.optional(z.string()),
});

export type MessageWithFarcasterIdBody = z.infer<
  typeof messageWithFarcasterIdSchema
>;

export const messageSchema = z.object({
  text: z.string().min(1),
  sender: z.nativeEnum(BeearlySender),
  receiver: z.union([z.string().min(1), z.number()]),
  channels: z.array(z.nativeEnum(ChannelService)),
});

export type MessageBody = z.infer<typeof messageSchema>;

export const subscriberSchema = z.object({
  channel: z.nativeEnum(ChannelService),
  fid: z.optional(z.number().int()),
  address: z.optional(z.string()),
  sender: z.nativeEnum(BeearlySender),
});

export type SubscriberParams = z.infer<typeof subscriberSchema>;
