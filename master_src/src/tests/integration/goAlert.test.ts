// src/tests/integration/goAlert.test.ts
import { generateAlert, verifyNotification } from '../utils/testHelpers';

describe('GoAlert Integration', () => {
  test('should generate real-time alert', async () => {
    const alert = await generateAlert({
      type: 'EMERGENCY',
      patientId: 'test123',
      severity: 'HIGH'
    });
    expect(alert.status).toBe('ACTIVE');
  });

  test('should deliver notification', async () => {
    const notification = await verifyNotification('test123');
    expect(notification.delivered).toBe(true);
  });
});
