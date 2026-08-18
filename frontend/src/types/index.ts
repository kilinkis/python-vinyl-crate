export type RecordCondition =
  | 'Mint'
  | 'Near Mint'
  | 'VG+'
  | 'VG'
  | 'Good'
  | 'Fair'
  | 'Poor';

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface RecordItem {
  id: number;
  title: string;
  artist: string;
  release_year: number;
  condition: RecordCondition | string | null;
  price: number;
  cover_url?: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface RecordCreateInput {
  title: string;
  artist: string;
  release_year: number;
  condition?: RecordCondition | string | null;
  price: number;
  cover_url?: string | null;
}

export type RecordUpdateInput = Partial<RecordCreateInput>;

export interface RecordListResponse {
  items: RecordItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface Token {
  access_token: string;
  token_type: string;
}
