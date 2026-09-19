#!/usr/bin/env bash
set -euo pipefail

TARGET="public/assets/templates/bloom"
mkdir -p "$TARGET"

echo "Downloading Casa Nomada Bloom assets..."

curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/avorio_rosa-poster.jpg" -o "$TARGET/avorio_rosa-poster.jpg"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-cartoncino-body.webp" -o "$TARGET/bl-cartoncino-body.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-fascia-righe-ink.webp" -o "$TARGET/bl-fascia-righe-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-cartoncino-line.webp" -o "$TARGET/bl-cartoncino-line.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-data-cornice-ink.webp" -o "$TARGET/bl-data-cornice-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-data-cornice-leaf.webp" -o "$TARGET/bl-data-cornice-leaf.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-fiocco-ink.webp" -o "$TARGET/bl-fiocco-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-fiocco-lungo-ink.webp" -o "$TARGET/bl-fiocco-lungo-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-colomba-ink.webp" -o "$TARGET/bl-colomba-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-hero-pieno-ink.webp" -o "$TARGET/bl-hero-pieno-ink.webp"
curl -L --fail --retry 3 --retry-delay 2 "https://sponsalia.app/assets/invite/bl-hero-pieno-leaf.webp" -o "$TARGET/bl-hero-pieno-leaf.webp"

cat > "$TARGET/bl-wave.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 6" preserveAspectRatio="none">
  <path d="M2 4 C 40 1 80 5 120 3 C 160 1 195 4 218 2"
        fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"/>
</svg>
SVG

echo ""
echo "✓ Bloom assets downloaded to $TARGET"
echo "✓ bl-wave.svg created"
echo ""
ls -lh "$TARGET"
