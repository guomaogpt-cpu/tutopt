import { sanitizePushPath } from "@/lib/push/push-path";
import { logger } from "@/shared/lib/logger";

export type PushPayload = {
  title: string;
  body: string;
  url: string;
  notificationId?: string;
  type?: string;
};

export type PushSendResult = {
  sent: number;
  failed: number;
  skipped: boolean;
  invalidTokens: string[];
};

type FirebaseCredentials = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

function getFirebaseCredentials(): FirebaseCredentials | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function signJwt(credentials: FirebaseCredentials): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: credentials.clientEmail,
      sub: credentials.clientEmail,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
    }),
  );

  const unsigned = `${header}.${payload}`;
  const crypto = await import("crypto");
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.privateKey);
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

async function getAccessToken(credentials: FirebaseCredentials): Promise<string | null> {
  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60_000) {
    return cachedAccessToken.token;
  }

  try {
    const assertion = await signJwt(credentials);
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });

    if (!response.ok) {
      logger.warn("FCM OAuth token request failed", { status: response.status });
      return null;
    }

    const data = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) {
      return null;
    }

    cachedAccessToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in ?? 3600) * 1000,
    };

    return data.access_token;
  } catch (error) {
    logger.warn("FCM OAuth token error", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}

async function sendToFcmToken(
  accessToken: string,
  projectId: string,
  token: string,
  payload: PushPayload,
): Promise<boolean> {
  const url = sanitizePushPath(payload.url);
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: {
            url,
            ...(payload.notificationId ? { notificationId: payload.notificationId } : {}),
            ...(payload.type ? { type: payload.type } : {}),
          },
          android: {
            priority: "HIGH",
            notification: {
              clickAction: "FCM_PLUGIN_ACTIVITY",
            },
          },
        },
      }),
    },
  );

  if (response.ok) {
    return true;
  }

  const body = await response.text();
  logger.warn("FCM send failed", {
    status: response.status,
    tokenPrefix: token.slice(0, 12),
    body: body.slice(0, 200),
  });

  return false;
}

export async function sendPushToTokens(
  tokens: string[],
  payload: PushPayload,
): Promise<PushSendResult> {
  if (tokens.length === 0) {
    return { sent: 0, failed: 0, skipped: true, invalidTokens: [] };
  }

  const credentials = getFirebaseCredentials();
  if (!credentials) {
    return { sent: 0, failed: 0, skipped: true, invalidTokens: [] };
  }

  const accessToken = await getAccessToken(credentials);
  if (!accessToken) {
    return { sent: 0, failed: tokens.length, skipped: false, invalidTokens: [] };
  }

  let sent = 0;
  let failed = 0;
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    const ok = await sendToFcmToken(accessToken, credentials.projectId, token, payload);
    if (ok) {
      sent += 1;
    } else {
      failed += 1;
      invalidTokens.push(token);
    }
  }

  return { sent, failed, skipped: false, invalidTokens };
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<PushSendResult> {
  const { getEnabledPushTokensForUser } = await import(
    "@/features/push/lib/push-token-data"
  );
  const tokens = await getEnabledPushTokensForUser(userId);
  return sendPushToTokens(
    tokens.map((entry) => entry.token),
    payload,
  );
}
