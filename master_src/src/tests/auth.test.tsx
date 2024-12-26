import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../components/Login';
import { mockAuthenticator } from '../mocks/authenticator';

describe('Authentication Flow', () => {
  test('successful login flow', async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAuthenticator.isAuthenticated).toBe(true);
    });
  });
}); 