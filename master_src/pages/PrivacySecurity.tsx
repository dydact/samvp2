import { Storage } from 'aws-amplify';

// ... existing code

const uploadSensitiveDocument = async (file) => {
  try {
    await Storage.vault.put(file.name, file, {
      contentType: file.type,
      metadata: { owner: 'current-user-id' }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
  }
};

// Use this function for uploading sensitive documents