import React, { useState } from 'react';
import { API, Storage } from 'aws-amplify';
import { listPatients } from '../graphql/queries';

const PatientMonitoring: React.FC = () => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const patientData = await API.graphql({ query: listPatients });
      setPatients(patientData.data.listPatients.items);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  return (
    <div>
      <h1>Patient Monitoring</h1>
      <button onClick={fetchPatients}>Fetch Patients</button>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientMonitoring;