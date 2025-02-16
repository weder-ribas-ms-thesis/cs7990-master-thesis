import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { isLocalEnv } from '../core/utils.js';
import { EVENTS } from '../core/constants.js';

const endpoint = isLocalEnv()
  ? 'http://sns.localhost.localstack.cloud:4566'
  : undefined;

/**
 * Publishes an event to an SNS topic.
 * @param {object} param0 Function parameters
 * @param {string} param0.topicArn The ARN of the SNS topic to publish to
 * @param {object} param0.message The message to publish
 * @return {Promise<void>}
 */
export const publishEvent = async ({ topicArn, message }) => {
  try {
    const client = new SNSClient({
      endpoint,
      region: process.env.AWS_REGION,
    });

    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    });

    await client.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Publishes a delete media event to the media management topic
 * @param {string} mediaId The ID of the media to delete
 * @return {Promise<void>}
 */
export const publishDeleteMediaEvent = async (mediaId) => {
  const message = {
    type: EVENTS.DELETE_MEDIA.type,
    payload: { mediaId },
  };

  await publishEvent({
    topicArn: EVENTS.DELETE_MEDIA.topicArn,
    message,
  });
};
