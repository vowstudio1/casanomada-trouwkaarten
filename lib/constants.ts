export const SITE_NAME = "Casa Nomada Digital";
export const SITE_TAGLINE = "Digitale uitnodigingen & tafelkaarten";
export const SITE_DESCRIPTION =
  "Luxe digitale trouwkaarten met RSVP, AI-tafelindeling en gastenboek. Eén betaling, geen abonnement.";

export const TEMPLATES = [
  { id: "volta-celeste", name: "Volta Celeste", description: "Geschilderde lucht en wit rankwerk, stoffen strik.", color: "#7b9cc0" },
  { id: "strawberry-matcha", name: "Strawberry Matcha", description: "Fris en speels, matcha en aardbei.", color: "#8ba67a" },
  { id: "tratto-inchiostro", name: "Tratto d'Inchiostro", description: "Penlijnen op papier, één enkele inkt.", color: "#4a4a4a" },
  { id: "toile-de-jouy", name: "Toile de Jouy", description: "Toile in vier tinten op crème papier.", color: "#6b7b5e" },
  { id: "idillio", name: "Idillio", description: "Gouden strik en zwanen, alles licht.", color: "#c9a96e" },
  { id: "villa-cortina", name: "Villa Cortina", description: "Het gordijn opent de zaal, kant en kristal.", color: "#d4a5a5" },
  { id: "romantisch-botanisch", name: "Romantisch Botanisch", description: "Bladeren en bloemen, delicaat.", color: "#7ba07b" },
  { id: "tuscany-chic", name: "Tuscany Chic", description: "Warm en verfijnd, en plein air.", color: "#c4956a" },
  { id: "geheime-tuin", name: "De Geheime Tuin", description: "Rozenboog en Italiaanse tuin.", color: "#a5c4a5" },
  { id: "betoverd-bos", name: "Betoverd Bos", description: "Geschilderd bos en wilde rozen.", color: "#5e7b5e" },
  { id: "zomertuin", name: "Zomertuin", description: "Groene tuin en een cartouche van roze kant.", color: "#8bb08b" },
  { id: "zwanenmeer", name: "Het Zwanenmeer", description: "Romantisch en luchtig, zachte tinten.", color: "#b8c4d4" },
  { id: "riviera-70", name: "Riviera 70", description: "Zonnig en vintage, jaren 70-sfeer.", color: "#e8a050" },
  { id: "gouden-uur", name: "Gouden Uur", description: "Warm avondlicht, romantisch en intiem.", color: "#d4a060" },
  { id: "italiaanse-aquarel", name: "Italiaanse Aquarel", description: "Majolica en kust in aquarel.", color: "#5b8cb8" },
  { id: "minimale-couture", name: "Minimale Couture", description: "Essentieel, ruimte en adem.", color: "#e8e0d8" },
  { id: "oro-antico", name: "Oro Antico", description: "Beige en oud goud, bloemrijk en elegant.", color: "#b8a070" },
  { id: "villa-aurora", name: "Villa Aurora", description: "Terras bij zonsondergang, tijdloze luxe.", color: "#c87858" },
];

export const PRICING_PLANS = [
  {
    id: "collectie",
    name: "Collectie",
    price: 89,
    recommended: true,
    features: [
      "Kleuren, lettertypes en jullie foto: alles aanpasbaar",
      "Een persoonlijke link per groep, of één open link",
      "Alle beschikbare sjablonen",
      "Gecentraliseerde RSVP's in realtime",
      "Elke gast in zijn eigen taal",
      "Afgewerkte uitnodiging vóór betaling",
      "Muziek: onze selectie of jullie eigen nummer",
      "Tot 2 momenten (bijv. ceremonie en receptie)",
    ],
  },
  {
    id: "destination",
    name: "Destination Wedding",
    price: 149,
    recommended: false,
    features: [
      "Alles uit de Collectie",
      "Onbeperkt dagen: welkomstdiner, bruiloft, brunch",
      "Per dag andere gasten: ieder ziet alleen de zijne",
      "'Waar te slapen': hotels met foto's en boekingslink",
    ],
  },
  {
    id: "op-maat",
    name: "Op maat",
    price: 249,
    recommended: false,
    features: [
      "Alles uit de Collectie",
      "Een ontwerp speciaal voor jullie bruiloft",
      "Jullie ideeën: kleuren, bloemen, locatietekening",
      "Vier correctierondes, klaar in 7 werkdagen",
      "Publiceer terwijl we ontwerpen",
      "Begeleiding van briefing tot oplevering",
    ],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Wanneer betaal ik? Kan ik de uitnodiging eerst zien?",
    answer: "Je kunt je uitnodiging helemaal gratis maken en bekijken. Je betaalt pas wanneer je tevreden bent en klaar bent om te publiceren. Geen verrassingen.",
  },
  {
    question: "Wat kost het? Zijn er abonnementen?",
    answer: "Eén eenmalige betaling vanaf €89. Geen abonnementen, geen verborgen kosten, geen verlengingen. Wat je betaalt is wat je krijgt.",
  },
  {
    question: "Hoe lang duurt het voordat hij klaar is?",
    answer: "De meeste uitnodigingen zijn binnen een paar minuten klaar. Kies een sjabloon, vul je gegevens in, en publiceer. Voor het Op Maat-pakket rekenen we 7 werkdagen.",
  },
  {
    question: "Kunnen gasten hun aanwezigheid bevestigen (RSVP)?",
    answer: "Ja! Elke gast kan direct via de uitnodiging reageren. Aanwezigheid, intoleranties, menukeuzes — alles komt automatisch in je dashboard terecht.",
  },
  {
    question: "Heb ik technische kennis nodig?",
    answer: "Helemaal niet. Als je een formulier kunt invullen, kun je je uitnodiging maken. Wij regelen de rest.",
  },
  {
    question: "In welke talen kan de uitnodiging zijn?",
    answer: "De uitnodiging past zich automatisch aan de taal van wie hem opent. We ondersteunen 15 talen, waaronder Nederlands, Engels, Frans, Duits, Italiaans en Spaans.",
  },
  {
    question: "Hoe stuur ik de uitnodigingen naar mijn gasten?",
    answer: "Je krijgt een persoonlijke link per gast (of groep). Deel die via WhatsApp, Instagram, e-mail of waar je maar wilt.",
  },
  {
    question: "Kan ik verschillende momenten voor verschillende gasten instellen?",
    answer: "Ja. Met het Collectie-pakket kun je tot 2 momenten instellen. Met Destination Wedding is dat onbeperkt — elke gast ziet alleen de momenten waarvoor hij is uitgenodigd.",
  },
];
