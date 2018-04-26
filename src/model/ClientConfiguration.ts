import ClientConfigurationBuilder from './ClientConfigurationBuilder';

export default class ClientConfiguration {

  private readonly sessionId: string;
  private readonly username: string;
  private readonly password: string;
  private readonly endpoint: string;

  constructor(builder: ClientConfigurationBuilder) {
    this.sessionId = builder.SessionId;
    this.username = builder.Username;
    this.password = builder.Password;
    this.endpoint = builder.Endpoint;
  }

  get SessionId() {
    return this.sessionId;
  }

  hasSession() : boolean {
    return this.sessionId.length > 0;
  }

  get Username() {
    return this.username;
  }

  get Password() {
    return this.password;
  }

  hasCredentials() : boolean {
    return this.username.length > 0 && this.password.length > 0; 
  }

  get Endpoint() {
    return this.endpoint;
  }

}


