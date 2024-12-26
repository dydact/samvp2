import { useState, useCallback } from 'react';
import { SecureDataAccess } from '../../../../src/utils/dataAccess';

export function useSecureData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dataAccess = new SecureDataAccess();
  
  const getPatient = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataAccess.getPatientRecord(patientId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    getPatient,
    loading,
    error
  };
} 