import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Organization: a
    .model({
      name: a.string().required(),
      type: a.enum(['PRIMARY', 'CUSTOMER']).required(),
      staff: a.hasMany('User'),
      clients: a.hasMany('Client'),
      customFields: a.json(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.public().read(), a.allow.private().create().update().delete()]),

  User: a
    .model({
      email: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      organization: a.belongsTo('Organization'),
      role: a.json().required(),
      permissions: a.json(),
      status: a.enum(['ACTIVE', 'INACTIVE', 'PENDING']).required(),
      lastLogin: a.datetime(),
      profilePicture: a.string(),
      profilePictureHash: a.string(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.owner(), a.allow.private().read()]),

  Client: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      dateOfBirth: a.date().required(),
      address: a.string().required(),
      phoneNumber: a.string().required(),
      email: a.string().required(),
      emergencyContact: a.string().required(),
      insuranceInformation: a.string(),
      diagnosis: a.string(),
      allergies: a.string(),
      medications: a.string(),
      primaryCarePhysician: a.string(),
      serviceCoordinator: a.string(),
      serviceType: a.string().required(),
      serviceFrequency: a.string().required(),
      startDate: a.date().required(),
      endDate: a.date(),
      organization: a.belongsTo('Organization'),
      assignedStaff: a.hasMany('User'),
      goals: a.hasMany('Goal'),
      documents: a.hasMany('Document'),
      appointments: a.hasMany('Appointment'),
      billingInformation: a.hasOne('BillingInformation'),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Goal: a
    .model({
      client: a.belongsTo('Client'),
      description: a.string().required(),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Document: a
    .model({
      client: a.belongsTo('Client'),
      title: a.string().required(),
      type: a.string().required(),
      url: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Appointment: a
    .model({
      client: a.belongsTo('Client'),
      staff: a.belongsTo('User'),
      date: a.datetime().required(),
      duration: a.integer().required(),
      notes: a.string(),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  BillingInformation: a
    .model({
      client: a.belongsTo('Client'),
      paymentMethod: a.string().required(),
      billingHistory: a.hasMany('BillingRecord'),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  BillingRecord: a
    .model({
      billingInformation: a.belongsTo('BillingInformation'),
      amount: a.float().required(),
      date: a.date().required(),
      description: a.string().required(),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  // Add missing models from SAschema.ts
  TreatmentPlan: a
    .model({
      client: a.belongsTo('Client'),
      tasks: a.hasMany('Task'),
      services: a.hasMany('Service'),
      startDate: a.date().required(),
      endDate: a.date().required(),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Task: a
    .model({
      description: a.string().required(),
      treatmentPlan: a.belongsTo('TreatmentPlan'),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Service: a
    .model({
      name: a.string().required(),
      description: a.string(),
      treatmentPlan: a.belongsTo('TreatmentPlan'),
      renderedBy: a.id().required(),
      staff: a.belongsTo('User', { name: 'staff' }),
      startTime: a.datetime().required(),
      endTime: a.datetime().required(),
      duration: a.integer().required(),
      status: a.string().required(),
      documentation: a.hasOne('Documentation'),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  Documentation: a
    .model({
      service: a.belongsTo('Service'),
      progressNotes: a.hasMany('ProgressNote'),
      status: a.string().required(),
      submittedAt: a.datetime(),
      approvedAt: a.datetime(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),

  ProgressNote: a
    .model({
      documentation: a.belongsTo('Documentation'),
      content: a.string().required(),
      timestamp: a.datetime().required(),
      createdBy: a.id().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization([a.allow.private().read().create().update().delete()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
