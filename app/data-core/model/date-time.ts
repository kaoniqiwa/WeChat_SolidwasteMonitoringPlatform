import { dateFormat } from '../../common/tool'

export class DateTime {
  date: Date = new Date()

  constructor(
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number
  )
  constructor(date?: DateTime | Date | string | number)
  constructor(
    dateOrYear?: DateTime | Date | string | number,
    month?: number,
    day: number = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    ms: number = 0
  ) {
    if (dateOrYear === undefined) {
      this.date = new Date()
    } else {
      if (month === undefined) {
        if (typeof dateOrYear === 'string' || typeof dateOrYear === 'number') {
          this.date = new Date(dateOrYear)
        } else if (dateOrYear instanceof Date) {
          this.date = dateOrYear
        } else {
          this.date = dateOrYear.date
        }
      } else {
        this.date = new Date(
          dateOrYear as number,
          month,
          day,
          hours,
          minutes,
          seconds,
          ms
        )
      }
    }
  }

  format(fmt: string) {
    if (this.date.format) {
      return this.date.format(fmt)
    }
    return dateFormat(this.date, fmt)
  }
  toString(): string {
    return this.date.toString()
  }
  toDateString(): string {
    return this.date.toDateString()
  }
  toTimeString(): string {
    return this.date.toTimeString()
  }
  toLocaleString(): string
  toLocaleString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string
  toLocaleString(locales?: any, options?: any): string {
    return this.date.toLocaleString(locales, options)
  }
  toLocaleDateString(): string
  toLocaleDateString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string
  toLocaleDateString(locales?: any, options?: any): string {
    return this.date.toLocaleDateString(locales, options)
  }
  toLocaleTimeString(): string
  toLocaleTimeString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string
  toLocaleTimeString(locales?: any, options?: any): string {
    return this.date.toLocaleTimeString(locales, options)
  }
  valueOf(): number {
    return this.date.valueOf()
  }
  getTime(): number {
    return this.date.getTime()
  }
  getFullYear(): number {
    return this.date.getFullYear()
  }
  getUTCFullYear(): number {
    return this.date.getUTCFullYear()
  }
  getMonth(): number {
    return this.date.getMonth()
  }
  getUTCMonth(): number {
    return this.date.getUTCMonth()
  }
  getDate(): number {
    return this.date.getDate()
  }
  getUTCDate(): number {
    return this.date.getUTCDate()
  }
  getDay(): number {
    return this.date.getDay()
  }
  getUTCDay(): number {
    return this.date.getUTCDay()
  }
  getHours(): number {
    return this.date.getHours()
  }
  getUTCHours(): number {
    return this.date.getUTCHours()
  }
  getMinutes(): number {
    return this.date.getMinutes()
  }
  getUTCMinutes(): number {
    return this.date.getUTCMinutes()
  }
  getSeconds(): number {
    return this.date.getSeconds()
  }
  getUTCSeconds(): number {
    return this.date.getUTCSeconds()
  }
  getMilliseconds(): number {
    return this.date.getMilliseconds()
  }
  getUTCMilliseconds(): number {
    return this.date.getUTCMilliseconds()
  }
  getTimezoneOffset(): number {
    return this.date.getTimezoneOffset()
  }
  setTime(time: number): number {
    return this.date.setTime(time)
  }
  setMilliseconds(ms: number): number {
    return this.date.setMilliseconds(ms)
  }
  setUTCMilliseconds(ms: number): number {
    return this.date.setUTCMilliseconds(ms)
  }
  setSeconds(sec: number, ms: number = 0): number {
    if (ms === undefined) {
      return this.date.setSeconds(sec)
    } else {
      return this.date.setSeconds(sec, ms)
    }
  }
  setUTCSeconds(sec: number, ms: number = 0): number {
    if (ms === undefined) {
      return this.date.setUTCSeconds(sec)
    } else {
      return this.date.setUTCSeconds(sec, ms)
    }
  }
  setMinutes(min: number, sec: number = 0, ms: number = 0): number {
    return this.date.setMinutes(min, sec, ms)
  }
  setUTCMinutes(min: number, sec: number = 0, ms: number = 0): number {
    return this.date.setUTCMinutes(min, sec, ms)
  }
  setHours(
    hours: number,
    min: number = 0,
    sec: number = 0,
    ms: number = 0
  ): number {
    return this.date.setHours(hours, min, sec, ms)
  }
  setUTCHours(
    hours: number,
    min: number = 0,
    sec: number = 0,
    ms: number = 0
  ): number {
    return this.date.setUTCHours(hours, min, sec, ms)
  }
  setDate(date: number): number {
    return this.date.setDate(date)
  }
  setUTCDate(date: number): number {
    return this.date.setUTCDate(date)
  }
  setMonth(month: number, date: number = 0): number {
    return this.date.setMonth(month, date)
  }
  setUTCMonth(month: number, date: number = 0): number {
    return this.date.setUTCMonth(month, date)
  }
  setFullYear(year: number, month: number = 0, date: number = 0): number {
    return this.date.setFullYear(year, month, date)
  }
  setUTCFullYear(year: number, month: number = 0, date: number = 0): number {
    return this.date.setUTCFullYear(year, month, date)
  }
  toUTCString(): string {
    return this.date.toUTCString()
  }
  toISOString(): string {
    return this.date.toISOString()
  }
  toJSON(key?: any): string {
    return this.date.toJSON(key)
  }
}
