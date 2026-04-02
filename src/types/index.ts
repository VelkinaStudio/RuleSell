export interface PaginationMeta {
  total: number;
  page?: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface RulesetCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  previewContent: string;
  type: string;
  platform: string;
  category: string;
  price: number;
  currency: string;
  downloadCount: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  trendingScore: number;
  status: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  tags: string[];
  voteCount: number;
  hasVoted: boolean;
}
