# ChannelApe TypeScript SDK

TypeScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

| Service   | Develop | Master |
|-----------|---------|--------|
| CI Status | [![Build Status](https://travis-ci.org/ChannelApe/channelape-typescript-sdk.svg?branch=develop)](https://travis-ci.org/ChannelApe/channelape-typescript-sdk) | [![Build Status](https://travis-ci.org/ChannelApe/channelape-typescript-sdk.svg?branch=master)](https://travis-ci.org/ChannelApe/channelape-typescript-sdk) |
| Static Analysis | [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&branch=develop&metric=alert_status)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk) | [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&branch=master&metric=alert_status)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk) |

## Features
- [Getting Started](#getting-started)
- [Sessions](#sessions)

### Getting Started

Create the channel api client with your credentials.

```typescript
const clientConfiguration = new ClientConfigurationBuilder()
  .setUsername('johndoe123@test.com').setPassword('my_pass123#4').build();
const channelApeClient = new ChannelapeClient(clientConfiguration);
```

or if you have your sessionId:
```typescript
const clientConfiguration = new ClientConfigurationBuilder()
  .setSessionId('e7fecb82-61f7-498e-a358-aa21eb0cd5e8').build();
```
The channelape sdk is asynchronous and all functions return promises.

### Sessions

A session is created when instantiating the client. It can be retrieved for later use.

```typescript
channelapeClient.getSession()
  .then((session: Session) => {
    // do what you need to do with session data here
  });
```