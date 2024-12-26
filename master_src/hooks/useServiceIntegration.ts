import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { serviceConfig } from '../config/serviceIntegration';
import { useAuth } from './useAuth.ts';
import { CallExternalServiceMutation } from '../API';

export function useServiceIntegration(serviceName: keyof typeof serviceConfig) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const client = generateClient();

  const callService = useCallback(async (
    feature: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      const config = serviceConfig[serviceName];
      if (!config.features.includes(feature)) {
        throw new Error(`Feature ${feature} not supported by ${String(serviceName)}`);
      }

      // Call the service through AWS AppSync
      const response = await client.graphql<CallExternalServiceMutation>({
        query: `
          mutation CallExternalService($input: ServiceCallInput!) {
            callExternalService(input: $input) {
              success
              data
              error
            }
          }
        `,
        variables: {
          input: {
            service: serviceName,
            feature,
            method,
            data,
            organizationId: user?.organizationId
          }
        }
      });

      return response.data.callExternalService;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceName, user]);

  return {
    callService,
    loading,
    error
  };
} 