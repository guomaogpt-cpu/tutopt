import { sendPhoneOtp } from "@/features/auth/lib/phone-otp";
import { otpSendSchema } from "@/features/auth/validators/auth.validators";
import { getEnv } from "@/shared/config/env";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, otpSendSchema);
    const result = await sendPhoneOtp(input.phone);
    const isProduction = getEnv().NODE_ENV === "production";

    return jsonData({
      message: "Код отправлен",
      phone: result.phone,
      expiresInSeconds: result.expiresInSeconds,
      resendAvailableInSeconds: result.resendAvailableInSeconds,
      ...(!isProduction && result.devOtpCode ? { devOtpCode: result.devOtpCode } : {}),
    });
  });
}
