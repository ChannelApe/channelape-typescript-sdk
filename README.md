# ChannelApe TypeScript SDK

TypeScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

## Features
- Sessions

## Getting Started

Create the channel api client with your credentials.

```
  const channelapeClient = new ChannelapeClient({
    email: 'johndoe123@gmail.com',
    password: 'mysecretpassword',
    endpoint: 'https://api.channelape.com'
  });
```

The channelape sdk is asynchronous and all functions return promises.

### Sessions

A session is created when instantiating the client. It can be retrieved for later use

```
  channelapeClient.getSession()
    .then((session: SessionResponse) => {
      // do what you need to do with session data here
    });
```