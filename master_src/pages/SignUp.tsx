import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/elements/button';

const SignUpContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
`;

const StyledButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  margin-top: 1rem;
`;

const SignUp: React.FC = () => {
  const { signUp, isDevMode } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { isSignUpComplete, nextStep } = await signUp(username, password, email, name);

      if (isSignUpComplete) {
        // Redirect to login page or show success message
        navigate('/login', { state: { message: 'Sign up successful. Please log in.' } });
      } else if (nextStep) {
        // Handle additional steps (e.g., email verification)
        console.log('Additional steps required:', nextStep);
        // You might want to redirect to a confirmation page or show instructions here
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <LeftPanel>
        <Title>SiteAware</Title>
        <Subtitle>Join our platform for intelligent time tracking and project management.</Subtitle>
      </LeftPanel>
      <RightPanel>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSignUp}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isDevMode && (
            <p>Dev mode is active. Sign-up will be simulated.</p>
          )}
          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </StyledButton>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </RightPanel>
    </SignUpContainer>
  );
};

export default SignUp;