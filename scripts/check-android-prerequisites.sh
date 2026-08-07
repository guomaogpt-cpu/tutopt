#!/usr/bin/env bash
# Checks local prerequisites for Android debug APK build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

missing=()

check_java() {
  if [[ -n "${JAVA_HOME:-}" && -x "${JAVA_HOME}/bin/java" ]]; then
    echo "JDK: ok (${JAVA_HOME})"
    return 0
  fi

  for candidate in \
    "/opt/homebrew/opt/openjdk@17" \
    "/usr/local/opt/openjdk@17" \
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home"; do
    if [[ -x "${candidate}/bin/java" ]]; then
      export JAVA_HOME="$candidate"
      echo "JDK: ok (${JAVA_HOME})"
      return 0
    fi
  done

  if command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then
    echo "JDK: ok ($(command -v java))"
    return 0
  fi

  missing+=("JDK 17+ (Android Studio JBR or brew install openjdk@17)")
  echo "JDK: missing"
  return 1
}

check_android_sdk() {
  local sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"

  if [[ -z "$sdk" && -d "$HOME/Library/Android/sdk" ]]; then
    sdk="$HOME/Library/Android/sdk"
    export ANDROID_HOME="$sdk"
    export ANDROID_SDK_ROOT="$sdk"
  fi

  if [[ -z "$sdk" || ! -d "$sdk" ]]; then
    missing+=("Android SDK (install Android Studio or command-line tools)")
    echo "Android SDK: missing"
    return 1
  fi

  if [[ ! -d "$sdk/platform-tools" ]]; then
    missing+=("Android SDK platform-tools")
    echo "Android SDK platform-tools: missing"
    return 1
  fi

  echo "Android SDK: ok (${sdk})"
  return 0
}

check_capacitor() {
  if [[ ! -d "$ROOT/android" ]]; then
    missing+=("Capacitor android project (run: npm run cap:sync)")
    echo "Capacitor android/: missing"
    return 1
  fi

  echo "Capacitor android/: ok"
  return 0
}

check_java || true
check_android_sdk || true
check_capacitor || true

if ((${#missing[@]} > 0)); then
  echo ""
  echo "Missing prerequisites:"
  for item in "${missing[@]}"; do
    echo "  - ${item}"
  done
  echo ""
  echo "See docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md for setup."
  exit 1
fi

echo ""
echo "All Android build prerequisites are ready."
