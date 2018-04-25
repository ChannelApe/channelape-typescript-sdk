export default class Response {

  constructor(private readonly response: any, private readonly data: any) {}

  getBody() {
    return this.data;
  }

  getStatus() {
    return this.response.statusCode;
  }
}
