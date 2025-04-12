
import { Series } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMM yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle>{series.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <Calendar size={14} className="mr-2" />
          <span>
            {formatDate(series.startDate)} - {formatDate(series.endDate)}
          </span>
        </div>
        
        <div className="flex mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            series.status === "upcoming" 
              ? "bg-yellow-100 text-yellow-800" 
              : series.status === "completed" 
                ? "bg-green-100 text-green-800" 
                : "bg-blue-100 text-blue-800"
          }`}>
            {series.status}
          </span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => navigate(`/series/${series.id}`)}
        >
          <span>View Series</span>
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeriesCard;
