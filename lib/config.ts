export const PACKAGES = {
  collection: {
    id: 'collection',
    name: 'Collection',
    price: 89,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_COLLECTION || '',
    features: [
      'Complete digitale trouwkaart',
      'Onbeperkt gasten',
      'RSVP systeem',
      'Fotoalbum',
      'Gastenberichten',
      'Unieke links per gast',
      '17 talen',
      'Dashboard',
      'QR codes',
    ],
    maxGuests: 500,
    maxPhotos: 500,
    maxEvents: 5,
  },
  destination: {
    id: 'destination',
    name: 'Destination',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DESTINATION || '',
    features: [
      'Alles uit Collection',
      'Meerdere bruiloftsdagen',
      'Hotel module',
      'Reisinfo per gast',
      'Transfer planning',
      'Onbeperkt events',
      'Gepersonaliseerd reisschema',
    ],
    maxGuests: 500,
    maxPhotos: 1000,
    maxEvents: 20,
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    price: 249,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CUSTOM || '',
    features: [
      'Alles uit Destination',
      'Custom ontwerp',
      'Prioriteit support',
      'Onbeperkte opslag',
      'White label optie',
    ],
    maxGuests: -1,
    maxPhotos: -1,
    maxEvents: -1,
  },
} as const;

export const LANGUAGES = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://casanomada-trouwkaarten.netlify.app';

export const FONTS = [
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'serif' },
  { id: 'playfair', name: 'Playfair Display', category: 'serif' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'serif' },
  { id: 'roboto', name: 'Roboto', category: 'sans-serif' },
  { id: 'lato', name: 'Lato', category: 'sans-serif' },
];

export const GUEST_GROUPS = [
  'Familie bruid',
  'Familie bruidegom',
  'Vrienden',
  'Collega\'s',
  'Kinderen',
  'VIP',
  'Overig',
];
