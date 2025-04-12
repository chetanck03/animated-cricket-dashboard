
import { ApiResponse, LiveMatch, Match, News, Player, PointsTableEntry, PlayerRanking, Scorecard, Series, TeamRanking } from "@/lib/types";

// SportsMonk Cricket API configuration
const API_KEY = "1cinxO4bHhLLU63DJGlxtiPZLxEmdkVRUaN83FvAS9Fnn57ZeHxbqQxIBG0r";
const BASE_URL = "https://cricket.sportmonks.com/api/v2.0";

// Helper function for API calls
async function apiCall<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Add API key to all requests
  params.api_token = API_KEY;
  
  // Build query string
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/${endpoint}?${queryString}`;
  
  try {
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`API response for ${endpoint}:`, result);
    
    return result as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Adapter functions to convert SportsMonk response to our app's data model
const adaptSeries = (data: any): Series[] => {
  if (!data || !data.data) return [];
  
  return data.data.map((item: any) => ({
    id: item.id.toString(),
    name: item.name,
    short_name: item.code || item.name.substring(0, 10),
    status: item.status || "ongoing",
    season: item.season?.name || "",
    startDate: item.updated_at || "",
    endDate: item.updated_at || "",
  }));
};

const adaptMatches = (data: any): Match[] => {
  if (!data || !data.data) return [];
  
  return data.data.map((item: any) => {
    const homeTeam = item.localteam || {};
    const awayTeam = item.visitorteam || {};
    
    return {
      id: item.id.toString(),
      name: item.name || `${homeTeam.name} vs ${awayTeam.name}`,
      short_name: item.code || `${homeTeam.code} vs ${awayTeam.code}`,
      status: item.status || "upcoming",
      venue: item.venue?.name || "",
      date: item.starting_at || "",
      dateTimeGMT: item.starting_at || "",
      teams: {
        home: {
          id: homeTeam.id?.toString() || "",
          name: homeTeam.name || "Home Team",
          short_name: homeTeam.code || "HOME",
          logo_url: homeTeam.image_path || "",
        },
        away: {
          id: awayTeam.id?.toString() || "",
          name: awayTeam.name || "Away Team",
          short_name: awayTeam.code || "AWAY",
          logo_url: awayTeam.image_path || "",
        },
      },
      result: item.note || "",
      toss: item.toss_won_team_id ? {
        winner: item.toss_won_team_id === homeTeam.id ? homeTeam.name : awayTeam.name,
        decision: item.elected || "unknown",
      } : undefined,
      series_id: item.league_id?.toString() || "",
      series_name: item.league?.name || "",
    };
  });
};

const adaptLiveMatches = (data: any): LiveMatch[] => {
  if (!data || !data.data) return [];
  
  return data.data.map((item: any) => {
    const match = adaptMatches({ data: [item] })[0];
    const runs = item.runs || [];
    const homeRuns = runs.find((r: any) => r.team_id === item.localteam_id);
    const awayRuns = runs.find((r: any) => r.team_id === item.visitorteam_id);
    
    return {
      ...match,
      score: {
        batting: {
          team: match.teams.home.name,
          runs: homeRuns?.score || 0,
          wickets: homeRuns?.wickets || 0,
          overs: homeRuns?.overs || 0,
        },
        bowling: {
          team: match.teams.away.name,
          runs: awayRuns?.score,
          wickets: awayRuns?.wickets,
          overs: awayRuns?.overs,
        },
      },
      current_status: item.note || "In Progress",
    };
  });
};

const adaptNews = (data: any): News[] => {
  if (!data || !data.data || !Array.isArray(data.data)) {
    // For testing, generate mock news when no data is available
    return Array(6).fill(0).map((_, i) => ({
      id: `news-${i}`,
      title: `Latest Cricket News Update ${i+1}`,
      description: "A major update from the world of cricket featuring the latest matches, player updates, and tournament news.",
      content: "Extended content with full details about the cricket news story.",
      image_url: `https://source.unsplash.com/random/800x450/?cricket,${i}`,
      date: new Date().toISOString(),
      source: "SportsMonk Cricket",
    }));
  }
  
  return data.data.map((item: any) => ({
    id: item.id.toString(),
    title: item.title || "Cricket News Update",
    description: item.description || "Latest cricket news",
    content: item.content || item.description,
    image_url: item.image || `https://source.unsplash.com/random/800x450/?cricket`,
    date: item.updated_at || new Date().toISOString(),
    source: "SportsMonk Cricket",
  }));
};

