import React from 'react';
import styled from 'styled-components';

const QuickActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

interface QuickActionsProps {
  clientId: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ clientId }) => {
  const handleNewAppointment = () => {
    // Implement new appointment creation logic
    console.log('Create new appointment for client', clientId);
  };

  const handleAddDocument = () => {
    // Implement document upload logic
    console.log('Add new document for client', clientId);
  };

  const handleSendMessage = () => {
    // Implement messaging logic
    console.log('Send message to client', clientId);
  };

  return (
    <QuickActionsContainer>
      <ActionButton onClick={handleNewAppointment}>New Appointment</ActionButton>
      <ActionButton onClick={handleAddDocument}>Add Document</ActionButton>
      <ActionButton onClick={handleSendMessage}>Send Message</ActionButton>
    </QuickActionsContainer>
  );
};

export default QuickActions;