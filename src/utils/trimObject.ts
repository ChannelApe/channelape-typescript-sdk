export default function trimObject(obj: { [key: string]: any }): object {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key: string) => {
      const value: any = obj[key];
      if (typeof value === 'string') {
        obj[key] = value.trim();
      } else if (Array.isArray(value)) {
        obj[key] = value.map(trimObject);
      } else if (value && typeof value === 'object') {
        obj[key] = trimObject(value);
      }
    });
  }
  return obj;
}
