import { type ClientSchema, defineData } from '@aws-amplify/backend';

// Define the base schema
export const schema = {
    models: {
        User: {
            attributes: {
                id: {
                    type: 'string',
                    required: true
                },
                email: {
                    type: 'string',
                    required: true
                },
                role: {
                    type: 'string',
                    required: true,
                    validators: [
                        {
                            type: 'enumeration',
                            values: ['ADMIN', 'USER', 'CLIENT']
                        }
                    ]
                },
                organizationId: {
                    type: 'string'
                }
            }
        },
        Patient: {
            attributes: {
                id: {
                    type: 'string',
                    required: true
                },
                name: {
                    type: 'string',
                    required: true
                },
                dateOfBirth: {
                    type: 'string',
                    required: true
                },
                medicalRecordNumber: {
                    type: 'string',
                    required: true
                }
            }
        },
        Alert: {
            attributes: {
                id: {
                    type: 'string',
                    required: true
                },
                type: {
                    type: 'string',
                    required: true
                },
                severity: {
                    type: 'string',
                    required: true,
                    validators: [
                        {
                            type: 'enumeration',
                            values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                        }
                    ]
                },
                status: {
                    type: 'string',
                    required: true,
                    validators: [
                        {
                            type: 'enumeration',
                            values: ['NEW', 'ACKNOWLEDGED', 'RESOLVED']
                        }
                    ]
                }
            }
        }
    }
} satisfies ClientSchema;

// Define the data configuration
export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
        // Add API key support if needed
        // apiKeyAuthorizationMode: {
        //     expiresInDays: 30
        // }
    }
});
