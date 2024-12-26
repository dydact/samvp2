import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import styled from 'styled-components';

const client = generateClient<Schema>();

const BillingContainer = styled.div`
  margin-bottom: 1rem;
`;

const BillingHistoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const BillingHistoryItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

interface BillingInformationSectionProps {
  clientId: string;
}

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: string;
}

const BillingInformationSection: React.FC<BillingInformationSectionProps> = ({ clientId }) => {
  const [billingInfo, setBillingInfo] = useState<Schema['BillingInformation'] | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingInformation();
  }, [clientId]);

  const fetchBillingInformation = async () => {
    try {
      const { data: billingInfoData, errors: billingInfoErrors } = await client.models.BillingInformation.get({ clientID: clientId });
      if (billingInfoErrors) {
        throw new Error(billingInfoErrors.map(e => e.message).join(', '));
      }
      setBillingInfo(billingInfoData);

      if (billingInfoData) {
        const { data: billingHistoryData, errors: billingHistoryErrors } = await client.models.BillingRecord.list({
          filter: { billingInformationID: { eq: billingInfoData.id } },
          sort: { field: 'date', direction: 'DESCENDING' }
        });
        if (billingHistoryErrors) {
          throw new Error(billingHistoryErrors.map(e => e.message).join(', '));
        }
        setBillingHistory(billingHistoryData as BillingRecord[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching billing information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading billing information...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BillingContainer>
      <h2>Billing Information</h2>
      {billingInfo && (
        <>
          <p>Payment Method: {billingInfo.paymentMethod}</p>
          <h3>Billing History</h3>
          <BillingHistoryList>
            {billingHistory.map((record: BillingRecord) => (
              <BillingHistoryItem key={record.id}>
                <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                <p>Amount: ${record.amount.toFixed(2)}</p>
                <p>Description: {record.description}</p>
                <p>Status: {record.status}</p>
              </BillingHistoryItem>
            ))}
          </BillingHistoryList>
        </>
      )}
    </BillingContainer>
  );
};

export default BillingInformationSection;
