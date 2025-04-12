
import { ApiResponse, LiveMatch, Match, News, Player, PointsTableEntry, PlayerRanking, Scorecard, Series, TeamRanking } from "@/lib/types";

// Replace with your actual API token - this should be stored securely
const API_TOKEN = "your_api_token";
const BASE_URL = "http://apicrictez.com/webservices";

// Helper function for API calls
async function apiCall<T>(endpoint: string, method: string = "GET", data?: Record<string, string>): Promise<T> {
  const url = `${BASE_URL}/${endpoint}/${API_TOKEN}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === "POST" && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.message || "API request failed");
    }
    
    return result as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// API functions corresponding to the endpoints
export const cricketApi = {
  // Home List
  getHomeList: () => apiCall<ApiResponse<any>>("homeList"),
  
  // Series List
  getSeriesList: () => apiCall<ApiResponse<Series[]>>("seriesList"),
  
  // Upcoming Matches by Series
  getUpcomingMatchesBySeries: (seriesId: string) => 
    apiCall<ApiResponse<Match[]>>("matchesBySeriesId", "POST", { series_id: seriesId }),
  
  // Upcoming Matches
  getUpcomingMatches: () => apiCall<ApiResponse<Match[]>>("upcomingMatches"),
  
  // Recent Matches
  getRecentMatches: () => apiCall<ApiResponse<Match[]>>("recentMatches"),
  
  // Scorecard of Match
  getScorecardByMatchId: (matchId: string) => 
    apiCall<ApiResponse<Scorecard>>("scorecardByMatchId", "POST", { match_id: matchId }),
  
  // Match Information
  getMatchInfo: (matchId: string) => 
    apiCall<ApiResponse<Match>>("matchInfo", "POST", { match_id: matchId }),
  
  // Squad List of Match
  getSquadByMatchId: (matchId: string) => 
    apiCall<ApiResponse<Player[]>>("squadByMatchId", "POST", { match_id: matchId }),
  
  // Fancy of Match
  getMatchFancy: (matchId: string) => 
    apiCall<ApiResponse<any>>("matchFancy", "POST", { match_id: matchId }),
  
  // Live Match List
  getLiveMatches: () => apiCall<ApiResponse<LiveMatch[]>>("liveMatchList"),
  
  // Live Line Match
  getLiveMatch: (matchId: string) => 
    apiCall<ApiResponse<LiveMatch>>("liveMatch", "POST", { match_id: matchId }),
  
  // Point Table List
  getPointsTable: (seriesId: string) => 
    apiCall<ApiResponse<PointsTableEntry[]>>("pointsTable", "POST", { series_id: seriesId }),
  
  // Player List By Match Id
  getPlayersByMatchId: (matchId: string) => 
    apiCall<ApiResponse<Player[]>>("playersByMatchId", "POST", { match_id: matchId }),
  
  // Match Odd History List By Match Id
  getMatchOddHistory: (matchId: string) => 
    apiCall<ApiResponse<any>>("matchOddHistory", "POST", { match_id: matchId }),
  
  // Match Stats List By Match Id
  getMatchStats: (matchId: string) => 
    apiCall<ApiResponse<any>>("matchStats", "POST", { match_id: matchId }),
  
  // News List
  getNewsList: () => apiCall<ApiResponse<News[]>>("news"),
  
  // News details By News Id
  getNewsDetail: (newsId: string) => 
    apiCall<ApiResponse<News>>("newsDetail", "POST", { news_id: newsId }),
  
  // Commentary By Match Id
  getCommentary: (matchId: string) => 
    apiCall<ApiResponse<any>>("commentary", "POST", { match_id: matchId }),
  
  // Player ranking List By Type
  getPlayerRanking: (type: string) => 
    apiCall<ApiResponse<PlayerRanking[]>>("playerRanking", "POST", { type }),
  
  // Team ranking List By Type
  getTeamRanking: (type: string) => 
    apiCall<ApiResponse<TeamRanking[]>>("teamRanking", "POST", { type }),
  
  // New Point Table List
  getNewPointsTable: (seriesId: string) => 
    apiCall<ApiResponse<any>>("pointsNewTable", "POST", { series_id: seriesId }),
  
  // Man of Match By Match Id
  getManOfMatch: (matchId: string) => 
    apiCall<ApiResponse<Player>>("manOfMatch", "POST", { match_id: matchId }),
  
  // Recent Matches List By Series
  getRecentMatchesBySeries: (seriesId: string) => 
    apiCall<ApiResponse<Match[]>>("matchesRecentBySeriesId", "POST", { series_id: seriesId }),
};
