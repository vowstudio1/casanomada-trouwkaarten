#!/bin/bash
# Casa Nomada — Asset Download v2
mkdir -p public/assets/templates

echo "Downloaden template previews..."

curl -s -o public/assets/templates/bloom.jpg "https://sponsalia.app/assets/marketing/templates/bloom-en-vetrina-96e6b193.jpg" && echo "✓ bloom"
curl -s -o public/assets/templates/volta-celeste.jpg "https://sponsalia.app/assets/marketing/templates/volta-celeste-en-vetrina-63b82e9f.jpg" && echo "✓ volta-celeste"
curl -s -o public/assets/templates/zomertuin.jpg "https://sponsalia.app/assets/marketing/templates/giardino-destate-en-vetrina-e4c79ec8.jpg" && echo "✓ zomertuin"
curl -s -o public/assets/templates/villa-aurora.jpg "https://sponsalia.app/assets/marketing/templates/villa-aurora-en-vetrina-50b36ee0.jpg" && echo "✓ villa-aurora"
curl -s -o public/assets/templates/het-zwanenmeer.jpg "https://sponsalia.app/assets/marketing/templates/lago-dei-cigni-en-vetrina-6e0256ed.jpg" && echo "✓ het-zwanenmeer"
curl -s -o public/assets/templates/villa-cortina.jpg "https://sponsalia.app/assets/marketing/templates/villa-cortina-en-vetrina-553a7717.jpg" && echo "✓ villa-cortina"
curl -s -o public/assets/templates/minimale-couture.jpg "https://sponsalia.app/assets/marketing/templates/couture-minimale-en-vetrina-93e7c6cd.jpg" && echo "✓ minimale-couture"
curl -s -o public/assets/templates/betoverd-bos.jpg "https://sponsalia.app/assets/marketing/templates/incanto-nel-bosco-en-vetrina-6c056d35.jpg" && echo "✓ betoverd-bos"
curl -s -o public/assets/templates/riviera-70.jpg "https://sponsalia.app/assets/marketing/templates/riviera-70-en-vetrina-253c0193.jpg" && echo "✓ riviera-70"
curl -s -o public/assets/templates/italiaanse-aquarel.jpg "https://sponsalia.app/assets/marketing/templates/acquerello-italia-en-vetrina-3869b8cc.jpg" && echo "✓ italiaanse-aquarel"
curl -s -o public/assets/templates/oro-antico.jpg "https://sponsalia.app/assets/marketing/templates/oro-antico-en-vetrina-22d36ceb.jpg" && echo "✓ oro-antico"
curl -s -o public/assets/templates/tuscany-chic.jpg "https://sponsalia.app/assets/marketing/templates/tuscany-chic-en-vetrina-3646f639.jpg" && echo "✓ tuscany-chic"
curl -s -o public/assets/templates/gouden-uur.jpg "https://sponsalia.app/assets/marketing/templates/tipografico-moderno-en-vetrina-2c921489.jpg" && echo "✓ gouden-uur"
curl -s -o public/assets/templates/de-geheime-tuin.jpg "https://sponsalia.app/assets/marketing/templates/giardino-segreto-en-vetrina-c0e0298d.jpg" && echo "✓ de-geheime-tuin"
curl -s -o public/assets/templates/tratto-d-inchiostro.jpg "https://sponsalia.app/assets/marketing/templates/tratto-inchiostro-en-vetrina-48f6d0e0.jpg" && echo "✓ tratto-d-inchiostro"
curl -s -o public/assets/templates/idillio.jpg "https://sponsalia.app/assets/marketing/templates/idillio-en-vetrina-4806113a.jpg" && echo "✓ idillio"
curl -s -o public/assets/templates/romantisch-botanisch.jpg "https://sponsalia.app/assets/marketing/templates/botanico-romantico-en-vetrina-5a476f93.jpg" && echo "✓ romantisch-botanisch"
curl -s -o public/assets/templates/strawberry-matcha.jpg "https://sponsalia.app/assets/marketing/templates/strawberry-matcha-en-vetrina-4c490953.jpg" && echo "✓ strawberry-matcha"
curl -s -o public/assets/templates/toile-de-jouy.jpg "https://sponsalia.app/assets/marketing/templates/toile-bleu-en-vetrina-a0fc5d6a.jpg" && echo "✓ toile-de-jouy"

echo ""
echo "Klaar! Check hoeveel bestanden:"
ls public/assets/templates/*.jpg | wc -l
