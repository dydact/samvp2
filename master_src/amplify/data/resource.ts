import { type ClientSchema, defineData } from '@aws-amplify/backend';

export const schema = {
    models: {
        User: {
            attributes: {
                id: { type: 'string', required: true },
                email: { type: 'string', required: true },
                role: { 
                    type: 'string',
                    required: true,
                    validators: [
                        { type: 'enumeration', values: ['ADMIN', 'USER', 'CLIENT'] }
                    ]
                }
            }
        }
    }
} satisfies ClientSchema;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool'
    }
});
