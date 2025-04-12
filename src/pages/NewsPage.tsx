
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import NewsCard from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

const NewsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: () => cricketApi.getNewsList(),
  });
  
  if (error) {
    console.error("Error fetching news:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load news. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cricket News</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, i) => (
            <Card key={i} className="h-96">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((news, index) => (
            <div 
              key={news.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index % 9 * 50}ms` }}
            >
              <NewsCard news={news} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No news available</h3>
          <p className="text-muted-foreground">Check back later for cricket news updates</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
