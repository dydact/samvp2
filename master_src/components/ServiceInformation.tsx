import React from 'react';
import { Client } from '../models';
import styled from 'styled-components';

const ServiceInfoContainer = styled.div`
  margin-bottom: 1rem;
`;

interface ServiceInformationProps {
  client: Client;
}

const ServiceInformation: React.FC<ServiceInformationProps> = ({ client }) => {
  return (
    <ServiceInfoContainer>
      <h2>Service Information</h2>
      <p>Service Coordinator: {client.serviceCoordinator}</p>
      <p>Service Type: {client.serviceType}</p>
      <p>Service Frequency: {client.serviceFrequency}</p>
      <p>Start Date: {client.startDate}</p>
      <p>End Date: {client.endDate || 'Ongoing'}</p>
    </ServiceInfoContainer>
  );
};

export default ServiceInformation;