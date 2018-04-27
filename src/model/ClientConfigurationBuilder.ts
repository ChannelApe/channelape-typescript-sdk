import ClientConfiguration from './ClientConfiguration';
import Environment from './Environment';
import { LogLevel, getLogLevelName } from './LogLevel';
import * as winston from 'winston';

export default class ClientConfigurationBuilder {

  private sessionId = '';
  private username = '';
  private password = '';
  private endpoint: string = Environment.PRODUCTION;
  private logLevel: LogLevel = LogLevel.OFF;
  
  get SessionId() {
    return this.sessionId;
  }
  
  setSessionId(sessionId: string): ClientConfigurationBuilder {
    this.sessionId = sessionId;
    return this;
  }
  
  get Username() {
    return this.username;
  }
  
  setUsername(username: string): ClientConfigurationBuilder {
    this.username = username;
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

  get LogLevel(): string {
    return getLogLevelName(this.logLevel);
  }
  
  build(): ClientConfiguration {
    return new ClientConfiguration(this);
  }
}
