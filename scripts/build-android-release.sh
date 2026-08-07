#!/usr/bin/env bash
# Builds a release AAB for Google Play (local signing required).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

KEY_PROPERTIES="$ROOT/android/key.properties"
AAB="$ROOT/android/app/build/outputs/bundle/release/app-release.aab"

echo "Checking prerequisites..."
bash "$ROOT/scripts/check-android-prerequisites.sh"

if [[ ! -f "$KEY_PROPERTIES" ]]; then
  echo ""
  echo "Release signing is not configured."
  echo "  1. Create a keystore locally (see docs/ANDROID_RELEASE_AAB_PHASE_113.md)"
  echo "  2. Copy android/key.properties.example to android/key.properties"
  echo "  3. Fill in storeFile, storePassword, keyAlias, keyPassword"
  echo ""
  echo "Keystore and key.properties must stay outside git."
  exit 1
fi

echo ""
echo "Syncing Capacitor..."
npm run cap:sync

echo ""
echo "Building release AAB..."
cd "$ROOT/android"
./gradlew bundleRelease --no-daemon

if [[ -f "$AAB" ]]; then
  echo ""
  echo "Release AAB ready:"
  echo "  ${AAB}"
  ls -lh "$AAB"
else
  echo "Build finished but AAB not found at expected path." >&2
  find "$ROOT/android/app/build/outputs" -name "*.aab" 2>/dev/null || true
  exit 1
fi
