
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { apiState } from "@/services/apiService";
import HeaderSection from "@/components/home/HeaderSection";
import LiveMatchesSection from "@/components/home/LiveMatchesSection";
import MatchesTabsSection from "@/components/home/MatchesTabsSection";
import NewsSection from "@/components/home/NewsSection";
import MockDataIndicator from "@/components/MockDataIndicator";

const Home = () => {
  const { visibleElements, registerRef } = useIntersectionObserver();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {apiState.usingMockData && (
        <MockDataIndicator />
      )}
      
      <HeaderSection 
        registerRef={registerRef}
        isVisible={visibleElements.has("header")}
      />
      
      <LiveMatchesSection 
        elementId="live-matches"
        registerRef={registerRef}
        isVisible={true} // Always set to visible to ensure content appears
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
