
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart,
  LineChart,
  AreaChart, 
  Area, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";

export interface TestResult {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  responseTimeData: {
    time: number;
    value: number;
  }[];
  requestRateData: {
    time: number;
    value: number;
  }[];
  latencyPercentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  responseData?: any;
}

interface ResultsPanelProps {
  results: TestResult | null;
  isVisible: boolean;
}

export function ResultsPanel({ results, isVisible }: ResultsPanelProps) {
  if (!isVisible || !results) {
    return null;
  }

  const successRate = results.totalRequests 
    ? ((results.successCount / results.totalRequests) * 100).toFixed(2) 
    : "0.00";
  
  const failureRate = results.totalRequests 
    ? ((results.failureCount / results.totalRequests) * 100).toFixed(2) 
    : "0.00";

  return (
    <Card className="w-full mt-6 shadow-sm animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Requests" 
            value={results.totalRequests.toLocaleString()} 
          />
          <StatCard 
            title="Success Rate" 
            value={`${successRate}%`} 
            status={parseFloat(successRate) > 90 ? "success" : "warning"} 
          />
          <StatCard 
            title="Failure Rate" 
            value={`${failureRate}%`} 
            status={parseFloat(failureRate) < 10 ? "success" : "error"} 
          />
          <StatCard 
            title="Avg Response Time" 
            value={`${results.averageResponseTime.toFixed(2)} ms`} 
            status={results.averageResponseTime < 200 ? "success" : 
                    results.averageResponseTime < 500 ? "warning" : "error"}
          />
        </div>

        <Tabs defaultValue="graphs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="graphs">Graphs</TabsTrigger>
            <TabsTrigger value="latency">Latency Stats</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="graphs" className="space-y-6">
            <div className="h-72 w-full">
              <p className="text-sm font-medium mb-2">Response Time (ms)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.responseTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)',
                      color: 'var(--card-foreground)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Response Time" 
                    stroke="var(--primary)" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="h-72 w-full">
              <p className="text-sm font-medium mb-2">Request Rate (req/s)</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={results.requestRateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis label={{ value: 'Requests/sec', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)',
                      color: 'var(--card-foreground)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Request Rate" 
                    stroke="var(--primary)" 
                    fill="var(--primary)" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="latency">
            <div className="space-y-6">
              <div className="h-72 w-full">
                <p className="text-sm font-medium mb-2">Latency Percentiles</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'p50', value: results.latencyPercentiles.p50 },
                      { name: 'p90', value: results.latencyPercentiles.p90 },
                      { name: 'p95', value: results.latencyPercentiles.p95 },
                      { name: 'p99', value: results.latencyPercentiles.p99 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)',
                        color: 'var(--card-foreground)'
                      }}
                      formatter={(value) => [`${value} ms`, 'Latency']}
                    />
                    <Bar dataKey="value" name="Latency" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="p50 Latency" value={`${results.latencyPercentiles.p50.toFixed(2)} ms`} />
                <StatCard title="p90 Latency" value={`${results.latencyPercentiles.p90.toFixed(2)} ms`} />
                <StatCard title="p95 Latency" value={`${results.latencyPercentiles.p95.toFixed(2)} ms`} />
                <StatCard title="p99 Latency" value={`${results.latencyPercentiles.p99.toFixed(2)} ms`} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="response">
            <Card>
              <CardContent className="p-4">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <pre className="font-mono text-sm">
                    {results.responseData 
                      ? JSON.stringify(results.responseData, null, 2) 
                      : "No response data available"}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  status?: "success" | "warning" | "error" | "default";
}

function StatCard({ title, value, status = "default" }: StatCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "text-green-600 dark:text-green-400";
      case "warning": return "text-amber-600 dark:text-amber-400";
      case "error": return "text-red-600 dark:text-red-400";
      default: return "text-primary";
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className={`text-2xl font-semibold ${getStatusColor()}`}>{value}</p>
      <Separator className="mt-2" />
    </div>
  );
}
