export default class QueryUtils {
  public static getDateQueryParameter(date: Date): string {
    const year = date.getUTCFullYear();
    const month = this.leftPad((date.getUTCMonth() + 1).toString(), 2);
    const day = this.leftPad(date.getUTCDate().toString(), 2);
    const hours = this.leftPad(date.getUTCHours().toString(), 2);
    const minutes = this.leftPad(date.getUTCMinutes().toString(), 2);
    const seconds = this.leftPad(date.getUTCSeconds().toString(), 2);
    const milliseconds = this.leftPad(date.getUTCMilliseconds().toString(), 3);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  private static leftPad(value: string, length: number): string {
    const str = '' + value;
    const pad = [...Array(length)].map(v => '0').join('');
    return pad.substring(0, pad.length - str.length) + str;
  }
}
