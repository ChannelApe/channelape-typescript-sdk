
export function mockResponse(data: any, statusCode: number) {
  return function (url: string, opts: any, cb: any) {
    cb(data, { statusCode: statusCode || 200 });
    return {
      on() {
      }
    };
  };
}
