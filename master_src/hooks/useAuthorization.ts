import { useAuth } from '../context/AuthContext';

export const useAuthorization = () => {
  const { user } = useAuth();

  const canViewClientProfile = (clientId: string) => {
    // Implement logic to check if the user has permission to view this client's profile
    // This could involve checking the user's role, organization, or specific permissions
    return true; // Placeholder, replace with actual logic
  };

  const canEditClientProfile = (clientId: string) => {
    // Implement logic to check if the user has permission to edit this client's profile
    return user?.role === 'ADMIN' || user?.role === 'MANAGER';
  };

  return {
    canViewClientProfile,
    canEditClientProfile,
  };
};