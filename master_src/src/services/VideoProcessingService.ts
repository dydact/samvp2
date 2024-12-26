import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { KinesisVideo, KinesisVideoMedia } from '@aws-sdk/client-kinesis-video';
import { useCallback, useState } from 'react';

export function useVideoProcessing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = generateClient();

  const processVideoStream = useCallback(async (streamName: string, data: Blob) => {
    setLoading(true);
    setError(null);

    try {
      // Upload to S3 for backup
      const s3Key = `videos/${streamName}/${Date.now()}.mp4`;
      await uploadData({
        key: s3Key,
        data,
        options: {
          contentType: 'video/mp4'
        }
      });

      // Start Kinesis Video Stream processing
      const response = await client.graphql({
        query: `
          mutation StartVideoProcessing($input: VideoProcessingInput!) {
            startVideoProcessing(input: $input) {
              streamArn
              status
              kinesisDataStreamName
            }
          }
        `,
        variables: {
          input: {
            streamName,
            s3Key
          }
        }
      });

      return response.data.startVideoProcessing;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Video processing failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    processVideoStream,
    loading,
    error
  };
} 