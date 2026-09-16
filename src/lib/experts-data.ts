/**
 * Static data for the /experts venue survey, transcribed verbatim from the
 * reference prototype (cityspak-survey.html): same categories, same venues,
 * same option lists. Only the format changed (array-of-arrays -> typed
 * objects) so the app can type-check it; nothing about the content did.
 */

export interface VenueEntry {
  name: string;
  location: string;
  closed: boolean;
  /** Instagram handle used for the unavatar.io lookup; empty string means
   * no handle, fall back straight to initials. */
  instagramHandle: string;
}

export interface ExpertCategory {
  id: string;
  /** Key into CATEGORY_ICONS (src/components/experts/category-icons.tsx),
   * matching the site's own lucide-react icon set instead of emoji. */
  iconKey: string;
  name: string;
  /** Fallback background color for this category's venue avatars when a
   * handle is missing or its image fails to load. Category-level venue
   * data, not a site theme token, kept as-is from the prototype. */
  color: string;
  venues: VenueEntry[];
}

export const FOCUS_OPTIONS = [
  "Dubai food & dining",
  "Nightlife & bars",
  "Lifestyle & going out",
  "Travel & tourism",
  "Wellness",
  "Culture & arts",
  "Budget spots",
];

export const VISIT_COUNT_OPTIONS = ["1-5 venues", "6-15 venues", "More than 15"];
export const BEST_FOR_OPTIONS = ["Date night", "Group outing", "Special occasion", "Solo", "Casual", "Any"];
export const RECOMMEND_OPTIONS = ["Yes, without hesitation", "For the right occasion", "Probably not"];
export const VISIT_TYPE_OPTIONS = ["Self-paid", "Hosted / comped", "Both"];
export const LAST_VISITED_OPTIONS = ["Within 6 months", "6-12 months ago", "Over a year ago"];

function v(name: string, location: string, closed: 0 | 1, instagramHandle: string): VenueEntry {
  return { name, location, closed: closed === 1, instagramHandle };
}

