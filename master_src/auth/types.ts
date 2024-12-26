// packages/shared/src/auth/types.ts
export interface UserRole {
  id: string;
  name: 'ADMIN' | 'PROVIDER' | 'PATIENT' | 'CAREGIVER';
  permissions: string[];
}

export interface Organization {
  id: string;
  name: string;
  subscriptionTier: 'FREE' | 'BASIC' | 'PREMIUM';
  features: string[];
}
