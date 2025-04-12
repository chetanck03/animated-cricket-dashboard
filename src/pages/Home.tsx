
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import HeaderSection from "@/components/home/HeaderSection";
import LiveMatchesSection from "@/components/home/LiveMatchesSection";
import MatchesTabsSection from "@/components/home/MatchesTabsSection";
import NewsSection from "@/components/home/NewsSection";

const Home = () => {
  const { visibleElements, registerRef } = useIntersectionObserver();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderSection 
        registerRef={registerRef}
        isVisible={visibleElements.has("header")}
      />
      
      <LiveMatchesSection 
        elementId="live-matches"
        registerRef={registerRef}
        isVisible={visibleElements.has("live-matches")}
      />
      
      <MatchesTabsSection 
        registerRef={registerRef}
        isVisible={visibleElements.has("matches-tabs")}
      />
      
      <NewsSection 
        registerRef={registerRef}
        isVisible={visibleElements.has("news-section")}
      />
    </div>
  );
};

export default Home;
