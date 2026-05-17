#!/usr/bin/env bash
# Regenerate PNG variants of brand SVGs.
# Sources of truth are SVGs; PNGs are derived. Re-run after editing
# og-image.svg or icons/icon.svg so PNG copies stay in sync.
#
# Requires: macOS (uses sips + headless Chrome). No other dependencies.
#
# Run from repo root: ./scripts/regen-images.sh

set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "ERROR: Google Chrome not found at $CHROME" >&2
  exit 1
fi

shoot() {
  local src=$1 out=$2 w=$3 h=$4
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --default-background-color=00000000 --window-size="$w","$h" \
    --screenshot="$out" "file://$(pwd)/$src" 2>/dev/null
}

echo "== OG image (1200x630) =="
shoot og-image.svg og-image.png 1200 630
echo "  ✓ og-image.png"

echo
echo "== Favicon (512x512 + downscaled variants) =="
# Render at 512 via an HTML wrapper so the SVG scales to viewport.
# (Rendering small sizes directly leaves the viewport cropped to the
# SVG's natural top-left corner — empty image.)
WRAP=$(mktemp -t icon-wrap).html
cat > "$WRAP" <<EOF
<!DOCTYPE html><html><head><style>
html,body{margin:0;padding:0;background:transparent}
img{width:100vw;height:100vh;display:block}
</style></head><body>
<img src="file://$(pwd)/icons/icon.svg">
</body></html>
EOF
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --default-background-color=00000000 --window-size=512,512 \
  --screenshot=icons/icon-512.png "file://$WRAP" 2>/dev/null
rm -f "$WRAP"
echo "  ✓ icon-512.png"

# Downscale 512 → 192, 180, 32 (sips renders the small sizes sharper
# than headless Chrome at small viewports).
sips -z 192 192 icons/icon-512.png --out icons/icon-192.png >/dev/null
echo "  ✓ icon-192.png"
sips -z 180 180 icons/icon-512.png --out icons/icon-180.png >/dev/null
echo "  ✓ icon-180.png"
sips -z 32 32 icons/icon-512.png --out icons/icon-32.png >/dev/null
echo "  ✓ icon-32.png"

echo
echo "== Done. Don't forget to commit ==
$(ls -1 og-image.png icons/*.png)"
