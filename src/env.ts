import * as dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .trim()
    .default("3000")
    .transform((v) => parseInt(v)),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z
    .string()
    .transform((val) => (val ? parseInt(val) : undefined))
    .optional(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  WEBHOOK_KEY: z.string().trim().min(1),
  XMTP_ENV: z.enum(["production", "dev"]).default("dev"),
  // BEEARLYBOT
  BEEARLYBOT_WARPCAST_API_KEY: z.string(),
  BEEARLYBOT_FARCASTER_FID: z
    .string()
    .transform((val) => (val ? parseInt(val) : undefined)),
  BEEARLYBOT_XMTP_PRIVATE_KEY: z.string().trim().min(1),
  BEEARLY_API_KEY: z.string().trim().min(1),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error(
    `An error has occurred while parsing environment variables:${error.errors.map(
      (e) => ` ${e.path.join(".")} is ${e.message}`
    )}`
  );
  process.exit(1);
}

export type EnvSchemaType = z.infer<typeof envSchema>;
export const env = data;
