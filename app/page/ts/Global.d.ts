declare namespace Global {
  export type Dictionary<T> = { [key: string]: T }
}
declare class Guid {
  static NewGuid(): Guid
  ToString(arg: string): string
}

declare interface Window {
  recordDetails?: any
  showOrHideAside(url?: string)
  HideUserAside(params?: any): void
}

declare interface HTMLDivElement {
  data?: any
}

declare function getAllPropertyNames<T>(t: T): string[]

declare interface Event {
  path: EventTarget[]
}

declare interface Date {
  format?: (format: string) => string
}

declare function base64encode(data: string): string
declare function base64decode(data: string): string

declare function utf16to8(data: string): string
declare function utf8to16(data: string): string
