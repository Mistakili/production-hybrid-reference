#!/usr/bin/env bash
# Restore canonical AppDelegate.swift after npx cap sync
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/recipes/appdelegate/AppDelegate.swift"
TARGET="$ROOT/apps/mobile/ios/App/App/AppDelegate.swift"

if [ ! -f "$SOURCE" ]; then
  echo "Error: canonical AppDelegate not found at $SOURCE"
  exit 1
fi

if [ ! -d "$(dirname "$TARGET")" ]; then
  echo "Warning: iOS project not found at $TARGET"
  echo "Run 'npx cap add ios' in apps/mobile first, or copy manually:"
  echo "  cp $SOURCE ios/App/App/AppDelegate.swift"
  exit 0
fi

cp "$SOURCE" "$TARGET"
echo "Restored AppDelegate.swift → $TARGET"