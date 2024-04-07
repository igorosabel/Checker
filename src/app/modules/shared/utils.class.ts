export class Utils {
  static urldecode(str: string | null): string | null {
    if (str === null) {
      return null;
    }
    if (!str) {
      return '';
    }
    return decodeURIComponent(
      str
        .replace(/\+/g, '%20')
        .replace(/%21/g, '!')
        .replace(/%27/g, "'")
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
        .replace(/%2A/g, '*')
        .replace(/%7E/g, '~')
    );
  }

  static urlencode(str: string | null): string | null {
    if (str === null) {
      return null;
    }
    return encodeURIComponent(str)
      .replace(/%20/g, '+')
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/~/g, '%7E');
  }

  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static getDateFromString(str: string | null): Date | null {
    if (str === null) {
      return null;
    }
    let day: number = 0;
    let month: number = 0;
    let year: number = 0;
    let hour: number = 0;
    let minutes: number = 0;
    const seconds: number = 0;

    if (str.includes(' ')) {
      const strParts: string[] = str.split(' ');
      const dateParts: string[] = strParts[0].split('/');
      const hourParts: string[] = strParts[1].split(':');
      day = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      year = parseInt(dateParts[2]);
      hour = parseInt(hourParts[0]);
      minutes = parseInt(hourParts[1]);
    } else {
      const dateParts: string[] = str.split('/');
      day = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      year = parseInt(dateParts[2]);
    }

    const date: Date = new Date(year, month, day, hour, minutes, seconds);
    return date;
  }

  static getStringFromDate(d: Date | null): string | null {
    if (d === null) {
      return null;
    }
    const dia: string = d.getDate().toString().padStart(2, '0');
    const mes: string = (d.getMonth() + 1).toString().padStart(2, '0');
    const año: number = d.getFullYear();
    const hora: string = d.getHours().toString().padStart(2, '0');
    const minutos: string = d.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} ${hora}:${minutos}`;
  }
}
