import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import styled from 'styled-components';

const client = generateClient<Schema>();

const DocumentsContainer = styled.div`
  margin-bottom: 1rem;
`;

const DocumentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DocumentItem = styled.li`
  margin-bottom: 0.5rem;
`;

interface DocumentsSectionProps {
  clientId: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<Schema['Document'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [clientId]);

  const fetchDocuments = async () => {
    try {
      const { data, errors } = await client.models.Document.list({
        filter: { clientID: { eq: clientId } }
      });
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DocumentsContainer>
      <h2>Documents</h2>
      <DocumentList>
        {documents.map((doc) => (
          <DocumentItem key={doc.id}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.title} ({doc.type})
            </a>
          </DocumentItem>
        ))}
      </DocumentList>
    </DocumentsContainer>
  );
};

export default DocumentsSection;