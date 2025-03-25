
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]),
  url: z.string().url({ message: "Please enter a valid URL" }),
  requestData: z.string().optional(),
  connections: z.number().int().min(1).max(1000),
  requestRate: z.number().int().min(1).max(10000),
  concurrency: z.number().int().min(1).max(1000),
  duration: z.number().int().min(1).max(60)
});

type FormValues = z.infer<typeof formSchema>;

interface TestConfigurationPanelProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function TestConfigurationPanel({ onSubmit, isLoading }: TestConfigurationPanelProps) {
  const [showRequestData, setShowRequestData] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "GET",
      url: "http://",
      requestData: "",
      connections: 10,
      requestRate: 100,
      concurrency: 10,
      duration: 10
    }
  });

  const watchMethod = form.watch("method");
  
  // Show request data field for POST and PUT methods
  if ((watchMethod === "POST" || watchMethod === "PUT" || watchMethod === "PATCH") && !showRequestData) {
    setShowRequestData(true);
  } else if (!(watchMethod === "POST" || watchMethod === "PUT" || watchMethod === "PATCH") && showRequestData) {
    setShowRequestData(false);
  }

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full shadow-sm animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium">Test Configuration</CardTitle>
        <CardDescription>Configure your HTTP load test parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HTTP method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/endpoint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {showRequestData && (
              <FormField
                control={form.control}
                name="requestData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Data</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder='{"key": "value"}' 
                        className="min-h-[100px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      JSON payload for POST/PUT requests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="connections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connections</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={1000}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>
                      Total connections
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Rate</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={10000}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>
                      Requests per second
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="concurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concurrency</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1} 
                        max={1000}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>
                      Concurrent requests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Duration: {field.value} seconds</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>
                    Duration of the load test (1-60 seconds)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Running Test..." : "Run Test"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
