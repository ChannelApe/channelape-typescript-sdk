export default class Response {

  constructor(private response: any, private data: any) {}
  
  public getBody() {
    return this.data;
  }

  public getStatus() {
    return this.response.statusCode;
  }
}
