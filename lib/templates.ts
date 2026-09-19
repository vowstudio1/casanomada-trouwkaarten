export type TemplateColor = { name: string; label: string };
export type TemplateEnvelop = { label: string; img: string };

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  img: string;
  envelops: TemplateEnvelop[];
  colors: TemplateColor[];
  music: string[];
  faq: { q: string; a: string }[];
  price: string;
  openingStyle: "bow" | "trifold" | "curtain" | "wave" | "floral" | "fold";
};

// Gebruik lokale assets als die beschikbaar zijn, anders Sponsalia directe URL
const BASE_LOCAL = "/assets/templates/";
const BASE_SPONSALIA = "https://sponsalia.app/assets/marketing/templates/";
const BUSTE_LOCAL = "/assets/buste/";
const BUSTE_SPONSALIA = "https://sponsalia.app/assets/invite/buste/";

// Mapt slug → originele Sponsalia bestandsnaam
const TEMPLATE_FILES: Record<string, string> = {
  "bloom": "bloom-en-vetrina-96e6b193.jpg",
  "volta-celeste": "volta-celeste-en-vetrina-63b82e9f.jpg",
  "zomertuin": "giardino-destate-en-vetrina-e4c79ec8.jpg",
  "villa-aurora": "villa-aurora-en-vetrina-50b36ee0.jpg",
  "het-zwanenmeer": "lago-dei-cigni-en-vetrina-6e0256ed.jpg",
  "villa-cortina": "villa-cortina-en-vetrina-553a7717.jpg",
  "minimale-couture": "couture-minimale-en-vetrina-93e7c6cd.jpg",
  "betoverd-bos": "incanto-nel-bosco-en-vetrina-6c056d35.jpg",
  "riviera-70": "riviera-70-en-vetrina-253c0193.jpg",
  "italiaanse-aquarel": "acquerello-italia-en-vetrina-3869b8cc.jpg",
  "oro-antico": "oro-antico-en-vetrina-22d36ceb.jpg",
  "tuscany-chic": "tuscany-chic-en-vetrina-3646f639.jpg",
  "gouden-uur": "tipografico-moderno-en-vetrina-2c921489.jpg",
  "de-geheime-tuin": "giardino-segreto-en-vetrina-c0e0298d.jpg",
  "tratto-d-inchiostro": "tratto-inchiostro-en-vetrina-48f6d0e0.jpg",
  "idillio": "idillio-en-vetrina-4806113a.jpg",
  "romantisch-botanisch": "botanico-romantico-en-vetrina-5a476f93.jpg",
  "strawberry-matcha": "strawberry-matcha-en-vetrina-4c490953.jpg",
  "toile-de-jouy": "toile-bleu-en-vetrina-a0fc5d6a.jpg",
};

function img(slug: string): string {
  return `${BASE_LOCAL}${slug}.jpg`;
}

function buste(filename: string): string {
  return `${BUSTE_LOCAL}${filename}`;
}

