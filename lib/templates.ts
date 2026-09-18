export type TemplateColor = {
  name: string;
  label: string;
};

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  img: string; // vetrina afbeelding
  colors: TemplateColor[];
  music: string[];
};

const BASE = "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2F";

export const templates: Template[] = [
  {
    slug: "bloom",
    name: "Bloom",
    tagline: "Coquette aquarel: linten, strikken en rozen",
    description: "Bloom is het sjabloon voor stellen die hun uitnodiging willen laten bloeien zoals een boudoir-aquarel — roze linten, wilde rozen en een ovale cartouche omsloten door klimopranken. Elke sectie heeft een zachte crème achtergrond met aquarelbloemen in de hoeken. Een strik opent de envelop bij aanraking.",
    features: [
      "Video-opening: de strik gaat los en de kaart opent",
      "Aquarel bloemmotieven in elke sectie",
      "Crème en roze palet, aanpasbaar",
      "17 talen: elke gast leest de uitnodiging in de zijne",
      "Aanpasbare kleuren en lettertypes",
    ],
    img: BASE + "bloom-en-vetrina-96e6b193.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "blush", label: "Blush & Ivoor" },
      { name: "sage", label: "Salie Groen" },
    ],
    music: ["Amber Glow", "Tender Rose", "Garden Waltz"],
  },
  {
    slug: "volta-celeste",
    name: "Volta Celeste",
    tagline: "Geschilderde lucht en wit stucwerk",
    description: "Volta Celeste is het sjabloon voor stellen die willen dat hun digitale trouwkaart omhoog kijkt, zoals onder het beschilderde plafond van een Italiaanse villa. Hij opent als een echte kaart: in drieën gevouwen, met rococo-rankwerk blind in het papier gepreegd, dichtgebonden met een witte stoffen strik die bij aanraking losgaat.",
    features: [
      "Video-opening: de stoffen strik gaat los en de kaart valt open",
      "Twee papieren voor de envelop: ivoor of hemelsblauw",
      "Geschilderde hero: de lucht met zijn duiven en de namen in de lijst",
      "Secties op gescheurd papier, op de lucht gelegd",
      "Alles licht: geen donkere sectie, warme bruin-olijve inkt",
      "17 talen: elke gast leest de uitnodiging in de zijne",
    ],
    img: BASE + "volta-celeste-en-vetrina-63b82e9f.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "champagne", label: "Champagne & Goud" },
      { name: "sage", label: "Licht Salie" },
    ],
    music: ["Amber Glow", "Sky Waltz", "Dolce Vita"],
  },
  {
    slug: "zomertuin",
    name: "Zomertuin",
    tagline: "Groene tuin en een cartouche van roze kant",
    description: "Zomertuin neemt jullie gasten mee naar een Italiaanse tuin in volle bloei — weelderig groen, roze bloemen en een delicate cartouche van roze kant omlijst de namen van het bruidspaar. Fris, romantisch en tijdloos.",
    features: [
      "Botanische illustraties in aquarel",
      "Zachte groene en roze tinten",
      "Kant-cartouche rond de namen",
      "17 talen beschikbaar",
      "Aanpasbare kleuren en lettertypes",
    ],
    img: BASE + "giardino-destate-en-vetrina-e4c79ec8.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "peach", label: "Perzik & Goud" },
      { name: "lavender", label: "Lavendel" },
    ],
    music: ["Garden Waltz", "Amber Glow", "Tender Rose"],
  },
  {
    slug: "villa-aurora",
    name: "Villa Aurora",
    tagline: "Terras bij zonsondergang, tijdloze luxe",
    description: "Villa Aurora plaatst jullie gasten op een terras bij zonsondergang — warme oranje en gouden tinten, een mediterraan silhouet en een gevoel van stille luxe. Voor het stel dat kiest voor elegantie boven uitbundigheid.",
    features: [
      "Warme zonsondergang-palet",
      "Mediterraan architectuurdetail",
      "Tijdloos elegant design",
      "17 talen beschikbaar",
    ],
    img: BASE + "villa-aurora-en-vetrina-50b36ee0.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "gold", label: "Goud & Cream" },
      { name: "terracotta", label: "Terracotta" },
    ],
    music: ["Dolce Vita", "Amber Glow", "Sunset Serenade"],
  },
  {
    slug: "het-zwanenmeer",
    name: "Het Zwanenmeer",
    tagline: "Romantisch en luchtig, zachte tinten",
    description: "Het Zwanenmeer zweeft tussen droom en werkelijkheid — twee zwanen op een spiegelend meer, zachte blauwe en grijze tinten en een algehele luchtigheid die past bij een sprookjesbruiloft.",
    features: [
      "Zwanen-illustratie als hero",
      "Zachte blauw-grijze tinten",
      "Luchtig en romantisch design",
      "17 talen beschikbaar",
    ],
    img: BASE + "lago-dei-cigni-en-vetrina-6e0256ed.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "blush", label: "Blush & Zilver" },
      { name: "midnight", label: "Middernachtsblauw" },
    ],
    music: ["Swan Lake", "Tender Rose", "Garden Waltz"],
  },
  {
    slug: "villa-cortina",
    name: "Villa Cortina",
    tagline: "Het gordijn opent de zaal, kant en kristal",
    description: "Villa Cortina opent als een theatergordijn — fluwelen plooien wijken uiteen en onthullen een zaal van kant en kristal. Glamour en grandeur voor het stel dat groot durft te dromen.",
    features: [
      "Theatraal gordijn-opening",
      "Kristal en kant details",
      "Rijke kleuren en texturen",
      "17 talen beschikbaar",
    ],
    img: BASE + "villa-cortina-en-vetrina-553a7717.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "bordeaux", label: "Bordeaux & Goud" },
      { name: "navy", label: "Marine & Zilver" },
    ],
    music: ["Grand Entrance", "Amber Glow", "Velvet Night"],
  },
  {
    slug: "minimale-couture",
    name: "Minimale Couture",
    tagline: "Essentieel, ruimte en adem",
    description: "Minimale Couture zegt meer door minder — strakke lijnen, veel wit en een typografie die spreekt. Voor het stel dat kiest voor verfijning zonder opsmuk.",
    features: [
      "Clean minimalistisch design",
      "Luxe typografie",
      "Veel wit en ademruimte",
      "17 talen beschikbaar",
    ],
    img: BASE + "couture-minimale-en-vetrina-93e7c6cd.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "black", label: "Zwart & Wit" },
      { name: "champagne", label: "Champagne" },
    ],
    music: ["Tender Rose", "Amber Glow", "Silence & Grace"],
  },
  {
    slug: "betoverd-bos",
    name: "Betoverd Bos",
    tagline: "Geschilderd bos en wilde rozen",
    description: "Betoverd Bos voert jullie gasten diep in een geschilderd woud — wilde rozen klimmen langs eikenhouten paden, groene en roze tinten wisselen elkaar af en een gevoel van magie doordringt elke sectie.",
    features: [
      "Geschilderd boslandschap",
      "Wilde rozen en botanisch groen",
      "Sprookjesachtige sfeer",
      "17 talen beschikbaar",
    ],
    img: BASE + "incanto-nel-bosco-en-vetrina-6c056d35.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "forest", label: "Diep Groen" },
      { name: "blush", label: "Blush & Groen" },
    ],
    music: ["Garden Waltz", "Enchanted Forest", "Tender Rose"],
  },
  {
    slug: "riviera-70",
    name: "Riviera 70",
    tagline: "Zonnig en vintage, jaren 70-sfeer",
    description: "Riviera 70 katapulteert jullie gasten naar een zonnige kust in de jaren zeventig — warm oranje, oud geel en retro typografie die de zorgeloosheid van een Méditerranée-vakantie oproepen.",
    features: [
      "Retro jaren 70 design",
      "Warme kust-palet",
      "Vintage typografie",
      "17 talen beschikbaar",
    ],
    img: BASE + "riviera-70-en-vetrina-253c0193.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "coral", label: "Koraal & Goud" },
      { name: "turquoise", label: "Turquoise & Zand" },
    ],
    music: ["Côte d'Azur", "Summer Groove", "Amber Glow"],
  },
  {
    slug: "italiaanse-aquarel",
    name: "Italiaanse Aquarel",
    tagline: "Majolica en kust in aquarel",
    description: "Italiaanse Aquarel combineert de kleurrijke majolica-tegels van Amalfi met luchtige aquarelwassen van de kust — citroen, blauw en wit dansen op een ivoorkleurige achtergrond.",
    features: [
      "Majolica-geïnspireerde details",
      "Aquarel kust-illustraties",
      "Mediterraan kleurenpalet",
      "17 talen beschikbaar",
    ],
    img: BASE + "acquerello-italia-en-vetrina-3869b8cc.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "lemon", label: "Citroen & Blauw" },
      { name: "terracotta", label: "Terracotta & Wit" },
    ],
    music: ["Dolce Vita", "Amalfi Breeze", "Amber Glow"],
  },
  {
    slug: "oro-antico",
    name: "Oro Antico",
    tagline: "Beige en oud goud, bloemrijk en elegant",
    description: "Oro Antico ademt de grandeur van een oud Italiaans palazzo — beige muren, verguld stucwerk en bloemmotieven in goud die generaties lang zijn verfijnd. Voor het stel dat tijdloze rijkdom wil uitstralen.",
    features: [
      "Antiek goud accenten",
      "Bloemrijke ornamenten",
      "Warme beige achtergrond",
      "17 talen beschikbaar",
    ],
    img: BASE + "oro-antico-en-vetrina-22d36ceb.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "platinum", label: "Platina & Ivoor" },
      { name: "rose-gold", label: "Rosé Goud" },
    ],
    music: ["Amber Glow", "Golden Hour", "Tender Rose"],
  },
  {
    slug: "tuscany-chic",
    name: "Tuscany Chic",
    tagline: "Warm en verfijnd, en plein air",
    description: "Tuscany Chic combineert de warmte van Toscaans licht met moderne verfijning — okerkleurige velden, cypressen en een open-lucht-gevoel dat past bij een bruiloft omringd door natuur.",
    features: [
      "Toscaans landschapsdetail",
      "Warme oker en terracotta tinten",
      "Modern-rustiek design",
      "17 talen beschikbaar",
    ],
    img: BASE + "tuscany-chic-en-vetrina-3646f639.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "olive", label: "Olijf & Goud" },
      { name: "terracotta", label: "Terracotta & Cream" },
    ],
    music: ["Dolce Vita", "Amber Glow", "Harvest Moon"],
  },
  {
    slug: "gouden-uur",
    name: "Gouden Uur",
    tagline: "Warm avondlicht, romantisch en intiem",
    description: "Gouden Uur vangt het magische moment net vóór zonsondergang — warm goud, diepe schaduwen en een intiem gevoel dat past bij een bruiloft bij kaarslicht.",
    features: [
      "Gouden zonsondergang-sfeer",
      "Intiem en romantisch design",
      "Warme typografie",
      "17 talen beschikbaar",
    ],
    img: BASE + "tipografico-moderno-en-vetrina-2c921489.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "copper", label: "Koper & Goud" },
      { name: "midnight", label: "Middernacht & Goud" },
    ],
    music: ["Golden Hour", "Amber Glow", "Candlelight"],
  },
  {
    slug: "de-geheime-tuin",
    name: "De Geheime Tuin",
    tagline: "Rozenboog en Italiaanse tuin",
    description: "De Geheime Tuin leidt jullie gasten door een verborgen poort — een rozenboog omlijst de ingang, weelderig groen verbergt oude stenen muren en de namen van het bruidspaar staan gegraveerd als op een zonnige steen.",
    features: [
      "Rozenboog als visuele poort",
      "Italiaanse tuin-illustraties",
      "Romantisch groen palet",
      "17 talen beschikbaar",
    ],
    img: BASE + "giardino-segreto-en-vetrina-c0e0298d.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "rose", label: "Roos & Groen" },
      { name: "white", label: "Wit & Salie" },
    ],
    music: ["Garden Waltz", "Secret Garden", "Tender Rose"],
  },
  {
    slug: "tratto-d-inchiostro",
    name: "Tratto d'Inchiostro",
    tagline: "Penlijnen op papier, één enkele inkt",
    description: "Tratto d'Inchiostro is een ode aan de handgeschreven brief — lijnillustraties in één enkele inkt op crèmepapier, zonder kleur, zonder opsmuk. Alleen de lijn en het verhaal.",
    features: [
      "Handgetekende lijnillustraties",
      "Monochroom inkt-palet",
      "Letterpress-gevoel",
      "17 talen beschikbaar",
    ],
    img: BASE + "tratto-inchiostro-en-vetrina-48f6d0e0.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "sepia", label: "Sepia" },
      { name: "navy", label: "Marine Inkt" },
    ],
    music: ["Tender Rose", "Ink & Paper", "Amber Glow"],
  },
  {
    slug: "idillio",
    name: "Idillio",
    tagline: "Gouden strik en zwanen, alles licht",
    description: "Idillio is licht, lucht en liefde — een gouden strik, witte zwanen en een algehele helderheid die past bij een zomerse bruiloft aan het water. Alles is zacht, alles is licht.",
    features: [
      "Gouden strik als centraal element",
      "Witte zwanen-illustratie",
      "Luchtig helder palet",
      "17 talen beschikbaar",
    ],
    img: BASE + "idillio-en-vetrina-4806113a.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "gold", label: "Goud & Wit" },
      { name: "blush", label: "Blush & Goud" },
    ],
    music: ["Golden Hour", "Amber Glow", "Swan Lake"],
  },
  {
    slug: "romantisch-botanisch",
    name: "Romantisch Botanisch",
    tagline: "Bladeren en bloemen, delicaat",
    description: "Romantisch Botanisch omhult elke sectie met delicate botanische illustraties — varens, bloesem en wilde bloemen in zachte groene en roze tinten, als pagina's uit een oud plantenboek.",
    features: [
      "Botanische illustraties",
      "Delicate groene en roze tinten",
      "Naturalistisch romantisch design",
      "17 talen beschikbaar",
    ],
    img: BASE + "botanico-romantico-en-vetrina-5a476f93.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "forest", label: "Diep Groen" },
      { name: "blush", label: "Blush Botanisch" },
    ],
    music: ["Garden Waltz", "Tender Rose", "Botanical Dreams"],
  },
  {
    slug: "strawberry-matcha",
    name: "Strawberry Matcha",
    tagline: "Fris en speels, matcha en aardbei",
    description: "Strawberry Matcha is fris, speels en onverwacht — de combinatie van matcha-groen en aardbeirood creëert een uitnodiging die direct opvalt en een glimlach oproept. Perfect voor stellen met karakter.",
    features: [
      "Speels matcha & aardbei palet",
      "Modern en fris design",
      "Onverwachte kleurencombinatie",
      "17 talen beschikbaar",
    ],
    img: BASE + "strawberry-matcha-en-vetrina-4c490953.jpg&w=1200&q=75",
    colors: [
      { name: "origineel", label: "Origineel" },
      { name: "matcha", label: "Matcha & Cream" },
      { name: "strawberry", label: "Aardbei & Wit" },
    ],
    music: ["Fresh Morning", "Garden Waltz", "Amber Glow"],
  },
  {
    slug: "toile-de-jouy",
    name: "Toile de Jouy",
    tagline: "Toile in vier tinten op crème papier",
    description: "Toile de Jouy is een klassieke toile-print in vier tinten — blauw, rood, groen of zwart op crème papier — met landelijke taferelen die de Franse elegantie van de 18e eeuw oproepen. Een zilveren of wit lint sluit de envelop.",
    features: [
      "Klassieke toile-print illustraties",
      "Vier kleurvarianten",
      "Zilver of wit lint op de envelop",
      "Frans-klassiek design",
      "17 talen beschikbaar",
    ],
    img: BASE + "toile-bleu-en-vetrina-a0fc5d6a.jpg&w=1200&q=75",
    colors: [
      { name: "blauw", label: "Toile Blauw" },
      { name: "rood", label: "Toile Rood" },
      { name: "groen", label: "Toile Groen" },
      { name: "zwart", label: "Toile Zwart" },
    ],
    music: ["Versailles", "Tender Rose", "Amber Glow"],
  },
];

export function getTemplate(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}
