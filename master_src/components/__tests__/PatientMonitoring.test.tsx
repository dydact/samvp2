import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PatientMonitoring from '../PatientMonitoring';
import { generateClient } from 'aws-amplify/api';

jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn(),
}));

const mockClient = {
  models: {
    Patient: {
      list: jest.fn(),
    },
  },
};

(generateClient as jest.Mock).mockReturnValue(mockClient);

describe('PatientMonitoring', () => {
  it('renders loading state initially', () => {
    render(<PatientMonitoring />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders patient data after loading', async () => {
    const mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        vitals: { heartRate: 75, bloodPressure: '120/80', temperature: 36.6 },
        medications: ['Aspirin', 'Ibuprofen'],
      },
    ];

    mockClient.models.Patient.list.mockResolvedValue({ data: mockPatients });

    render(<PatientMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Heart Rate: 75 bpm')).toBeInTheDocument();
      expect(screen.getByText('Blood Pressure: 120/80')).toBeInTheDocument();
      expect(screen.getByText('Temperature: 36.6°C')).toBeInTheDocument();
      expect(screen.getByText('Medications: Aspirin, Ibuprofen')).toBeInTheDocument();
    });
  });

  it('renders error state when fetching fails', async () => {
    mockClient.models.Patient.list.mockRejectedValue(new Error('Failed to fetch'));

    render(<PatientMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch patients. Please try again later.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });
});