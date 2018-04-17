import ClientConfiguration from './ClientConfiguration';

export default class ClientConfigurationBuilder {

  private sessionId: string;
  private email: string;
  private password: string;
  private endpoint: string = 'https://api.channelape.com';
  
  get SessionId() {
    return this.sessionId;
  }
  
  setSessionId(sessionId: string): ClientConfigurationBuilder {
    this.sessionId = sessionId;
    return this;
  }
  
  get Email() {
    return this.email;
  }
  
  setEmail(email: string): ClientConfigurationBuilder {
    this.email = email;
    return this;
  }
  
  get Password() {
    return this.password;
  }
  
  setPassword(password: string): ClientConfigurationBuilder {
    this.password = password;
    return this;
  }
  
  get Endpoint() {
    return this.endpoint;
  }
  
  setEndpoint(endpoint: string): ClientConfigurationBuilder {
    this.endpoint = endpoint;
    return this;
  }
  
  build(): ClientConfiguration {
    return new ClientConfiguration(this);
  }
}
