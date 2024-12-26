import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import styled from 'styled-components';

const client = generateClient<Schema>();

const ProfileContainer = styled.div`
  margin-bottom: 1rem;
`;

const ProfileHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

interface ClientProfileProps {
  clientId: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  // Add other necessary properties here
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientProfile();
  }, [clientId]);

  const fetchClientProfile = async () => {
    try {
      const { data, errors } = await client.models.Client.get({ id: clientId });
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      setClient(data as Client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching client profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading client profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProfileContainer>
      {client && (
        <>
          <ProfileHeader>{client.firstName} {client.lastName}'s Profile</ProfileHeader>
          <QuickActions clientId={client.id} />
          <GoalsAndProgress clientId={client.id} />
          <DocumentsSection clientId={client.id} />
          <AppointmentsSection clientId={client.id} />
          <BillingInformationSection clientId={client.id} />
        </>
      )}
    </ProfileContainer>
  );
};

export default ClientProfile;
