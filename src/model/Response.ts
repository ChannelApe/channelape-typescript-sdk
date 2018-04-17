export default class Response {

  constructor(private response: any, private data: any) {}

  getBody() {
    return this.data;
  }

  getStatus() {
    return this.response.statusCode;
  }
}
