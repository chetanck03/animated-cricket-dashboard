
import { News } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  news: News;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMM yyyy");
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in h-full flex flex-col">
      {news.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={news.image_url} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg line-clamp-2">{news.title}</h3>
        <div className="flex items-center text-muted-foreground text-xs">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(news.date)}</span>
          {news.source && (
            <span className="ml-2">• {news.source}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {news.description}
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate(`/news/${news.id}`)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
