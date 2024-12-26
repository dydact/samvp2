// src/tests/integration/hospitalRun.test.ts
import { scheduleAppointment, accessMedicalRecord } from '../utils/testHelpers';

describe('HospitalRun Integration', () => {
  test('should schedule appointment', async () => {
    const appointment = await scheduleAppointment({
      patientId: 'test123',
      date: new Date(),
      type: 'CHECKUP'
    });
    expect(appointment.confirmed).toBe(true);
  });
});
