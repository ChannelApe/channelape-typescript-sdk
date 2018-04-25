import ClientConfigurationBuilder from './ClientConfigurationBuilder';

export default class ClientConfiguration {

  private readonly sessionId: string;
  private readonly email: string;
  private readonly password: string;
  private readonly endpoint: string;

  constructor(builder: ClientConfigurationBuilder) {
    this.sessionId = builder.SessionId;
    this.email = builder.Email;
    this.password = builder.Password;
    this.endpoint = builder.Endpoint;
  }

  get SessionId() {
    return this.sessionId;
  }

  hasSession() : boolean {
    return this.sessionId != null;
  }

  get Email() {
    return this.email;
  }

  get Password() {
    return this.password;
  }

  hasCredentials() : boolean {
    return this.email != null && this.password != null; 
  }

  get Endpoint() {
    return this.endpoint;
  }

}


