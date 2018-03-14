
export function mockResponse(data, statusCode) {
  return function (url, opts, cb) {
    cb(data, { statusCode: statusCode || 200 });
    return {
      on() {
      }
    };
  };
}
