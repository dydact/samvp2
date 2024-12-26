import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import styled from 'styled-components';

const FileUploadWrapper = styled.div`
  // Add styling here
`;

const FileInput = styled.input`
  // Add styling here
`;

const UploadButton = styled.button`
  // Add styling here
`;

const Message = styled.p<{ $error?: boolean }>`
  color: ${props => props.$error ? 'red' : 'green'};
`;

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
      setMessage('');
      setError(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await Storage.put(file.name, file, {
        contentType: file.type,
      });
      setMessage('File uploaded successfully');
      setError(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
      setError(true);
    }
  };

  return (
    <FileUploadWrapper>
      <FileInput type="file" onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={!file}>
        Upload File
      </UploadButton>
      {message && <Message $error={error}>{message}</Message>}
    </FileUploadWrapper>
  );
};

export default FileUpload;