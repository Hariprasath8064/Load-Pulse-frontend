
// API service for communicating with the Go backend

export interface LoadTestRequestData {
  requests: {
    method: string;
    endpoint: string;
    data: string;
    connections: number;
    rate: number;
    concurrencyLimit: number;
  }[];
  host: string;
  duration: number;
}

export interface LoadTestResponse {
  total_requests: number;
  success_rate: number;
  failure_rate: number;
  avg_response_time: number;
}

// The base URL for the API - adjust this to match your backend deployment
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Execute a load test by sending the configuration to the backend
 */
export const executeLoadTest = async (config: LoadTestRequestData): Promise<LoadTestResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/run-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to execute load test");
    }

    return await response.json();
  } catch (error) {
    console.error("Load test execution failed:", error);
    throw error;
  }
};
