// packages/shared/src/auth/AuthProvider.tsx
import { createContext, useContext, useState } from 'react';
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import type { UserRole, Organization } from './types';

interface AuthState {
  user: any;
  organization: Organization | null;
  role: UserRole | null;
}

export const AuthContext = createContext<AuthState | null>(null);
