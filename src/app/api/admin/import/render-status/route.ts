import { requireStaff } from "@/features/admin/lib/require-admin";
import { probeRenderBrowser } from "@/server/import/render/render-browser-probe";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

export async function GET() {
  return withApiHandler(async () => {
    await requireStaff();
    const status = await probeRenderBrowser({ testLaunch: true, force: true });
    return jsonData({
      nodeVersion: status.nodeVersion,
      renderFallbackEnabled: status.renderFallbackEnabled,
      playwrightPackageAvailable: status.playwrightPackageAvailable,
      browserExecutableAvailable: status.browserExecutableAvailable,
      browserLaunchable: status.browserLaunchable,
      failureCode: status.renderFallbackFailureCode,
      failureMessage: status.failureMessage,
      missingLibrary: status.missingLibrary,
    });
  });
}
