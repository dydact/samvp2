// src/tests/integration/healthcareCRM.test.ts
import { createPatient, assignProvider } from '../utils/testHelpers';

describe('Healthcare-CRM Integration', () => {
  test('should create patient record', async () => {
    const patient = await createPatient({
      name: 'John Doe',
      age: 65,
      conditions: ['diabetes']
    });
    expect(patient.id).toBeDefined();
  });
});
