import { sendPhoneOtp } from "@/features/auth/lib/phone-otp";
import { otpSendSchema } from "@/features/auth/validators/auth.validators";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertOtpSendRateLimits } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, otpSendSchema);
    const ip = getClientIpFromRequest(request);
    assertOtpSendRateLimits(input.phone, ip);

    const result = await sendPhoneOtp(input.phone);

    return jsonData({
      message: "Код отправлен",
      phone: result.phone,
      expiresInSeconds: result.expiresInSeconds,
      resendAvailableInSeconds: result.resendAvailableInSeconds,
      ...(result.devOtpCode ? { devOtpCode: result.devOtpCode } : {}),
      ...(result.demoMode ? { demoMode: true } : {}),
    });
  });
}
