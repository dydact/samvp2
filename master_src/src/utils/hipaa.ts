import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

export const createAccessLog = async (
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
  resourceId: string,
  resourceType: string
) => {
  const client = generateClient();
  const user = await getCurrentUser();
  
  return client.models.AccessLog.create({
    timestamp: new Date().toISOString(),
    userId: user.userId,
    action,
    resourceId,
    resourceType,
    ipAddress: window.location.hostname,
    userAgent: navigator.userAgent
  });
};

export const validateHIPAACompliance = (data: any) => {
  const requiredFields = ['lastModified', 'modifiedBy', 'accessHistory'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required HIPAA fields: ${missingFields.join(', ')}`);
  }
  
  return true;
}; 