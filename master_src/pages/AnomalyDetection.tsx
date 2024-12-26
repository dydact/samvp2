import React from 'react';
import styled from 'styled-components';
import PlaceholderComponent from '../components/PlaceholderComponent';

const AnomalyDetectionWrapper = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #34495e;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FeatureCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeatureTitle = styled.h3`
  color: #3498db;
  font-size: 18px;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  font-size: 14px;
`;

const AnomalyDetection: React.FC = () => {
  return (
    <AnomalyDetectionWrapper>
      <Title>Anomaly Detection</Title>
      <Description>
        Our Anomaly Detection system employs sophisticated machine learning algorithms to identify unusual patterns or behaviors in patient data. This proactive approach enables healthcare providers to intervene early and prevent potential health complications.
      </Description>
      <FeatureGrid>
        <FeatureCard>
          <FeatureTitle>Real-time Monitoring</FeatureTitle>
          <FeatureDescription>Continuous analysis of patient data to detect anomalies as they occur.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle>Multi-dimensional Analysis</FeatureTitle>
          <FeatureDescription>Considers various health parameters to provide a comprehensive view of patient health.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle>Adaptive Learning</FeatureTitle>
          <FeatureDescription>System improves over time by learning from historical data and feedback.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle>Customizable Alerts</FeatureTitle>
          <FeatureDescription>Set personalized thresholds for different types of anomalies based on patient needs.</FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
      <PlaceholderComponent pageName="Anomaly Detection Dashboard" />
    </AnomalyDetectionWrapper>
  );
};

export default AnomalyDetection;