import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import LiveScoreCard from "@/components/LiveScoreCard";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const Home = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const elementsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const { data: liveMatches, isLoading: isLoadingLive } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: () => cricketApi.getLiveMatches(),
    refetchInterval: 30000,
  });
  
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["upcomingMatches"],
    queryFn: () => cricketApi.getUpcomingMatches(),
  });
  
  const { data: recentMatches, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentMatches"],
    queryFn: () => cricketApi.getRecentMatches(),
  });
  
  const { data: newsList, isLoading: isLoadingNews } = useQuery({
    queryKey: ["news"],
    queryFn: () => cricketApi.getNewsList(),
  });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    Object.entries(elementsRef.current).forEach(([id, element]) => {
      if (element) observer.observe(element);
    });
    
    return () => {
      Object.values(elementsRef.current).forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        id="header"
        ref={(el) => (elementsRef.current["header"] = el)}
        className={`relative overflow-hidden mb-8 p-8 rounded-lg cricket-gradient ${
          visibleElements.has("header") ? "animate-scale-in" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1000x300/?cricket,stadium')] opacity-20 bg-center bg-cover"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-2">Cricket Dashboard</h1>
          <p className="text-xl opacity-90">
            Live scores, stats, and updates from all cricket matches
          </p>
        </div>
      </div>
      
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
                ref={(el) => (elementsRef.current[`live-${match.id}`] = el)}
                className={`transition-all duration-500 ${
                  visibleElements.has(`live-${match.id}`) ? "animate-fade-in" : "opacity-0"
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
      
      <section
        id="matches-tabs"
        ref={(el) => (elementsRef.current["matches-tabs"] = el)}
        className={`mb-12 transition-all duration-500 ${
          visibleElements.has("matches-tabs") ? "animate-fade-in" : "opacity-0"
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
      
      <section
        id="news-section"
        ref={(el) => (elementsRef.current["news-section"] = el)}
        className={`transition-all duration-500 ${
          visibleElements.has("news-section") ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Newspaper size={24} className="mr-2" /> Cricket News
          </h2>
          <Button variant="ghost" asChild>
            <Link to="/news" className="flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
        
        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <div className="p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              </Card>
            ))}
          </div>
        ) : newsList?.data && newsList.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.data.slice(0, 3).map((news, index) => (
              <div
                key={news.id}
                id={`news-${news.id}`}
                ref={(el) => (elementsRef.current[`news-${news.id}`] = el)}
                className={`transition-all duration-500 ${
                  visibleElements.has(`news-${news.id}`) ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No news available</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
