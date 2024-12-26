import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import styled from 'styled-components';

const client = generateClient<Schema>();

const AppointmentsContainer = styled.div`
  margin-bottom: 1rem;
`;

const AppointmentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AppointmentItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AppointmentDate = styled.span`
  font-weight: bold;
`;

const AppointmentDuration = styled.span`
  color: #666;
`;

const AppointmentNotes = styled.p`
  margin-top: 0.25rem;
  font-style: italic;
`;

interface AppointmentsSectionProps {
  clientId: string;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ clientId }) => {
  const [appointments, setAppointments] = useState<Schema['Appointment'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [clientId]);

  const fetchAppointments = async () => {
    try {
      const { data, errors } = await client.models.Appointment.list({
        filter: { clientID: { eq: clientId } },
        sort: { field: 'date', direction: 'ASCENDING' }
      });
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <AppointmentsContainer>
      <h2>Upcoming Appointments</h2>
      <AppointmentList>
        {appointments.map((appointment) => (
          <AppointmentItem key={appointment.id}>
            <AppointmentDate>{new Date(appointment.date).toLocaleString()}</AppointmentDate>
            <AppointmentDuration> - {appointment.duration} minutes</AppointmentDuration>
            {appointment.notes && <AppointmentNotes>Notes: {appointment.notes}</AppointmentNotes>}
          </AppointmentItem>
        ))}
      </AppointmentList>
    </AppointmentsContainer>
  );
};

export default AppointmentsSection;