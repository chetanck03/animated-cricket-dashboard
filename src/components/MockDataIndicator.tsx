
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface MockDataIndicatorProps {
  className?: string;
}

const MockDataIndicator = ({ className }: MockDataIndicatorProps) => {
  return (
    <Alert variant="destructive" className={`mb-4 bg-yellow-50 border-yellow-200 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Mock Data</AlertTitle>
      <AlertDescription className="text-yellow-700">
        You are currently viewing simulated data. Real API data couldn't be loaded.
      </AlertDescription>
    </Alert>
  );
};

export default MockDataIndicator;
