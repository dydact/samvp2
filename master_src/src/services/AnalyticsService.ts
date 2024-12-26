import { generateClient } from 'aws-amplify/api';
import { useState, useCallback } from 'react';

export function useAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = generateClient();

  const startAnalytics = useCallback(async (streamName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.graphql({
        query: `
          mutation StartAnalytics($input: AnalyticsInput!) {
            startAnalytics(input: $input) {
              applicationName
              status
              outputStream
            }
          }
        `,
        variables: {
          input: {
            streamName,
            analysisType: 'PATIENT_MONITORING'
          }
        }
      });

      return response.data.startAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Analytics failed to start'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    startAnalytics,
    loading,
    error
  };
} 