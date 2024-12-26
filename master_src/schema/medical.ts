import { a } from '@aws-amplify/backend';

export const MedicalSchema = a.schema({
  Patient: a.model({
    // Basic Info
    userId: a.string().required(),
    user: a.belongsTo('User'),
    mrn: a.string().required(), // Medical Record Number
    dateOfBirth: a.date().required(),
    gender: a.enum(['MALE', 'FEMALE', 'OTHER']).required(),
    // Medical Info
    allergies: a.json(),
    medications: a.json(),
    conditions: a.json(),
    // Insurance
    insuranceProvider: a.string(),
    insuranceNumber: a.string(),
    // Emergency Contact
    emergencyContact: a.json(),
    // Care Team
    primaryPhysician: a.belongsTo('User'),
    careTeam: a.hasMany('User'),
    // Records
    encounters: a.hasMany('Encounter'),
    treatments: a.hasMany('Treatment'),
    vitals: a.hasMany('VitalRecord'),
    // Timestamps
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required(),
  }).authorization([
    a.allow.owner(),
    a.allow.groupWith('PROVIDER').read().update(),
    a.allow.groupWith('NURSE').read().update()
  ])
});
