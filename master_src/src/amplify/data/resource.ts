import { defineData } from '@aws-amplify/backend';
import { schema } from '../../../SiteAware/shared/src/schema';

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // Add API Key for public access if needed
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 