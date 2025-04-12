
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import MatchCard from "@/components/MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface MatchesTabsSectionProps {
  elementId?: string;
  registerRef?: (id: string, element: HTMLElement | null) => void;
  isVisible?: boolean;
}

const MatchesTabsSection = ({ 
  elementId = "matches-tabs", 
  registerRef, 
  isVisible = false 
}: MatchesTabsSectionProps) => {
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["upcomingMatches"],
    queryFn: () => cricketApi.getUpcomingMatches(),
  });
  
  const { data: recentMatches, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentMatches"],
    queryFn: () => cricketApi.getRecentMatches(),
  });

  return (
    <section
      id={elementId}
      ref={(el) => registerRef && registerRef(elementId, el)}
      className={`mb-12 transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <Tabs defaultValue="upcoming">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="upcoming" className="flex items-center">
              <Clock size={16} className="mr-2" /> Upcoming
            </TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <Button variant="ghost" asChild>
            <Link to="/matches/upcoming" className="flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
        
        <TabsContent value="upcoming">
          {isLoadingUpcoming ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : upcomingMatches?.data && upcomingMatches.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingMatches.data.slice(0, 4).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No upcoming matches found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {isLoadingRecent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : recentMatches?.data && recentMatches.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentMatches.data.slice(0, 4).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No recent matches found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MatchesTabsSection;
