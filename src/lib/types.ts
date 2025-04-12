
// Series related types
export interface Series {
  id: string;
  name: string;
  short_name: string;
  status: string;
  season: string;
  startDate: string;
  endDate: string;
}

// Match related types
export interface Match {
  id: string;
  name: string;
  short_name: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: {
    home: Team;
    away: Team;
  };
  result?: string;
  toss?: {
    winner: string;
    decision: string;
  };
  series_id: string;
  series_name: string;
}

export interface LiveMatch extends Match {
  score?: {
    batting: {
      team: string;
      runs: number;
      wickets: number;
      overs: number;
    };
    bowling: {
      team: string;
      runs?: number;
      wickets?: number;
      overs?: number;
    };
  };
  current_status: string;
}

// Team related types
export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url?: string;
}

// Player related types
export interface Player {
  id: string;
  name: string;
  team_id: string;
  role: string;
  batting_style?: string;
  bowling_style?: string;
  image_url?: string;
}

// Scorecard related types
export interface Scorecard {
  match_id: string;
  innings: Innings[];
}

export interface Innings {
  team: string;
  runs: number;
  wickets: number;
  overs: number;
  batting: BattingStats[];
  bowling: BowlingStats[];
}

export interface BattingStats {
  player_id: string;
  player_name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  dismissal?: string;
  how_out?: string;
  bowler_id?: string;
  bowler_name?: string;
}

export interface BowlingStats {
  player_id: string;
  player_name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

// News related types
export interface News {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  date: string;
  source?: string;
}

// Points table related types
export interface PointsTableEntry {
  team: string;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  no_result: number;
  points: number;
  net_run_rate: number;
}

// Ranking related types
export interface TeamRanking {
  team: string;
  ranking: number;
  points: number;
  rating: number;
}

export interface PlayerRanking {
  player: string;
  team: string;
  ranking: number;
  rating: number;
}

// API Response types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
