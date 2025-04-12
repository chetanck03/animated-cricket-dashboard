
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import LiveScoreCard from "@/components/LiveScoreCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

const LiveMatches = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: () => cricketApi.getLiveMatches(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  useEffect(() => {
    if (!isLoading) {
      setLastUpdate(new Date());
    }
  }, [data, isLoading]);
  
  const handleManualRefresh = async () => {
    await refetch();
    toast.success("Scores updated successfully");
  };
  
  if (error) {
    console.error("Error fetching live matches:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load live matches. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Live Matches</h1>
        
        <div className="text-sm text-muted-foreground flex flex-col items-end">
          <button 
            onClick={handleManualRefresh}
            className="text-cricket-accent hover:underline mb-1"
          >
            Refresh Scores
          </button>
          <div>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((match, index) => (
            <div 
              key={match.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LiveScoreCard match={match} isHighlighted={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No live matches currently</h3>
          <p className="text-muted-foreground">Check back later for upcoming matches</p>
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
