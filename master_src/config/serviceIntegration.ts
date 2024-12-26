import { ServiceConfig } from '../../../../src/types/integration';

export const serviceConfig: ServiceConfig = {
  hospitalRun: {
    baseUrl: process.env.HOSPITAL_RUN_API_URL,
    serviceName: 'HospitalRun',
    features: ['appointments', 'patients', 'inventory']
  },
  goAlert: {
    baseUrl: process.env.GOALERT_API_URL,
    serviceName: 'GoAlert',
    features: ['alerts', 'escalations', 'schedules']
  },
  healthcareCRM: {
    baseUrl: process.env.HEALTHCARE_CRM_API_URL,
    serviceName: 'HealthcareCRM',
    features: ['contacts', 'campaigns', 'analytics']
  }
}; 