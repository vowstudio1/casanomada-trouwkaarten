#!/bin/bash
# Casa Nomada — Sponsalia Asset Download Script
# Uitvoeren vanuit je terminal: bash download-sponsalia-assets.sh
# Assets worden opgeslagen in: ./public/assets/templates/

mkdir -p public/assets/templates
mkdir -p public/assets/buste

echo "Downloaden template previews..."

declare -A TEMPLATES=(
  ["bloom"]="bloom-en-vetrina-96e6b193.jpg"
  ["volta-celeste"]="volta-celeste-en-vetrina-63b82e9f.jpg"
  ["zomertuin"]="giardino-destate-en-vetrina-e4c79ec8.jpg"
  ["villa-aurora"]="villa-aurora-en-vetrina-50b36ee0.jpg"
  ["het-zwanenmeer"]="lago-dei-cigni-en-vetrina-6e0256ed.jpg"
  ["villa-cortina"]="villa-cortina-en-vetrina-553a7717.jpg"
  ["minimale-couture"]="couture-minimale-en-vetrina-93e7c6cd.jpg"
  ["betoverd-bos"]="incanto-nel-bosco-en-vetrina-6c056d35.jpg"
  ["riviera-70"]="riviera-70-en-vetrina-253c0193.jpg"
  ["italiaanse-aquarel"]="acquerello-italia-en-vetrina-3869b8cc.jpg"
  ["oro-antico"]="oro-antico-en-vetrina-22d36ceb.jpg"
  ["tuscany-chic"]="tuscany-chic-en-vetrina-3646f639.jpg"
  ["gouden-uur"]="tipografico-moderno-en-vetrina-2c921489.jpg"
  ["de-geheime-tuin"]="giardino-segreto-en-vetrina-c0e0298d.jpg"
  ["tratto-d-inchiostro"]="tratto-inchiostro-en-vetrina-48f6d0e0.jpg"
  ["idillio"]="idillio-en-vetrina-4806113a.jpg"
  ["romantisch-botanisch"]="botanico-romantico-en-vetrina-5a476f93.jpg"
  ["strawberry-matcha"]="strawberry-matcha-en-vetrina-4c490953.jpg"
  ["toile-de-jouy"]="toile-bleu-en-vetrina-a0fc5d6a.jpg"
)

for slug in "${!TEMPLATES[@]}"; do
  filename="${TEMPLATES[$slug]}"
  url="https://sponsalia.app/assets/marketing/templates/$filename"
  out="public/assets/templates/${slug}.jpg"
  echo "  → $slug"
  curl -s -o "$out" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
    -H "Referer: https://sponsalia.app/" \
    "$url"
done

echo ""
echo "Downloaden envelop assets..."

BUSTEN=(
  "avorio-rosa.webp"
  "fiocco-bianco.webp"
  "avorio-verde.webp"
  "fiocco-celeste.webp"
  "fiocco-oro.webp"
  "avorio-marrone.webp"
  "rossa.webp"
  "oro.webp"
  "argento.webp"
  "semplice-rossa.webp"
  "semplice-oro.webp"
  "semplice-argento.webp"
)

for busta in "${BUSTEN[@]}"; do
  echo "  → $busta"
  curl -s -o "public/assets/buste/$busta" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
    -H "Referer: https://sponsalia.app/" \
    "https://sponsalia.app/assets/invite/buste/$busta"
done

echo ""
echo "✅ Klaar! Check public/assets/ voor de bestanden."
echo "   Upload ze daarna naar Supabase Storage bucket 'assets'"
