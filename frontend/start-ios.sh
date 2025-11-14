#!/bin/bash
# Boot first available iPhone simulator
SIM_UDID=$(xcrun simctl list devices available | grep "iPhone" | head -1 | cut -d'(' -f2 | cut -d')' -f1 | tr -d ' ')
if [ -n "$SIM_UDID" ]; then
  echo "Booting first iPhone: $SIM_UDID"
  xcrun simctl boot "$SIM_UDID"
  sleep 5  # Wait for boot
fi
npx expo start --ios