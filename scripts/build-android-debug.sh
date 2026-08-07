#!/usr/bin/env bash
# Builds a debug APK for local phone testing.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Checking prerequisites..."
bash "$ROOT/scripts/check-android-prerequisites.sh"

echo ""
echo "Syncing Capacitor..."
npm run cap:sync

echo ""
echo "Building debug APK..."
cd "$ROOT/android"
./gradlew assembleDebug --no-daemon

APK="$ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
if [[ -f "$APK" ]]; then
  echo ""
  echo "Debug APK ready:"
  echo "  ${APK}"
  ls -lh "$APK"
else
  echo "Build finished but APK not found at expected path." >&2
  find "$ROOT/android/app/build/outputs" -name "*.apk" 2>/dev/null || true
  exit 1
fi
