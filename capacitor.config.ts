import type { CapacitorConfig } from "@capacitor/cli";

const PRODUCTION_URL = "https://tutopt-production.up.railway.app";

const config: CapacitorConfig = {
  appId: "kg.vsetut.app",
  appName: "ВсеТут",
  webDir: "mobile-shell",
  server: {
    url: PRODUCTION_URL,
    cleartext: false,
    androidScheme: "https",
    allowNavigation: ["tutopt-production.up.railway.app", "*.up.railway.app"],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
