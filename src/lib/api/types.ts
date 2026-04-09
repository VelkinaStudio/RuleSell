import type {
  Category,
  Environment,
  Platform,
  Type,
} from "@/types";

export type RulesetTab = "top" | "trending" | "new" | "editors";

export type RulesetSort =
  | "quality"
  | "popular"
  | "recent"
  | "price_asc"
  | "price_desc";

export interface RulesetQuery {
  q?: string;
  platform?: Platform;
  type?: Type;
  category?: Category;
  environment?: Environment;
  price?: "free" | "paid";
  authorId?: string;
  tab?: RulesetTab;
  sort?: RulesetSort;
  page?: number;
  pageSize?: number;
}
