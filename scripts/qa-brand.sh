#!/usr/bin/env bash
# Static QA for the Deckers brand mark across production pages.
# Catches the regression class found during the 2026-05-16 rebrand QA.
# Run from repo root. Exits non-zero on any failure.

set -u
cd "$(dirname "$0")/.."

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
dim()   { printf '\033[2m%s\033[0m\n' "$*"; }

fails=0
fail() { red "  FAIL: $*"; fails=$((fails+1)); }
pass() { green "  ok: $*"; }

# Production pages that must carry the brand mark consistently.
# (Excludes design sandboxes: deckers-mockup, roof-options, rebrand-finalists,
#  brand-mockups*, brand-preview, dashboard-options, *.backup.)
PROD_PAGES=(
  404.html
  offline.html
  reset-password.html
  roofrank-analyst.html
  roofrank-analyzer.html
  roofrank-dashboard.html
  roofrank-deal-detail.html
  roofrank-landing.html
  roofrank-login.html
  roofrank-onboarding.html
  roofrank-pricing.html
  roofrank-reports.html
  roofrank-watchlist.html
)

# Surfaces where the score-context Deckers mark is rendered (tier-shifting).
SCORE_SURFACES=(
  roofrank-dashboard.html
  roofrank-watchlist.html
  roofrank-deal-detail.html
)

echo "== brand QA =="

# ── Check 1: no orphan old-mark class names on production pages ──────────────
# These class names belonged to the pre-Deckers vertical-bar score viz.
# If they reappear, the rebrand missed a render path.
echo
echo "[1] no orphan old-mark classes on production pages"
ORPHAN_CLASSES=(cr-bar sxm-bar hrm-bar)
for page in "${PROD_PAGES[@]}"; do
  for cls in "${ORPHAN_CLASSES[@]}"; do
    if grep -q "$cls" "$page" 2>/dev/null; then
      fail "$page contains orphan class \`$cls\` (old vertical-bar viz)"
    fi
  done
done
# rm-bar is reused by the analyzer for metric progress bars (unrelated).
# Only flag it inside an SVG rect — the old score-mark signature.
for page in "${PROD_PAGES[@]}"; do
  if grep -qE '<rect[^>]*class="rm-bar' "$page" 2>/dev/null; then
    fail "$page contains \`<rect class=\"rm-bar\"\` (old score-mark SVG)"
  fi
done
[ $fails -eq 0 ] && pass "all production pages free of orphan score-mark classes"

# ── Check 2: nav-mark roof stroke-width is 2.2 on every production page ──────
echo
echo "[2] nav-mark stroke-width=\"2.2\" on every production page"
prev=$fails
for page in "${PROD_PAGES[@]}"; do
  # The roof path signature is unique to the brand mark.
  while IFS= read -r line; do
    if ! echo "$line" | grep -qE 'stroke-width="2\.2"'; then
      width=$(echo "$line" | grep -oE 'stroke-width="[^"]+"' | head -1)
      fail "$page has a roof path with $width (expected stroke-width=\"2.2\")"
    fi
  done < <(grep -E 'd="M5 12 L15 6 L25 12"' "$page" 2>/dev/null)
done
[ $fails -eq $prev ] && pass "all 13 pages use stroke-width=\"2.2\""

# ── Check 3: .pas score number color is --muted on every score surface ───────
# Cosmetic but easy to drift on — keeps Pass tier looking the same across
# dashboard / watchlist / deal-detail.
echo
echo "[3] Pass-tier score number color uses var(--muted)"
prev=$fails
for page in "${SCORE_SURFACES[@]}"; do
  # Match the .pas number rule; tolerate spacing variations.
  if grep -qE '\.(rmark|hero-rmark)\.pas[[:space:]]+\.(rmark|hero-rmark)-num\{color:var\(--faint\)' "$page" 2>/dev/null; then
    fail "$page Pass-tier number color is var(--faint) (expected var(--muted))"
  fi
done
[ $fails -eq $prev ] && pass "Pass-tier number color consistent across score surfaces"

# ── Check 4: canonical Deckers SVG geometry on every score surface ───────────
# Every score-context mark (.rmark / .hero-rmark / .c-ring / .sx-h-score) must
# render the canonical shape: one roof path + three floor rects.
echo
echo "[4] score surfaces render the canonical Deckers shape"
prev=$fails
EXPECTED_ROOF='<path class="mk-roof" d="M5 17 L20 7 L35 17"/>'
for page in "${SCORE_SURFACES[@]}"; do
  if ! grep -qF "$EXPECTED_ROOF" "$page" 2>/dev/null; then
    fail "$page missing canonical roof path (\`$EXPECTED_ROOF\`)"
  fi
done
[ $fails -eq $prev ] && pass "canonical roof path present on every score surface"

# ── Summary ─────────────────────────────────────────────────────────────────
echo
if [ $fails -eq 0 ]; then
  green "== brand QA: all checks passed =="
  exit 0
else
  red "== brand QA: $fails failure(s) =="
  exit 1
fi
