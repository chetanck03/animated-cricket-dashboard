
import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const elementsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const registerRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      elementsRef.current[id] = element;
    }
  };

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

  return { visibleElements, registerRef };
}
