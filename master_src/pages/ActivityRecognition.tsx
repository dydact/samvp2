import React from 'react';
import styled from 'styled-components';
import PlaceholderComponent from '../components/PlaceholderComponent';

const ActivityRecognitionWrapper = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActivityRecognition: React.FC = () => {
  return (
    <ActivityRecognitionWrapper>
      <Title>Activity Recognition</Title>
      <Description>
        Our advanced Activity Recognition system uses cutting-edge AI algorithms to identify and analyze patient activities in real-time. This technology helps healthcare providers monitor patient behavior, track progress, and identify potential health issues early.
      </Description>
      <FeatureList>
        <FeatureItem>Real-time activity detection and classification</FeatureItem>
        <FeatureItem>Customizable activity profiles for different patient needs</FeatureItem>
        <FeatureItem>Integration with patient health records for comprehensive analysis</FeatureItem>
        <FeatureItem>Automated alerts for unusual or concerning activities</FeatureItem>
        <FeatureItem>Historical activity data visualization and reporting</FeatureItem>
      </FeatureList>
      <PlaceholderComponent pageName="Activity Recognition Dashboard" />
    </ActivityRecognitionWrapper>
  );
};

export default ActivityRecognition;