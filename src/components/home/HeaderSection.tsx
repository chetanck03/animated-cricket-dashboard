
interface HeaderSectionProps {
  elementId?: string;
  registerRef?: (id: string, element: HTMLElement | null) => void;
  isVisible?: boolean;
}

const HeaderSection = ({ 
  elementId = "header", 
  registerRef, 
  isVisible = false 
}: HeaderSectionProps) => {
  return (
    <div
      id={elementId}
      ref={(el) => registerRef && registerRef(elementId, el)}
      className={`relative overflow-hidden mb-8 p-8 rounded-lg cricket-gradient ${
        isVisible ? "animate-scale-in" : "opacity-0"
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
  );
};

export default HeaderSection;
