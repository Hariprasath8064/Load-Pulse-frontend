
import { Progress } from "@/components/ui/progress";

interface LoadProgressIndicatorProps {
  isLoading: boolean;
  progress: number; // 0-100
  timeRemaining: number; // in seconds
}

export function LoadProgressIndicator({ 
  isLoading, 
  progress, 
  timeRemaining 
}: LoadProgressIndicatorProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="w-full mt-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Test in progress
        </span>
        <span className="text-sm text-muted-foreground">
          {timeRemaining > 0 ? `${timeRemaining}s remaining` : "Finalizing..."}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
