import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import styled from 'styled-components';

const client = generateClient<Schema>();

const GoalsContainer = styled.div`
  margin-bottom: 1rem;
`;

const GoalList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GoalItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const GoalTitle = styled.h3`
  margin: 0;
`;

const GoalDescription = styled.p`
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
`;

interface GoalsAndProgressProps {
  clientId: string;
}

const GoalsAndProgress: React.FC<GoalsAndProgressProps> = ({ clientId }) => {
  const [goals, setGoals] = useState<Schema['Goal'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [clientId]);

  const fetchGoals = async () => {
    try {
      const { data, errors } = await client.models.Goal.list({
        filter: { clientID: { eq: clientId } }
      });
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching goals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading goals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <GoalsContainer>
      <h2>Goals and Progress</h2>
      <GoalList>
        {goals.map((goal) => (
          <GoalItem key={goal.id}>
            <GoalTitle>{goal.title}</GoalTitle>
            <GoalDescription>{goal.description}</GoalDescription>
            <ProgressBar progress={goal.progress} />
            <span>{goal.progress}% complete</span>
          </GoalItem>
        ))}
      </GoalList>
    </GoalsContainer>
  );
};

export default GoalsAndProgress;