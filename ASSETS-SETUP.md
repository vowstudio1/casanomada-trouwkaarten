# Asset Setup — Casa Nomada

## Achtergrond
Alle Sponsalia assets zijn gelicenseerd via toestemmingsverklaring (5 sept 2026, Stefano Frediani).

## Assets downloaden

Voer dit eenmalig uit in je terminal vanuit de projectmap:

```bash
bash download-assets.sh
```

Dit download naar:
- `public/assets/templates/` — 19 template preview afbeeldingen
- `public/assets/buste/` — 12 envelop/lint afbeeldingen

## Na het downloaden

```bash
git add public/assets/
git commit -m "feat: add Sponsalia assets (licensed)"
git push ...
```

## Hoe de fallback werkt

Zolang de lokale bestanden er niet zijn, laadt de site automatisch
de afbeeldingen direct van sponsalia.app. Zodra de bestanden in
`public/assets/` staan, gebruikt de site die in plaats daarvan.

## Supabase Storage (optioneel)

Voor betere CDN-performance kun je de assets ook uploaden naar
Supabase Storage bucket `assets` en de URLs aanpassen in
`lib/templates.ts` (de `BASE_LOCAL` constante).
