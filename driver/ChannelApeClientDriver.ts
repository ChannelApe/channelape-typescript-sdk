import { LogLevel } from 'channelape-logger';
import ChannelUpdateRequest from '../src/channels/model/ChannelUpdateRequest';
import ChannelApeClient from '../src/ChannelApeClient';

function getSessionId(): string {
  const sessionIdEnvironmentVariable = process.env.CHANNEL_APE_SESSION_ID;
  if (sessionIdEnvironmentVariable == null) {
    throw new Error('CHANNEL_APE_SESSION_ID environment variable is required.');
  }
  return sessionIdEnvironmentVariable;
}

function getEndpoint(): string {
  const host = process.env.CHANNEL_APE_HOST;
  if (host == null) {
    throw new Error('CHANNEL_APE_HOST environment variable is required.');
  }
  return host;
}

async function test() {
  const channelApeClient = new ChannelApeClient({
    endpoint: getEndpoint(),
    sessionId: getSessionId(),
    logLevel: LogLevel.VERBOSE,
    maximumRequestRetryRandomDelay: 2000,
    minimumRequestRetryRandomDelay: 1000,
    maximumRequestRetryTimeout: 10000
  });
  
  const get = await channelApeClient.channels().get('1439aa5b-757f-4e70-b1a0-f7331aee50e7');
  console.log(JSON.stringify(get));
  const updateRequest: ChannelUpdateRequest = {
    additionalFields: get.additionalFields,
    enabled: true,
    id: get.id,
    name: 'Ryan Typescript SDK'
  }
  const update = await channelApeClient.channels().update(updateRequest);
  console.log(update);
}

test();