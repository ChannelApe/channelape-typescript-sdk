import { LogLevel } from 'channelape-logger';
import ChannelApeClient from '../src/ChannelApeClient';
describe('ChannelApeClientDriver', () => {
  it.only('Given some play to update then update play', async () => {
    const channelApeClient = new ChannelApeClient({
      endpoint: getEndpoint(),
      sessionId: getSessionId(),
      logLevel: LogLevel.VERBOSE,
      maximumRequestRetryRandomDelay: 2000,
      minimumRequestRetryRandomDelay: 1000,
      maximumRequestRetryTimeout: 10000
    });

    const get = await channelApeClient.channels().update({
      
    });
    console.log(JSON.stringify(get));
    await channelApeClient.plays().update({
      id: "5aeeb24f-826f-4938-8971-0454d03da843",
      name: "jjjjjj 2"
    });
  });
});

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