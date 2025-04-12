
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

interface NewsSectionProps {
  elementId?: string;
  registerRef?: (id: string, element: HTMLElement | null) => void;
  isVisible?: boolean;
}

const NewsSection = ({ 
  elementId = "news-section", 
  registerRef, 
  isVisible = false 
}: NewsSectionProps) => {
  const { data: newsList, isLoading: isLoadingNews } = useQuery({
    queryKey: ["news"],
    queryFn: () => cricketApi.getNewsList(),
  });

  return (
    <section
      id={elementId}
      ref={(el) => registerRef && registerRef(elementId, el)}
      className={`transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
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
              ref={(el) => registerRef && registerRef(`news-${news.id}`, el)}
              className={`transition-all duration-500 ${
                isVisible ? "animate-fade-in" : "opacity-0"
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
  );
};

export default NewsSection;
