
import { useQuery } from "@tanstack/react-query";
import { cricketApi, apiState } from "@/services/apiService";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import MockDataIndicator from "@/components/MockDataIndicator";

type MatchType = "upcoming" | "recent";

const MatchListPage = () => {
  const { type = "upcoming" } = useParams<{ type: MatchType }>();
  const navigate = useNavigate();
  
  const fetchFunction = type === "recent" 
    ? cricketApi.getRecentMatches 
    : cricketApi.getUpcomingMatches;
  
  const { data, isLoading, error } = useQuery({
    queryKey: [type === "recent" ? "recentMatches" : "upcomingMatches"],
    queryFn: fetchFunction,
  });
  
  const handleMatchClick = (matchId: string) => {
    navigate(`/match/${matchId}`);
  };
  
  const title = type === "recent" ? "Recent Matches" : "Upcoming Matches";
  
  if (error) {
    console.error(`Error fetching ${type} matches:`, error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load matches. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {apiState.usingMockData && (
        <MockDataIndicator />
      )}
      
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <div className="p-4 space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((match, index) => (
            <div 
              key={match.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index % 9 * 50}ms` }}
            >
              <MatchCard 
                match={match} 
                onClick={() => handleMatchClick(match.id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No {type} matches found</h3>
          <p className="text-muted-foreground">
            {type === "upcoming" 
              ? "Check back later for upcoming matches" 
              : "There are no recent matches to display"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchListPage;
