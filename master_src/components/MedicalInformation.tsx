import React from 'react';
import { Client } from '../models';

interface MedicalInformationProps {
  client: Client;
}

const MedicalInformation: React.FC<MedicalInformationProps> = ({ client }) => {
  return (
    <div className="medical-information">
      <h2>Medical Information</h2>
      <p>Diagnosis: {client.diagnosis}</p>
      <p>Allergies: {client.allergies}</p>
      <p>Medications: {client.medications}</p>
      <p>Primary Care Physician: {client.primaryCarePhysician}</p>
    </div>
  );
};

export default MedicalInformation;