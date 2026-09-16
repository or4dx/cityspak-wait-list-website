import {
  ChefHat,
  Coffee,
  Disc3,
  Drama,
  Flower2,
  Globe,
  Landmark,
  Martini,
  Music,
  Palette,
  ShoppingBag,
  Soup,
  Sunrise,
  Tent,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/** Maps each category's iconKey (src/lib/experts-data.ts) to a lucide-react
 * icon, the same icon set used everywhere else on the site (see Ethos.tsx),
 * instead of the reference prototype's emoji. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  landmark: Landmark,
  "chef-hat": ChefHat,
  martini: Martini,
  "disc-3": Disc3,
  music: Music,
  sunrise: Sunrise,
  coffee: Coffee,
  palette: Palette,
  tent: Tent,
  "flower-2": Flower2,
  drama: Drama,
  soup: Soup,
  "utensils-crossed": UtensilsCrossed,
  "shopping-bag": ShoppingBag,
};
