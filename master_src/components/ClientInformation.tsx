import React from 'react';
import { Client } from '../models';

interface ClientInformationProps {
  client: Client;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ client }) => {
  return (
    <div className="client-information">
      <h2>Client Information</h2>
      <p>Name: {client.firstName} {client.lastName}</p>
      <p>Date of Birth: {client.dateOfBirth}</p>
      <p>Address: {client.address}</p>
      <p>Phone Number: {client.phoneNumber}</p>
      <p>Email: {client.email}</p>
      <p>Emergency Contact: {client.emergencyContact}</p>
      <p>Insurance Information: {client.insuranceInformation}</p>
    </div>
  );
};

export default ClientInformation;