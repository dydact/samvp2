import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const ToggleButton = styled.button`
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 9999;
  padding: 10px;
  background-color: ${props => props.isDevMode ? 'green' : 'red'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
`;

export const DevModeToggle: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const storedDevMode = localStorage.getItem('devMode');
    if (storedDevMode) {
      const parsedDevMode = JSON.parse(storedDevMode);
      setIsDevMode(parsedDevMode);
      setUser(prevUser => ({ ...prevUser, isDevMode: parsedDevMode }));
    }
  }, [setUser]);

  const toggleDevMode = () => {
    const newDevMode = !isDevMode;
    setIsDevMode(newDevMode);
    setUser(prevUser => ({ ...prevUser, isDevMode: newDevMode }));
    localStorage.setItem('devMode', JSON.stringify(newDevMode));
  };

  return (
    <ToggleButton onClick={toggleDevMode} isDevMode={isDevMode}>
      {isDevMode ? 'Dev Mode: ON' : 'Dev Mode: OFF'}
    </ToggleButton>
  );
};