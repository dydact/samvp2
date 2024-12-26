import React from 'react';
import PlaceholderComponent from '../components/PlaceholderComponent';
import styled from 'styled-components';

const VideoAnalysisWrapper = styled.div`
  padding: 20px;
`;

const VideoAnalysis: React.FC = () => {
  return (
    <VideoAnalysisWrapper>
      <h1>Video Analysis</h1>
      <p>This page will contain tools and visualizations for analyzing patient video data.</p>
      <PlaceholderComponent pageName="Video Analysis Dashboard" />
    </VideoAnalysisWrapper>
  );
};

export default VideoAnalysis;