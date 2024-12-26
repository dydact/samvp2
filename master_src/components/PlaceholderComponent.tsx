import React from 'react';
import styled from 'styled-components';

const PlaceholderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

interface PlaceholderComponentProps {
  pageName: string;
}

const PlaceholderComponent: React.FC<PlaceholderComponentProps> = ({ pageName }) => {
  return (
    <PlaceholderWrapper>
      <h1>{pageName} - Coming Soon</h1>
    </PlaceholderWrapper>
  );
};

export default PlaceholderComponent;