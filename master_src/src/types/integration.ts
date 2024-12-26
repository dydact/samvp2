export interface IntegrationConfig {
  [key: string]: {
    enabled: boolean;
    baseUrl: string;
    features: string[];
  };
}

export interface TestResult {
  service: string;
  success: boolean;
  error?: string;
  features: {
    name: string;
    status: 'success' | 'failure' | 'pending';
  }[];
} 