// API functions corresponding to the SportsMonk endpoints
export const cricketApi = {
  // Series List
  getSeriesList: async () => {
    const data = await apiCall("leagues", { include: "season" });
    return {
      status: true,
      message: "Success",
      data: adaptSeries(data)
    } as ApiResponse<Series[]>;
  },
  
  // Upcoming Matches
  getUpcomingMatches: async () => {
    const data = await apiCall("fixtures", { 
      filter: "fixtures.status:NS", 
      include: "localteam,visitorteam,venue,league", 
      sort: "starting_at"
    });
    return {
      status: true,
      message: "Success",
      data: adaptMatches(data)
    } as ApiResponse<Match[]>;
  },
  
  // Recent Matches
  getRecentMatches: async () => {
    const data = await apiCall("fixtures", { 
      filter: "fixtures.status:Finished", 
      include: "localteam,visitorteam,venue,league", 
      sort: "-starting_at" 
    });
    return {
      status: true,
      message: "Success",
      data: adaptMatches(data)
    } as ApiResponse<Match[]>;
  },
  
  // Live Matches
  getLiveMatches: async () => {
    const data = await apiCall("livescores", { 
      include: "localteam,visitorteam,venue,league,runs" 
    });
    return {
      status: true,
      message: "Success",
      data: adaptLiveMatches(data)
    } as ApiResponse<LiveMatch[]>;
  },
  
  // Match Information
  getMatchInfo: async (matchId: string) => {
    const data = await apiCall(`fixtures/${matchId}`, { 
      include: "localteam,visitorteam,venue,league,runs" 
    });
    const matches = adaptMatches({ data: [data.data] });
    return {
      status: true,
      message: "Success",
      data: matches.length > 0 ? matches[0] : null
    } as ApiResponse<Match>;
  },
  
  // Live Match
  getLiveMatch: async (matchId: string) => {
    const data = await apiCall(`fixtures/${matchId}`, { 
      include: "localteam,visitorteam,venue,league,runs" 
    });
    const matches = adaptLiveMatches({ data: [data.data] });
    return {
      status: true,
      message: "Success",
      data: matches.length > 0 ? matches[0] : null
    } as ApiResponse<LiveMatch>;
  },
  
  // News List (using mock data as SportsMonk may not have a direct news API)
  getNewsList: async () => {
    // Try to fetch news, or generate mock data
    try {
      const data = await apiCall("news");
      return {
        status: true,
        message: "Success",
        data: adaptNews(data)
      } as ApiResponse<News[]>;
    } catch (error) {
      console.log("Using mock news data");
      return {
        status: true,
        message: "Success",
        data: adaptNews({ data: [] }) // This will generate mock news
      } as ApiResponse<News[]>;
    }
  },
  
  // News details
  getNewsDetail: async (newsId: string) => {
    // Try to fetch specific news, or generate mock data
    try {
      const data = await apiCall(`news/${newsId}`);
      const newsItems = adaptNews({ data: [data.data] });
      return {
        status: true,
        message: "Success",
        data: newsItems.length > 0 ? newsItems[0] : null
      } as ApiResponse<News>;
    } catch (error) {
      // Generate a mock news item with the given id
      const mockNews: News = {
        id: newsId,
        title: `Cricket News Article ${newsId}`,
        description: "This is a detailed cricket news article featuring the latest updates from matches and players around the world.",
        content: `<p>This is a detailed cricket news article featuring the latest updates from matches and players around the world.</p>
                 <p>Cricket fans are eagerly watching as the tournament progresses, with several exciting matches scheduled for the coming weeks.</p>
                 <p>Player statistics have shown interesting trends this season, with bowlers dominating in several key fixtures.</p>`,
        image_url: `https://source.unsplash.com/random/800x450/?cricket`,
        date: new Date().toISOString(),
        source: "SportsMonk Cricket",
      };
      
      return {
        status: true,
        message: "Success",
        data: mockNews
      } as ApiResponse<News>;
    }
  },
  
  // For remaining endpoints, we'll implement methods that return mock data
  // but are structured to match the expected types
  
  getUpcomingMatchesBySeries: (seriesId: string) => {
    console.log(`Mock data for upcoming matches by series ${seriesId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as Match[]
    }) as Promise<ApiResponse<Match[]>>;
  },
  
  getScorecardByMatchId: (matchId: string) => {
    console.log(`Mock data for scorecard of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: { match_id: matchId, innings: [] } as Scorecard
    }) as Promise<ApiResponse<Scorecard>>;
  },
  
  getSquadByMatchId: (matchId: string) => {
    console.log(`Mock data for squad of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as Player[]
    }) as Promise<ApiResponse<Player[]>>;
  },
  
  getMatchFancy: (matchId: string) => {
    console.log(`Mock data for fancy of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
  
  getPointsTable: (seriesId: string) => {
    console.log(`Mock data for points table of series ${seriesId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as PointsTableEntry[]
    }) as Promise<ApiResponse<PointsTableEntry[]>>;
  },
  
  getPlayersByMatchId: (matchId: string) => {
    console.log(`Mock data for players of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as Player[]
    }) as Promise<ApiResponse<Player[]>>;
  },
  
  getMatchOddHistory: (matchId: string) => {
    console.log(`Mock data for odd history of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
  
  getMatchStats: (matchId: string) => {
    console.log(`Mock data for stats of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
  
  getCommentary: (matchId: string) => {
    console.log(`Mock data for commentary of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
  
  getPlayerRanking: (type: string) => {
    console.log(`Mock data for player ranking of type ${type}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as PlayerRanking[]
    }) as Promise<ApiResponse<PlayerRanking[]>>;
  },
  
  getTeamRanking: (type: string) => {
    console.log(`Mock data for team ranking of type ${type}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as TeamRanking[]
    }) as Promise<ApiResponse<TeamRanking[]>>;
  },
  
  getNewPointsTable: (seriesId: string) => {
    console.log(`Mock data for new points table of series ${seriesId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
  
  getManOfMatch: (matchId: string) => {
    console.log(`Mock data for man of match ${matchId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {} as Player
    }) as Promise<ApiResponse<Player>>;
  },
  
  getRecentMatchesBySeries: (seriesId: string) => {
    console.log(`Mock data for recent matches by series ${seriesId}`);
    return Promise.resolve({
      status: true,
      message: "Success",
      data: [] as Match[]
    }) as Promise<ApiResponse<Match[]>>;
  },
  
  // Home List (generic endpoint)
  getHomeList: () => {
    console.log("Mock data for home list");
    return Promise.resolve({
      status: true,
      message: "Success",
      data: {}
    }) as Promise<ApiResponse<any>>;
  },
};
