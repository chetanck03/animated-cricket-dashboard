
import { Match } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

const MatchCard = ({ match, onClick }: MatchCardProps) => {
  const getMatchTime = () => {
    try {
      const date = parseISO(match.dateTimeGMT);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return match.date || "Unknown date";
    }
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-all duration-300 animate-fade-in cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader className="bg-muted p-3 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{match.series_name || "Cricket Match"}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            match.status === "upcoming" 
              ? "bg-yellow-100 text-yellow-800" 
              : match.status === "completed" 
                ? "bg-green-100 text-green-800" 
                : "bg-blue-100 text-blue-800"
          }`}>
            {match.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-xs">
                {match.teams.home.short_name?.substring(0, 2) || match.teams.home.name.substring(0, 2)}
              </span>
            </div>
            <span className="font-medium">{match.teams.home.name}</span>
          </div>
          <span className="mx-2 text-muted-foreground">vs</span>
          <div className="flex items-center justify-end">
            <span className="font-medium">{match.teams.away.name}</span>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center ml-3">
              <span className="font-bold text-xs">
                {match.teams.away.short_name?.substring(0, 2) || match.teams.away.name.substring(0, 2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{getMatchTime()}</span>
          </div>
          {match.venue && (
            <div className="flex items-center justify-end">
              <MapPin size={12} className="mr-1" />
              <span>{match.venue}</span>
            </div>
          )}
        </div>
        
        {match.result && (
          <div className="mt-2 text-sm font-medium pt-2 border-t">
            {match.result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
