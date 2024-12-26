// SAMVPquick/src/amplify/data/schema/auth.ts
import { a } from '@aws-amplify/backend';

export const AuthSchema = a.schema({
  Organization: a.model({
    name: a.string().required(),
    type: a.enum(['HEALTHCARE', 'CLINIC', 'HOSPITAL', 'CARE_HOME']).required(),
    subscriptionTier: a.enum(['FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']).required(),
    features: a.json(),
    settings: a.json(),
    metadata: a.json(),
    status: a.enum(['ACTIVE', 'SUSPENDED', 'PENDING']).required(),
    // Relationships
    users: a.hasMany('User'),
    departments: a.hasMany('Department'),
    locations: a.hasMany('Location'),
    // Timestamps
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required(),
  }).authorization([
    a.allow.public().read(),
    a.allow.private().create().update().delete(),
    a.allow.owner().create().update().delete()
  ]),

  User: a.model({
    // Basic Info
    email: a.string().required(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    phone: a.string(),
    role: a.enum([
      'SUPER_ADMIN',
      'ORG_ADMIN',
      'PROVIDER',
      'NURSE',
      'STAFF',
      'PATIENT',
      'CAREGIVER'
    ]).required(),
    // Access Control
    permissions: a.json(),
    status: a.enum(['ACTIVE', 'INACTIVE', 'PENDING']).required(),
    mfaEnabled: a.boolean().required(),
    lastLogin: a.datetime(),
    // Relationships
    organizationId: a.string().required(),
    organization: a.belongsTo('Organization'),
    department: a.belongsTo('Department'),
    // Preferences
    preferences: a.json(),
    notifications: a.json(),
    // Timestamps
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required(),
  }).authorization([
    a.allow.owner(),
    a.allow.private().read(),
    a.allow.groupWith('ADMIN').create().update().delete()
  ])
});
