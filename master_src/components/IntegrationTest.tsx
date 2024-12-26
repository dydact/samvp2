import React, { useEffect, useState } from 'react';
import { useServiceIntegration } from '../hooks/useServiceIntegration';
import { testConfig } from '../config/integrationTest';

export function IntegrationTest() {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hospitalRun = useServiceIntegration('hospitalRun');
  const healthcareCRM = useServiceIntegration('healthcareCRM');
  const goalert = useServiceIntegration('goalert');

  useEffect(() => {
    async function runTests() {
      try {
        const testResults: Record<string, boolean> = {};

        // Test HospitalRun integration
        const hospitalRunResult = await hospitalRun.callService(
          'appointments',
          'GET'
        );
        testResults.hospitalRun = hospitalRunResult.success;

        // Test HealthcareCRM integration
        const crmResult = await healthcareCRM.callService(
          'medical-records',
          'GET'
        );
        testResults.healthcareCRM = crmResult.success;

        // Test GoAlert integration
        const alertResult = await goalert.callService(
          'alerts',
          'GET'
        );
        testResults.goalert = alertResult.success;

        setResults(testResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    runTests();
  }, []);

  if (loading) return <div>Running integration tests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="integration-test" data-testid="integration-test">
      <h2>Integration Test Results</h2>
      {Object.entries(results).map(([service, success]) => (
        <div 
          key={service} 
          className={`test-result ${success ? 'success' : 'failure'}`}
          data-testid={`service-${service}`}
        >
          <span>{service}: {success ? 'Connected' : 'Failed'}</span>
        </div>
      ))}
    </div>
  );
} 