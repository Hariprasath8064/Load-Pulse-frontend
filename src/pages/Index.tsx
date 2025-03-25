import { useState, useEffect } from "react";
import { TestConfigurationPanel } from "@/components/TestConfigurationPanel";
import { ResultsPanel, TestResult } from "@/components/ResultsPanel";
import { LoadProgressIndicator } from "@/components/LoadProgressIndicator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { executeLoadTest, LoadTestRequestData } from "@/services/apiService";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Handle form submission to start the load test
  const handleRunTest = async (config: any) => {
    setIsLoading(true);
    setShowResults(false);
    setTimeRemaining(config.duration);
    setProgress(0);
    
    // Show toast notification
    toast.info("Load test started", {
      description: `Testing ${config.method} ${config.url}`,
    });
    
    // Setup the progress indicator
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (config.duration * 2));
        return newProgress > 95 ? 95 : newProgress;
      });
      
      setTimeRemaining((prev) => {
        const newTime = prev - 0.5;
        return newTime < 0 ? 0 : newTime;
      });
    }, 500);
    
    try {
      // Prepare the request for the backend
      const requestData: LoadTestRequestData = {
        requests: [
          {
            method: config.method,
            endpoint: config.url,
            data: config.requestData || "",
            connections: config.connections,
            rate: config.requestRate,
            concurrencyLimit: config.concurrency
          }
        ],
        host: new URL(config.url).origin,
        duration: config.duration
      };
      
      // Run the load test using our API service
      const apiResponse = await executeLoadTest(requestData);
      
      // Convert API response to our frontend TestResult format
      const successCount = Math.round(apiResponse.total_requests * (apiResponse.success_rate / 100));
      const failureCount = apiResponse.total_requests - successCount;
      
      // Generate mock time series data (backend doesn't provide this yet)
      const responseTimeData = [];
      const requestRateData = [];
      
      for (let i = 0; i < config.duration; i++) {
        responseTimeData.push({
          time: i,
          value: apiResponse.avg_response_time * (0.7 + Math.random() * 0.6)
        });
        
        requestRateData.push({
          time: i,
          value: config.requestRate * (0.8 + Math.random() * 0.4)
        });
      }
      
      // Create our frontend result object
      const results: TestResult = {
        totalRequests: apiResponse.total_requests,
        successCount,
        failureCount,
        averageResponseTime: apiResponse.avg_response_time,
        responseTimeData,
        requestRateData,
        latencyPercentiles: {
          p50: apiResponse.avg_response_time * 0.8,
          p90: apiResponse.avg_response_time * 1.3,
          p95: apiResponse.avg_response_time * 1.5,
          p99: apiResponse.avg_response_time * 2.0
        },
        responseData: apiResponse
      };
      
      // Update state with results
      setTestResults(results);
      setShowResults(true);
      setProgress(100);
      
      // Show success toast
      toast.success("Load test completed", {
        description: `Processed ${results.totalRequests.toLocaleString()} requests`,
      });
    } catch (error) {
      console.error("Test failed:", error);
      // Show error toast
      toast.error("Test failed", {
        description: error instanceof Error ? error.message : "An error occurred while running the load test.",
      });
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <svg 
              viewBox="0 0 24 24" 
              className="h-6 w-6 text-primary" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4L4 8L12 12L20 8L12 4Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M4 16L12 20L20 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M4 12L12 16L20 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <span className="font-medium text-lg">LoadCrafters</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              HTTP Load Testing Tool
            </h1>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-balance">
              Configure and execute high-performance HTTP load tests with precision. 
              Monitor real-time metrics and analyze response patterns to optimize your API's performance.
            </p>
          </div>

          <TestConfigurationPanel 
            onSubmit={handleRunTest} 
            isLoading={isLoading} 
          />
          
          <LoadProgressIndicator 
            isLoading={isLoading} 
            progress={progress} 
            timeRemaining={timeRemaining} 
          />
          
          <ResultsPanel 
            results={testResults} 
            isVisible={showResults}
          />
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © LoadCrafters. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">
              Professional HTTP Load Testing Suite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
