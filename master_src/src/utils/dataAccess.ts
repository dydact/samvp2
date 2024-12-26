import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

// Wrapper for data access with built-in logging and encryption
export class SecureDataAccess {
  private client = generateClient();
  
  async getPatientRecord(patientId: string) {
    const user = await getCurrentUser();
    
    // Log access attempt
    await this.logAccess({
      action: 'READ',
      resourceId: patientId,
      resourceType: 'Patient',
      userId: user.userId
    });
    
    // Fetch and decrypt data
    const result = await this.client.models.Patient.get(patientId);
    return this.decryptSensitiveData(result);
  }
  
  private async logAccess({ action, resourceId, resourceType, userId }: {
    action: string;
    resourceId: string;
    resourceType: string;
    userId: string;
  }) {
    return this.client.models.AccessLog.create({
      timestamp: new Date().toISOString(),
      userId,
      action,
      resourceId,
      resourceType,
      ipAddress: window.location.hostname,
      userAgent: navigator.userAgent
    });
  }
  
  private decryptSensitiveData(data: any) {
    // Implement decryption logic here
    return data;
  }
} 