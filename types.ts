export type RelationshipType = 'mutual' | 'fan' | 'dont_follow_back';

export interface BaseProfile {
  username: string;
  profileUrl: string;
}

export interface AnalyzedProfile extends BaseProfile {
  id: string;
  type: RelationshipType;
  status: 'pending' | 'visited' | 'done';
}

export interface AppState {
  profiles: AnalyzedProfile[];
  stats: {
    mutuals: number;
    fans: number;
    dontFollowBack: number;
  };
}

export interface RawCsvData {
  followers: BaseProfile[];
  following: BaseProfile[];
}