export const EXPERT_CATEGORIES: ExpertCategory[] = [
  {
    id: "c1",
    iconKey: "globe",
    name: "African, Caribbean & Latin",
    color: "#C4622D",
    venues: [
      v("INA", "Downtown", 0, "ina.dubai"),
      v("Savryn", "JLT", 0, ""),
      v("Calabar Aroma", "Karama", 0, "calabararomadubai"),
      v("Kiza", "DIFC", 0, "kizadubai"),
      v("Enish", "JLT", 0, "enishdubai"),
      v("Suyaya", "Al Barsha", 0, "suyayadubai"),
      v("Biggy Restaurant", "Deira", 0, ""),
      v("Goh Grill", "Al Quoz", 0, ""),
      v("Island Waterz", "JLT", 0, "islandwaterz"),
      v("Tamoka", "JBR", 0, "tamokadubai"),
      v("Girl & The Goose", "Al Quoz", 0, "girlandthegoosedubai"),
      v("Taqueria Freedah", "Al Wasl", 0, "taqueriafreedah"),
    ],
  },
  {
    id: "c2",
    iconKey: "landmark",
    name: "Emirati & Heritage Arabic",
    color: "#B8872A",
    venues: [
      v("Al Khayma Heritage Restaurant", "Al Fahidi", 0, "alkhayma.ae"),
      v("Shanasheel", "Jumeirah", 0, "shanasheeldubai"),
      v("Al Hadheerah", "Bab Al Shams", 0, "babalshamsresort"),
      v("Gerbou", "Al Wasl", 0, "gerboudubai"),
      v("Anar", "Palm Jumeirah", 0, "anardubai"),
      v("Al Makan", "Madinat Jumeirah", 1, ""),
      v("Arabian Tea House", "Al Fahidi", 0, "arabianteahouse"),
    ],
  },
  {
    id: "c3",
    iconKey: "chef-hat",
    name: "Creative & Unique Dining",
    color: "#7B52C0",
    venues: [
      v("Mann Marzi", "Al Quoz", 0, "mannmarzidubai"),
      v("Fuloong", "Supper club", 0, "fuloongdubai"),
      v("Three Bros", "JLT", 0, "threebrosdubai"),
      v("Middle Child", "Alserkal", 0, "middlechildalserkal"),
      v("Kraken", "DIFC", 0, "krakendubai"),
      v("CHAR", "Four Seasons DIFC", 0, "charbyfs"),
      v("Le Relais de l'Entrecote", "DIFC", 0, "lerelaisdelentrecote"),
      v("Mamabella", "Al Wasl", 0, "mamabelladubai"),
      v("CBF Express", "Supper club", 0, "cbfexpress"),
      v("KIMA", "JLT", 0, "kimajlt"),
      v("Daftar", "Al Quoz", 0, "daftardubai"),
      v("Big T's BBQ", "Al Quoz", 0, "bigtbbqdubai"),
    ],
  },
  {
    id: "c4",
    iconKey: "martini",
    name: "Speakeasies & Hidden Bars",
    color: "#A83050",
    venues: [
      v("Moonshine", "Downtown", 0, "moonshinedubai"),
      v("GABA", "Al Quoz", 0, "gabadubai"),
      v("La Sombra", "DIFC", 0, "lasombradxb"),
      v("LY-LA", "JLT", 0, "lyladubai"),
      v("Bund Lounge", "DIFC", 0, "bundloungedubai"),
      v("Flashback", "Media City", 0, "flashbackdubai"),
      v("7tales", "DIFC", 0, "7talesdubai"),
      v("Socialista", "Jumeirah", 0, "socialistabybudha"),
      v("Galaxy Bar", "SZR", 0, "galaxybardubai"),
      v("Behind the Yellow Door", "Al Quoz", 0, "behindtheyellowdoor"),
    ],
  },
  {
    id: "c5",
    iconKey: "disc-3",
    name: "Dance Venues & Clubs",
    color: "#2D6FBF",
    venues: [
      v("Analog Room", "Varies", 0, "analogroomdubai"),
      v("The Fridge", "Al Quoz", 0, "thefridgedubai"),
      v("The Flip Side", "Al Quoz", 0, "theflipside_dxb"),
    ],
  },
  {
    id: "c6",
    iconKey: "music",
    name: "Live Music",
    color: "#C45A2A",
    venues: [
      v("Sola Jazz Lounge", "DIFC", 0, "soladubai"),
      v("Jass Lounge", "JLT", 0, "jasslounge"),
      v("Nola", "Al Wasl", 0, "noladubai"),
      v("Dubai Opera Jazz Studio", "Downtown", 0, "dubaioperahouse"),
      v("Q's Bar & Lounge", "Kempinski MOE", 0, "qsbardubai"),
    ],
  },
  {
    id: "c7",
    iconKey: "sunrise",
    name: "Brunch",
    color: "#B03080",
    venues: [
      v("Surf Club", "La Mer", 0, "surfclubdubai"),
      v("Attiko", "W Dubai Palm", 0, "attikodubai"),
      v("Boardwalk", "Dubai Creek", 0, "boardwalkdubai"),
      v("Traiteur", "Park Hyatt", 0, "traiteurhyatt"),
      v("Tasca", "Mandarin Oriental", 0, "tascadubai"),
    ],
  },
  {
    id: "c8",
    iconKey: "coffee",
    name: "Coffee & Cafes",
    color: "#8A5C30",
    venues: [
      v("Ferment Artistry", "Al Quoz", 0, "thefermentjourney"),
      v("Earth Roastery", "Multiple", 0, "earthroastery"),
      v("Tom & Serg", "Al Quoz", 0, "tomandserg"),
      v("Comptoir 102", "Jumeirah", 0, "comptoir102"),
      v("Yun Cafe", "Al Quoz", 0, "yuncafedubai"),
      v("bkry", "Alserkal", 0, "bkrydubai"),
      v("Among the Ghaf", "Al Quoz", 0, "amongtheghaf"),
      v("Bando Coffee House", "Al Barsha", 0, "bandocoffeehouse"),
    ],
  },
  {
    id: "c9",
    iconKey: "palette",
    name: "Art, Culture & Heritage",
    color: "#287A70",
    venues: [
      v("Alserkal Avenue", "Al Quoz", 0, "alserkalavenue"),
      v("Jameel Arts Centre", "Jaddaf", 0, "jameelartscentre"),
      v("Leila Heller Gallery", "Al Quoz", 0, "leilahellergallery"),
      v("Gulf Photo Plus", "Al Quoz", 0, "gulfphotoplus"),
      v("Al Fahidi Neighbourhood", "Bur Dubai", 0, "alfahidiburdubai"),
      v("XVA Gallery", "Al Fahidi", 0, "xvagallery"),
    ],
  },
  {
    id: "c10",
    iconKey: "tent",
    name: "Outdoor & Adventure",
    color: "#3A8A4A",
    venues: [
      v("Hatta Wadi Hub", "Hatta", 0, "hattawadiub"),
      v("Dubai Creek Abra Crossing", "Deira", 0, ""),
      v("Kite Beach", "Umm Suqeim", 0, "kitebeachdubai"),
      v("Al Qudra Lakes", "Al Qudra", 0, ""),
    ],
  },
  {
    id: "c11",
    iconKey: "flower-2",
    name: "Wellness",
    color: "#6B50A8",
    venues: [
      v("Simple Float", "Al Quoz", 0, "simplefloat"),
      v("Bab Al Shams Hammam", "Resort", 0, "babalshamsresort"),
      v("Sound Healing Sessions", "Various", 0, ""),
    ],
  },
  {
    id: "c12",
    iconKey: "drama",
    name: "Comedy & Entertainment",
    color: "#9A7A20",
    venues: [
      v("The Laughter Factory", "Media City", 0, "thelaughterfactory"),
      v("Pepperoni Comedy Club", "Al Quoz", 0, "pepperoni_comedyclub"),
    ],
  },
  {
    id: "c13",
    iconKey: "soup",
    name: "Budget & Local Institutions",
    color: "#5A8A30",
    venues: [
      v("Ravi Restaurant", "Satwa", 0, "ravirestaurantsuae"),
      v("Bu Qtair", "Umm Suqeim", 0, "buqtair"),
      v("Al Ustad Special Kebab", "Deira", 0, ""),
      v("Al Farwania", "Bur Dubai", 0, ""),
      v("Khao Soi", "Al Quoz", 0, "khaosoidubai"),
      v("Zagol Ethiopian", "Karama", 0, "zagolrestaurant"),
      v("Darband", "Deira", 0, "darbanddubai"),
      v("Seiyun Mandi", "Al Quoz", 0, ""),
      v("Al Reef Lebanese Bakery", "Multiple", 0, "alreefbakery"),
      v("HumYum", "Karama", 0, "humyumdubai"),
      v("Falafil Al Rabiah", "Bur Dubai", 0, ""),
      v("Walid Bakhit Bakery", "Meena Bazaar", 0, ""),
    ],
  },
  {
    id: "c14",
    iconKey: "utensils-crossed",
    name: "Community Asian Dining",
    color: "#A83030",
    venues: [
      v("Paluto", "Deira Waterfront", 0, "palutodubai"),
      v("Dampa Seafood Grill", "Deira", 0, "dampaseafoodgrill"),
      v("Lamesa", "JLT", 0, "lamesajlt"),
      v("Romantic Baka", "Deira", 0, "romanticbakadubai"),
      v("HYU Restaurant", "JLT", 0, "hyudubai"),
      v("Manna Land Korean", "Al Barsha", 0, "mannalandkorean"),
      v("Caspian Kabab", "Karama", 0, "caspiankabab"),
    ],
  },
  {
    id: "c15",
    iconKey: "shopping-bag",
    name: "Weekend Markets & Community",
    color: "#207878",
    venues: [
      v("Ripe Market", "Various", 0, "ripefoodandcraft"),
      v("Farmers Market Alserkal", "Al Quoz", 0, "farmersmarketalserkal"),
      v("Dubai Flea Market", "Various", 0, "dubaifleamarket"),
      v("Global Village", "SZR", 0, "globalvillagedxb"),
      v("Covent Garden Dubai", "La Mer", 0, "coventgardendubai"),
      v("Project Chaiwala", "Al Barsha", 0, "projectchaiwala"),
      v("Little Lamb", "JLT", 0, "littlelambjlt"),
      v("Homey Chinese", "JLT", 0, "homeychinese"),
      v("Al Shaab", "Meena Bazaar", 0, ""),
      v("The Bay by Social", "Festival City", 0, "thebaybysocial"),
    ],
  },
];

/** Same initials logic as the prototype: strip non-letters, take up to the
 * first two words of length > 1, first letter of each, uppercased. Falls
 * back to the venue name's first character if nothing survives (e.g. an
 * all-symbols name). */
export function getInitials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return initials || name[0]?.toUpperCase() || "?";
}

export function venueId(categoryId: string, venueName: string): string {
  return `${categoryId}_${venueName}`.replace(/[^a-zA-Z0-9]/g, "_");
}
