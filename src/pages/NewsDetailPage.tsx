
import { useQuery } from "@tanstack/react-query";
import { cricketApi } from "@/services/apiService";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NewsDetailPage = () => {
  const { newsId = "" } = useParams<{ newsId: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["newsDetail", newsId],
    queryFn: () => cricketApi.getNewsDetail(newsId),
    enabled: !!newsId,
  });
  
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy");
    } catch (error) {
      return dateStr;
    }
  };
  
  if (error) {
    console.error("Error fetching news detail:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load news details. Please try again later.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/news">Back to News</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/news" className="flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to News
        </Link>
      </Button>
      
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ) : data?.data ? (
        <div className="animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {data.data.title}
          </h1>
          
          <div className="flex items-center mb-8 text-muted-foreground">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(data.data.date)}</span>
            {data.data.source && (
              <span className="ml-3">• {data.data.source}</span>
            )}
          </div>
          
          {data.data.image_url && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img 
                src={data.data.image_url} 
                alt={data.data.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <Card>
            <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
              {data.data.content ? (
                <div dangerouslySetInnerHTML={{ __html: data.data.content }} />
              ) : (
                <p>{data.data.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">News article not found</h3>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/news">Browse All News</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
