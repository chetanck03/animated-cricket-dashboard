
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import LiveScoreCard from "@/components/LiveScoreCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LiveMatchesSectionProps {
  elementId?: string;
  registerRef?: (id: string, element: HTMLElement | null) => void;
  isVisible?: boolean;
}

const LiveMatchesSection = ({ 
  elementId, 
  registerRef, 
  isVisible = true 
}: LiveMatchesSectionProps) => {
  const { data: liveMatches, isLoading: isLoadingLive } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: () => cricketApi.getLiveMatches(),
    refetchInterval: 30000,
  });

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Live Matches</h2>
        <Button variant="ghost" asChild>
          <Link to="/matches/live" className="flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
      </div>
      
      {isLoadingLive ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
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
      ) : liveMatches?.data && liveMatches.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.data.slice(0, 3).map((match, index) => (
            <div
              key={match.id}
              id={`live-${match.id}`}
              ref={(el) => registerRef && registerRef(`live-${match.id}`, el)}
              className={`transition-all duration-500 ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <LiveScoreCard match={match} isHighlighted={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No live matches currently</p>
        </div>
      )}
    </section>
  );
};

export default LiveMatchesSection;
