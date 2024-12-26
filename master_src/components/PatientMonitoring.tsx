import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { Skeleton } from './ui/Skeleton'; // Assuming you have a Skeleton component for loading states
import { Pagination } from './ui/Pagination'; // Assuming you have a Pagination component

const client = generateClient<Schema>();

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  color: var(--primary);
  margin-bottom: 1rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FeatureCard = styled.div`
  background-color: var(--background-light);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus-within {
    outline: 2px solid var(--primary);
  }
`;

const FeatureTitle = styled.h3`
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

interface Patient {
  id: string;
  name: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
  };
  medications: string[];
}

interface Alert {
  patientId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

const AlertContainer = styled.div`
  margin-top: 2rem;
`;

const AlertItem = styled.div<{ severity: 'low' | 'medium' | 'high' }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${props => 
    props.severity === 'low' ? 'var(--warning-light)' :
    props.severity === 'medium' ? 'var(--warning)' :
    'var(--error)'
  };
  color: ${props => props.severity === 'low' ? 'var(--text)' : 'white'};
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PatientMonitoring: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const response = await client.models.Patient.list();
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to fetch patients. Please try again later.');
      setLoading(false);
    }
  }

  useEffect(() => {
    // Simulating real-time alerts
    const alertInterval = setInterval(() => {
      if (patients.length > 0) {
        const randomPatient = patients[Math.floor(Math.random() * patients.length)];
        const newAlert: Alert = {
          patientId: randomPatient.id,
          message: `Abnormal heart rate detected for ${randomPatient.name}`,
          severity: Math.random() > 0.5 ? 'medium' : 'high',
        };
        setAlerts(prevAlerts => [...prevAlerts, newAlert].slice(-5)); // Keep only the last 5 alerts
      }
    }, 10000); // Generate a new alert every 10 seconds

    return () => clearInterval(alertInterval);
  }, [patients]);

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => a.name.localeCompare(b.name));
  }, [patients]);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Container>
        <Title>Patient Monitoring</Title>
        <LoadingContainer>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height="200px" />
          ))}
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Patient Monitoring</Title>
        <div role="alert">
          <p>Error: {error}</p>
          <button onClick={fetchPatients}>Retry</button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Patient Monitoring</Title>
      <FeatureGrid role="list" aria-label="Patient List">
        {currentPatients.map((patient) => (
          <FeatureCard key={patient.id} role="listitem" tabIndex={0}>
            <FeatureTitle>{patient.name}</FeatureTitle>
            <p>Heart Rate: <span aria-label="heart rate">{patient.vitals.heartRate} bpm</span></p>
            <p>Blood Pressure: <span aria-label="blood pressure">{patient.vitals.bloodPressure}</span></p>
            <p>Temperature: <span aria-label="temperature">{patient.vitals.temperature}°C</span></p>
            <p>Medications: <span aria-label="medications">{patient.medications.join(', ')}</span></p>
          </FeatureCard>
        ))}
      </FeatureGrid>
      <Pagination
        patientsPerPage={patientsPerPage}
        totalPatients={sortedPatients.length}
        paginate={paginate}
        currentPage={currentPage}
        aria-label="Patient list pagination"
      />
      <AlertContainer>
        <h3 id="alerts-title">Recent Alerts</h3>
        <div role="log" aria-labelledby="alerts-title">
          {alerts.map((alert, index) => (
            <AlertItem key={index} severity={alert.severity} role="alert">
              {alert.message}
            </AlertItem>
          ))}
        </div>
      </AlertContainer>
    </Container>
  );
};

export default PatientMonitoring;