import { verifyPhoneOtp } from "@/features/auth/lib/phone-otp";
import { otpVerifySchema } from "@/features/auth/validators/auth.validators";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertOtpVerifyRateLimits } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, otpVerifySchema);
    const ip = getClientIpFromRequest(request);
    assertOtpVerifyRateLimits(input.phone, ip);

    const result = await verifyPhoneOtp(input.phone, input.code);
    return jsonData({
      message: "Телефон подтверждён",
      phone: result.phone,
      phoneVerificationToken: result.phoneVerificationToken,
    });
  });
}
