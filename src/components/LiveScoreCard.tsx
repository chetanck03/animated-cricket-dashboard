
import { LiveMatch } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface LiveScoreCardProps {
  match: LiveMatch;
  isHighlighted?: boolean;
}

const LiveScoreCard = ({ match, isHighlighted = false }: LiveScoreCardProps) => {
  const getTeamScore = (team: string) => {
    if (!match.score) return null;
    
    if (match.score.batting.team === team) {
      return {
        runs: match.score.batting.runs,
        wickets: match.score.batting.wickets,
        overs: match.score.batting.overs,
        batting: true
      };
    } else if (match.score.bowling.team === team && match.score.bowling.runs !== undefined) {
      return {
        runs: match.score.bowling.runs,
        wickets: match.score.bowling.wickets,
        overs: match.score.bowling.overs,
        batting: false
      };
    }
    return null;
  };
  
  const homeTeamScore = getTeamScore(match.teams.home.name);
  const awayTeamScore = getTeamScore(match.teams.away.name);
  
  const getScoreString = (score: { runs?: number; wickets?: number; overs?: number } | null) => {
    if (!score) return "Yet to bat";
    return `${score.runs}/${score.wickets} (${score.overs} ov)`;
  };

  const getMatchTime = () => {
    try {
      return formatDistanceToNow(parseISO(match.dateTimeGMT), { addSuffix: true });
    } catch (error) {
      return match.date || "Unknown date";
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 animate-fade-in ${
      isHighlighted ? "ring-2 ring-cricket-accent shadow-lg border-cricket-accent" : ""
    }`}>
      <CardHeader className="cricket-gradient text-white p-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm md:text-base">{match.short_name || match.name}</CardTitle>
          {match.status === "live" && (
            <span className="flex items-center text-xs bg-white/20 px-2 py-1 rounded-full">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs mt-1 text-white/80">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{getMatchTime()}</span>
          </div>
          {match.venue && (
            <div className="flex items-center">
              <MapPin size={12} className="mr-1" />
              <span>{match.venue}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3 overflow-hidden">
              {match.teams.home.logo_url ? (
                <img 
                  src={match.teams.home.logo_url} 
                  alt={match.teams.home.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="font-bold text-xs">{match.teams.home.short_name?.substring(0, 2) || match.teams.home.name.substring(0, 2)}</span>
              )}
            </div>
            <span className="font-medium">{match.teams.home.name}</span>
          </div>
          <div className={`text-right font-semibold ${homeTeamScore?.batting ? 'text-cricket-accent' : ''}`}>
            {getScoreString(homeTeamScore)}
          </div>
        </div>
        
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3 overflow-hidden">
              {match.teams.away.logo_url ? (
                <img 
                  src={match.teams.away.logo_url} 
                  alt={match.teams.away.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="font-bold text-xs">{match.teams.away.short_name?.substring(0, 2) || match.teams.away.name.substring(0, 2)}</span>
              )}
            </div>
            <span className="font-medium">{match.teams.away.name}</span>
          </div>
          <div className={`text-right font-semibold ${awayTeamScore?.batting ? 'text-cricket-accent' : ''}`}>
            {getScoreString(awayTeamScore)}
          </div>
        </div>
        
        {/* Match status */}
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {match.status === "completed" ? (
                <Trophy size={14} className="mr-1 text-cricket-secondary" />
              ) : (
                <Clock size={14} className="mr-1" />
              )}
              <span>{match.current_status || match.status}</span>
            </div>
            {match.toss && (
              <span className="text-xs">
                Toss: {match.toss.winner}, {match.toss.decision}
              </span>
            )}
          </div>
        </div>
        
        {match.status === "live" && (
          <Progress value={Math.random() * 100} className="h-1 bg-gray-200" />
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoreCard;
