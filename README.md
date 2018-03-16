# ChannelApe TypeScript SDK

TypeScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

## Features
- [Getting Started](#getting-started)
- [Sessions](#sessions)
- [Orders](#orders)

### Getting Started

Create the channel api client with your credentials.

```
  const channelapeClient = new ChannelapeClient({
    email: 'johndoe123@gmail.com',
    password: 'mysecretpassword'
  });
```

or if you have your sessionId:
```
  const channelapeClient = new ChannelapeClient({
    sessionId: '123-456-789'
  });
```
The channelape sdk is asynchronous and all functions return promises.

### Sessions

A session is created when instantiating the client. It can be retrieved for later use.

```
  channelapeClient.getSession()
    .then((session: SessionResponse) => {
      // do what you need to do with session data here
    });
```

### Orders

To retrieve a single order for a channel