export const templates: Template[] = [
  {
    slug: "bloom",
    name: "Bloom",
    tagline: "LINTEN, STRIKKEN EN AQUARELROZEN",
    description: "Bloom is voor het stel dat wil dat de uitnodiging aanvoelt als iets wat je hebt gevonden in een antiekwinkel — met de hand geschilderd, met liefde gemaakt. De voorkant is een ovale cartouche omgeven door rozenranken in aquarel, gebonden met een satijnen strik. Jullie namen staan in fijn Engels schrift in het midden. De rest van de uitnodiging ademt dezelfde sfeer: lichte secties met bloemmotieven in de hoeken, en een gestreept aquarelpapier voor de aftelklok, dresscode en afsluiting. De kleur van de rozen, linten en strepen volgt jullie palet — poederroze, hemelsblauw, lavendel of wat jullie maar kiezen. De blaadjes blijven altijd groen, want zo werkt een aquarel.",
    features: [
      "Geschilderde voorkant: ovale cartouche, satijnen strik en rozenranken",
      "De kleur van linten en rozen volgt jullie palet, de blaadjes blijven groen",
      "Gestreept aquarelpapier voor aftelklok, dresscode en afsluiting",
      "Geïllustreerd dagprogramma: een tekening bij elk moment van de dag",
      "Jullie eigen foto als voorkant, of achter de gestreepte secties",
      "17 talen: elke gast leest de uitnodiging in zijn of haar eigen taal",
      "Aanpasbare kleuren en lettertypen",
    ],
    img: img("bloom"),
    envelops: [
      { label: "Ivoor Rosa", img: buste("avorio-rosa.webp") },
      { label: "Wit Strik", img: buste("fiocco-bianco.webp") },
      { label: "Ivoor Groen", img: buste("avorio-verde.webp") },
      { label: "Hemelsblauw", img: buste("fiocco-celeste.webp") },
      { label: "Goud", img: buste("fiocco-oro.webp") },
    ],
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "hemelsblauw", label: "Hemelsblauw" },
      { name: "lavendel", label: "Lavendel" },
      { name: "saliegroen", label: "Saliegroen" },
      { name: "bordeaux", label: "Bordeaux & Goud" },
    ],
    music: ["Amber Glow", "Warm Embrace", "Romantic Piano", "Most Beautiful Day", "Promise of Love", "Wedding Joy", "Geen muziek"],
    faq: [
      { q: "Kan ik de kleur van de rozen aanpassen?", a: "Ja. De rozen, linten, strikken en strepen zijn in één tint geschilderd die jullie palet volgt. De blaadjes blijven groen zodat de aquarel zijn diepte behoudt. Je kunt kiezen uit de beschikbare paletten of een eigen kleur opgeven." },
      { q: "Kan ik een eigen foto gebruiken?", a: "Ja, op twee plekken: als vervanging van de geschilderde voorkant, of achter de aftelklok, dresscode en afsluiting. Op de voorkant vult de foto het volledige scherm, inclusief de cartouche eroverheen." },
      { q: "Hoe werkt de RSVP?", a: "De bevestigingspagina zit ingebouwd. Elke gast bevestigt met één tik, geeft dieetwensen door en kiest een menu. Jullie zien alle antwoorden in real time in het dashboard." },
      { q: "In hoeveel talen is de uitnodiging beschikbaar?", a: "In 17 talen. Elke gast kiest zelf de taal, of de uitnodiging past zich automatisch aan op basis van de taalinstellingen van het apparaat." },
    ],
    price: "89",
    openingStyle: "bow",
  },
  {
    slug: "volta-celeste",
    name: "Volta Celeste",
    tagline: "GESCHILDERDE LUCHT EN WIT STUCWERK",
    description: "Volta Celeste kijkt omhoog — zoals je doet als je voor het eerst een beschilderd plafond ziet in een Italiaanse villa. De uitnodiging arriveert als een echte papieren kaart: in drieën gevouwen, met rococo-rankwerk blind in het papier gepreegd en dichtvouwen met een witte stoffen strik. Bij aanraking gaat de strik los, vallen de kleppen open en verschijnt de geschilderde lucht.",
    features: [
      "Strik-opening: de stoffen strik gaat los en de kaart valt in drieën open",
      "Twee enveloptypes: ivoor papier of hemelsblauw, dezelfde lucht erachter",
      "Geschilderde lucht als hero met duiven en namen in het rankwerk",
      "Secties als gescheurd papier op de lucht gelegd",
      "Alles licht: geen donkere sectie, warme bruin-olijve inkt",
      "17 talen: elke gast leest de uitnodiging in zijn eigen taal",
      "Aanpasbare kleuren en lettertypen",
    ],
    img: img("volta-celeste"),
    envelops: [
      { label: "Ivoor", img: buste("avorio-rosa.webp") },
      { label: "Hemelsblauw", img: buste("fiocco-celeste.webp") },
    ],
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "champagne", label: "Champagne & Goud" },
      { name: "sage", label: "Licht Salie" },
    ],
    music: ["Amber Glow", "Dolce Vita", "Sky Waltz", "Wedding Joy", "Geen muziek"],
    faq: [
      { q: "Hoe werkt de strik-opening?", a: "De gast tikt op het scherm. De stoffen strik trilt los, de kaart valt open in drieën en de geschilderde lucht verschijnt." },
      { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app. Elke gast bevestigt met één tik, geeft dieetwensen door en kiest een menu." },
    ],
    price: "89",
    openingStyle: "trifold",
  },
  {
    slug: "zomertuin",
    name: "Zomertuin",
    tagline: "ITALIAANSE TUIN IN VOLLE BLOEI",
    description: "Zomertuin opent als een tuinpoort op een warme junidag — een cartouche van roze kant omlijst jullie namen, weelderig groen klimt langs de randen omhoog en aquarelbloemen vullen elke hoek.",
    features: ["Kant-cartouche als voorkant met namen in fijn schrift", "Botanische aquarelranden in elke sectie", "Zachte groene en roze tinten, volledig aanpasbaar", "Geïllustreerd dagprogramma", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("zomertuin"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Roze", img: buste("avorio-marrone.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "peach", label: "Perzik & Goud" }, { name: "lavender", label: "Lavendel" }],
    music: ["Garden Waltz", "Tender Rose", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleur van de bloemen aanpassen?", a: "Ja. De kant, de bloemen en de randen volgen jullie palet volledig." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik en geeft dieetwensen door." }],
    price: "89",
    openingStyle: "floral",
  },
  {
    slug: "villa-aurora",
    name: "Villa Aurora",
    tagline: "GOUDEN LICHT OP EEN MEDITERRAAN TERRAS",
    description: "Villa Aurora vangt het moment net vóór het diner begint — de zon staat laag, het terras is gedekt en alles baadt in warm goud.",
    features: ["Terras-opening: twee deuren gaan uiteen", "Warm goud en mediterraan silhouet", "Lichte en donkere variant beschikbaar", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("villa-aurora"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Goud", img: buste("fiocco-oro.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "gold", label: "Goud & Cream" }, { name: "terracotta", label: "Terracotta" }],
    music: ["Dolce Vita", "Amber Glow", "Sunset Serenade", "Geen muziek"],
    faq: [{ q: "Kan ik een eigen foto gebruiken?", a: "Ja, als achtergrond van de hero-sectie." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "curtain",
  },
  {
    slug: "het-zwanenmeer",
    name: "Het Zwanenmeer",
    tagline: "TWEE ZWANEN OP EEN SPIEGELEND MEER",
    description: "Het Zwanenmeer zweeft. Twee witte zwanen op een stilstaand meer, een lucht die nauwelijks te onderscheiden is van het water.",
    features: ["Golf-opening vanuit het midden", "Zwanen-illustratie als centrale hero", "Zachte blauw-grijze tinten", "Alles licht: geen donkere secties", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("het-zwanenmeer"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Zilver", img: buste("argento.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "blush", label: "Blush & Zilver" }, { name: "midnight", label: "Middernachtsblauw" }],
    music: ["Swan Lake", "Tender Rose", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. Het palet volgt jullie keuze volledig." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "wave",
  },
  {
    slug: "villa-cortina",
    name: "Villa Cortina",
    tagline: "HET GORDIJN GAAT OPEN, DE ZAAL VERSCHIJNT",
    description: "Villa Cortina is theater. Fluwelen gordijnen schuiven uiteen — langzaam, met gewicht — en geven een zaal vrij van kant, kristal en marmer.",
    features: ["Theatraal gordijn dat opengaat bij aanraking", "Kristal- en kantdetails in elke sectie", "Rijke kleuren: bordeaux, marine of ivoor", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("villa-cortina"),
    envelops: [{ label: "Bordeaux", img: buste("rossa.webp") }, { label: "Goud", img: buste("oro.webp") }, { label: "Zilver", img: buste("argento.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "bordeaux", label: "Bordeaux & Goud" }, { name: "navy", label: "Marine & Zilver" }],
    music: ["Grand Entrance", "Velvet Night", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Hoe werkt de gordijn-opening?", a: "De gordijnen schuiven langzaam opzij bij aanraking, als een theaterpremière." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "curtain",
  },
  {
    slug: "minimale-couture",
    name: "Minimale Couture",
    tagline: "MEER ZEGGEN DOOR MINDER TE LATEN ZIEN",
    description: "Minimale Couture is de uitnodiging die je niet opvalt — totdat je hem ziet. Veel wit, strakke marges, een typografie die ademt.",
    features: ["Vouw-opening: één paneel dat zich langzaam ontvouwt", "Minimalistische layout met veel wit", "Luxe seriflettertype, uitgebalanceerde typografie", "Zwart & wit of champagne variant", "17 talen beschikbaar", "Aanpasbare lettertypen"],
    img: img("minimale-couture"),
    envelops: [{ label: "Wit", img: buste("semplice-rossa.webp") }, { label: "Champagne", img: buste("fiocco-oro.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "black", label: "Zwart & Wit" }, { name: "champagne", label: "Champagne" }],
    music: ["Silence & Grace", "Tender Rose", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de typografie aanpassen?", a: "Ja. Je kiest uit verschillende lettertypen in de editor." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "fold",
  },
  {
    slug: "betoverd-bos",
    name: "Betoverd Bos",
    tagline: "EEN PAD DOOR EEN GESCHILDERD BOS",
    description: "Betoverd Bos is voor wie wil dat de gasten even ergens anders zijn als ze de uitnodiging openen. Een geschilderd bos in groene en roze tinten.",
    features: ["Bloem-opening: bloemen ontvouwen zich één voor één", "Geschilderd boslandschap als hero", "Wilde rozen en botanisch groen in elke sectie", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("betoverd-bos"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Groen", img: buste("avorio-verde.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "forest", label: "Diep Groen" }, { name: "blush", label: "Blush & Groen" }],
    music: ["Enchanted Forest", "Garden Waltz", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleur van de bloemen aanpassen?", a: "Ja. De rozen en botanische details volgen jullie palet." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "floral",
  },
  {
    slug: "riviera-70",
    name: "Riviera 70",
    tagline: "ZONNIG EN VINTAGE, EEN KUST IN DE JAREN ZEVENTIG",
    description: "Riviera 70 is de uitnodiging die smaakt naar zout en zonnebrandcrème. Retro typografie, warm oranje en oud geel.",
    features: ["Golf-opening als een vlaag zeewind", "Retro typografie en vintage kust-illustraties", "Warm oranje en oud geel palet", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("riviera-70"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Oranje", img: buste("rossa.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "coral", label: "Koraal & Goud" }, { name: "turquoise", label: "Turquoise & Zand" }],
    music: ["Côte d'Azur", "Summer Groove", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. Het retro palet is volledig aanpasbaar." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "wave",
  },
  {
    slug: "italiaanse-aquarel",
    name: "Italiaanse Aquarel",
    tagline: "MAJOLICA EN KUST IN ÉÉN AQUAREL",
    description: "Italiaanse Aquarel is de uitnodiging voor wie Amalfi kent — of er altijd van heeft gedroomd. Kleurrijke majolica-tegels, luchtige wassen in citroen en blauw.",
    features: ["Bloem-opening als een mediterrane markt", "Majolica-geïnspireerde details in elke sectie", "Aquarel kust-illustraties", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("italiaanse-aquarel"),
    envelops: [{ label: "Blauw", img: buste("fiocco-celeste.webp") }, { label: "Terracotta", img: buste("avorio-marrone.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "lemon", label: "Citroen & Blauw" }, { name: "terracotta", label: "Terracotta & Wit" }],
    music: ["Dolce Vita", "Amalfi Breeze", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. De majolica-tinten volgen jullie keuze." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "floral",
  },
  {
    slug: "oro-antico",
    name: "Oro Antico",
    tagline: "BEIGE, OUD GOUD EN BLOEMRIJKE ORNAMENTEN",
    description: "Oro Antico is de uitnodiging van een palazzo dat al eeuwen staat. Beige pleisterwanden, verguld stucwerk, bloemornamentiek in goud.",
    features: ["Vouw-opening als een brief van zwaar papier", "Antiek goud accenten en bloemrijke ornamenten", "Warme beige achtergrond", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("oro-antico"),
    envelops: [{ label: "Goud", img: buste("oro.webp") }, { label: "Zilver", img: buste("argento.webp") }, { label: "Ivoor", img: buste("semplice-oro.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "platinum", label: "Platina & Ivoor" }, { name: "rose-gold", label: "Rosé Goud" }],
    music: ["Golden Hour", "Amber Glow", "Tender Rose", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. Het antieke goud en de beige tinten zijn aanpasbaar." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "fold",
  },
  {
    slug: "tuscany-chic",
    name: "Tuscany Chic",
    tagline: "TOSCAANS LICHT EN MODERNE VERFIJNING",
    description: "Tuscany Chic is voor het stel dat wil trouwen in een Toscaans landschap. Okerkleurige velden, cypressen in de verte, een openlucht-gevoel dat modern is maar niet koel.",
    features: ["Gordijn-opening die een Toscaans landschap onthult", "Warme oker en terracotta tinten", "Modern-rustiek ontwerp", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("tuscany-chic"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Terracotta", img: buste("avorio-marrone.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "olive", label: "Olijf & Goud" }, { name: "terracotta", label: "Terracotta & Cream" }],
    music: ["Dolce Vita", "Harvest Moon", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik een eigen foto gebruiken?", a: "Ja, als achtergrond van de hero." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "curtain",
  },
  {
    slug: "gouden-uur",
    name: "Gouden Uur",
    tagline: "HET LICHT NET VÓÓR ZONSONDERGANG",
    description: "Gouden Uur vangt het moment dat fotografen kennen en bruidsparen nooit vergeten: de laatste twintig minuten voor de zon verdwijnt, als alles goud is.",
    features: ["Vouw-opening in warme gouden tinten", "Intieme typografie en romantisch ontwerp", "Goud en koper als hoofdpalet", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("gouden-uur"),
    envelops: [{ label: "Goud", img: buste("fiocco-oro.webp") }, { label: "Koper", img: buste("oro.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "copper", label: "Koper & Goud" }, { name: "midnight", label: "Middernacht & Goud" }],
    music: ["Golden Hour", "Candlelight", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. De gouden en koperen tinten zijn aanpasbaar." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "fold",
  },
  {
    slug: "de-geheime-tuin",
    name: "De Geheime Tuin",
    tagline: "EEN VERBORGEN POORT, EEN ROZENBOOG",
    description: "De Geheime Tuin leidt jullie gasten door een poort die bijna niet te zien is — een smeedijzeren hek begroeid met klimrozen.",
    features: ["Bloem-opening als een tuin die ontwaakt", "Rozenboog als visuele ingang", "Romantisch groen palet met roze accenten", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("de-geheime-tuin"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Groen", img: buste("avorio-verde.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "rose", label: "Roos & Groen" }, { name: "white", label: "Wit & Salie" }],
    music: ["Secret Garden", "Garden Waltz", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. De rozen en het groen volgen jullie palet." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "floral",
  },
  {
    slug: "tratto-d-inchiostro",
    name: "Tratto d'Inchiostro",
    tagline: "EEN PENSTREEK OP CRÈMEPAPIER",
    description: "Tratto d'Inchiostro is een ode aan de handgeschreven brief. Geen kleur, geen vulling — alleen de lijn en wat die vertelt.",
    features: ["Vouw-opening als een handgeschreven brief", "Monochrome lijnillustraties in één inkt", "Letterpress-gevoel op crèmepapier", "Sepia, marine of grafiet als inktkleur", "17 talen beschikbaar", "Aanpasbare lettertypen"],
    img: img("tratto-d-inchiostro"),
    envelops: [{ label: "Crème", img: buste("semplice-argento.webp") }, { label: "Wit", img: buste("semplice-rossa.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "sepia", label: "Sepia" }, { name: "navy", label: "Marine Inkt" }],
    music: ["Ink & Paper", "Tender Rose", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de inktkleur aanpassen?", a: "Ja. Je kiest uit sepia, marine, grafiet of een eigen kleur." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "fold",
  },
  {
    slug: "idillio",
    name: "Idillio",
    tagline: "EEN GOUDEN STRIK, WITTE ZWANEN, ALLES LICHT",
    description: "Idillio is alles tegelijk: licht, lucht, vreugde en een gouden strik die de dag samenbindt.",
    features: ["Strik-opening: gouden strik gaat los bij aanraking", "Witte zwanen en lichte aquarelwassen", "Helder en vrolijk palet", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("idillio"),
    envelops: [{ label: "Goud", img: buste("fiocco-oro.webp") }, { label: "Ivoor", img: buste("semplice-oro.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "gold", label: "Goud & Wit" }, { name: "blush", label: "Blush & Goud" }],
    music: ["Golden Hour", "Swan Lake", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Wat is het verschil met Het Zwanenmeer?", a: "Idillio is lichter en vrolijker. Het Zwanenmeer is meditatief. Beide hebben zwanen, maar het gevoel is anders." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "bow",
  },
  {
    slug: "romantisch-botanisch",
    name: "Romantisch Botanisch",
    tagline: "BOTANISCHE PAGINA'S UIT EEN OUD PLANTENBOEK",
    description: "Romantisch Botanisch ziet eruit als een pagina die iemand heeft losgenomen uit een 18e-eeuws herbariumboek.",
    features: ["Herbarium-opening: botanische illustraties ontvouwen zich", "Varens, bloesem en wilde bloemen in elke sectie", "Delicate groene en roze tinten", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("romantisch-botanisch"),
    envelops: [{ label: "Ivoor", img: buste("avorio-rosa.webp") }, { label: "Groen", img: buste("avorio-verde.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "forest", label: "Diep Groen" }, { name: "blush", label: "Blush Botanisch" }],
    music: ["Botanical Dreams", "Garden Waltz", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. De botanische tinten volgen jullie palet." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "floral",
  },
  {
    slug: "strawberry-matcha",
    name: "Strawberry Matcha",
    tagline: "FRIS, SPEELS EN ONVERWACHT MOOI",
    description: "Strawberry Matcha is de uitnodiging voor het stel dat niet wil kiezen tussen klassiek en eigentijds. Matcha-groen en aardbeirood.",
    features: ["Golf-opening als een kopje thee", "Matcha-groen en aardbeirood als hoofdpalet", "Modern en fris ontwerp", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("strawberry-matcha"),
    envelops: [{ label: "Matcha", img: buste("avorio-verde.webp") }, { label: "Aardbei", img: buste("rossa.webp") }],
    colors: [{ name: "origineel", label: "Origineel" }, { name: "matcha", label: "Matcha & Cream" }, { name: "strawberry", label: "Aardbei & Wit" }],
    music: ["Fresh Morning", "Garden Waltz", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Kan ik de kleuren aanpassen?", a: "Ja. Alle tinten zijn volledig aanpasbaar." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd. Elke gast bevestigt met één tik." }],
    price: "89",
    openingStyle: "wave",
  },
  {
    slug: "toile-de-jouy",
    name: "Toile de Jouy",
    tagline: "KLASSIEKE TOILE IN VIER TINTEN",
    description: "Toile de Jouy is Frans, klassiek en net iets te mooi om weg te gooien. Een toile-print met landelijke taferelen in blauw, rood, groen of zwart op crème papier.",
    features: ["Vouw-opening als een 18e-eeuwse brief", "Klassieke toile-print in vier kleurvarianten", "Zilveren of wit lint op de envelop", "Frans-klassiek ontwerp", "17 talen beschikbaar", "Aanpasbare kleuren en lettertypen"],
    img: img("toile-de-jouy"),
    envelops: [
      { label: "Toile Blauw", img: buste("fiocco-celeste.webp") },
      { label: "Toile Rood", img: buste("semplice-rossa.webp") },
      { label: "Toile Zilver", img: buste("semplice-argento.webp") },
      { label: "Toile Goud", img: buste("semplice-oro.webp") },
    ],
    colors: [{ name: "blauw", label: "Toile Blauw" }, { name: "rood", label: "Toile Rood" }, { name: "groen", label: "Toile Groen" }, { name: "zwart", label: "Toile Zwart" }],
    music: ["Versailles", "Tender Rose", "Amber Glow", "Geen muziek"],
    faq: [{ q: "Hoeveel kleurvarianten zijn er?", a: "Vier: blauw, rood, groen en zwart. Alle vier op crème papier." }, { q: "Hoe werkt de RSVP?", a: "Ingebouwd en zonder app." }],
    price: "89",
    openingStyle: "fold",
  },
];

export function getTemplate(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

// Helper: geef Sponsalia fallback URL als lokaal bestand niet bestaat
export function getTemplateImgUrl(slug: string): string {
  const file = TEMPLATE_FILES[slug];
  if (!file) return `/assets/templates/${slug}.jpg`;
  // Lokaal pad — Netlify serveert dit vanuit /public/assets/templates/
  return `/assets/templates/${slug}.jpg`;
}

export function getSponaliaFallbackUrl(slug: string): string {
  const file = TEMPLATE_FILES[slug];
  if (!file) return "";
  return `https://sponsalia.app/assets/marketing/templates/${file}`;
}
