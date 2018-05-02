# ChannelApe SDK

TypeScript and JavaScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

[![Build Status](https://travis-ci.org/ChannelApe/channelape-typescript-sdk.svg?branch=master)](https://travis-ci.org/ChannelApe/channelape-typescript-sdk)  [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=coverage)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk)

## Features
- [Getting Started](#getting-started)
- [Sessions](#sessions)
- [Actions](#actions)
- [Channels](#channels)

### Getting Started

The ChannelApe SDK is asynchronous and all functions return promises.

#### Creating a client

Create a new instance of the ChannelApeClient with your sessionId.

```typescript
const channelApeClient = new ChannelApeClient({
  sessionId: '4674b668-c4d2-4270-bf9b-ebaab78c378d'
});
```

#### Optional client configurations

* timeout - Number of milliseconds to wait for the API to send response headers. Defaults to 180000 (3 minutes). Cannot be set lower than 2000 (2 seconds).
* endpoint - Envrionment endpoint you would like to hit. Defaults to https://api.channelape.com

### Sessions

Retrieve session using sessionId passed into ChannelApeClient.

```typescript
channelapeClient.sessions().get()
  .then((session: Session) => {
    // do what you need to do with session data here
  });
```

### Actions

#### Get action
```typescript
channelapeClient.actions().get(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Complete action
```typescript
channelapeClient.actions().complete(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Update action with error
```typescript
channelapeClient.actions().error(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Update action health check
```typescript
channelapeClient.actions().updateHealthCheck(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

### Channels

#### Get channel
```typescript
channelapeClient.channels().get(channelId)
  .then((channel: Channel) => {
    // do what you need to do with channel data here
  });
```