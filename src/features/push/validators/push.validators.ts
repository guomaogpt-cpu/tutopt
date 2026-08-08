import { PushPlatform } from "@prisma/client";
import { z } from "zod";

export const pushRegisterSchema = z.object({
  token: z.string().trim().min(20).max(512),
  platform: z.nativeEnum(PushPlatform).default(PushPlatform.ANDROID),
  deviceId: z.string().trim().max(200).optional().nullable(),
  appVersion: z.string().trim().max(50).optional().nullable(),
});

export const pushUnregisterSchema = z.object({
  token: z.string().trim().min(20).max(512).optional().nullable(),
});
