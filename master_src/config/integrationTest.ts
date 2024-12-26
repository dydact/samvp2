import { IntegrationConfig } from '../../../../src/types/integration';

export const testConfig: IntegrationConfig = {
  hospitalRun: {
    enabled: true,
    baseUrl: process.env.VITE_HOSPITALRUN_API_URL || 'http://localhost:3000',
    features: ['appointments', 'patients', 'inventory']
  },
  healthcareCRM: {
    enabled: true,
    baseUrl: process.env.VITE_HEALTHCARE_CRM_API_URL || 'http://localhost:8080',
    features: ['medical-records', 'staff', 'offices']
  },
  goalert: {
    enabled: true,
    baseUrl: process.env.VITE_GOALERT_API_URL || 'http://localhost:8081',
    features: ['alerts', 'escalations', 'schedules']
  }
}; 