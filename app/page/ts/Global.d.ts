declare namespace Global {
    export type Dictionary<T> = { [key: string]: T; }


}
declare class Guid {
    static NewGuid(): Guid
    ToString(arg: string): string
}




declare interface Window {
    recordDetails?:any;
    showOrHideAside(url?: string);
    HideUserAside(params?:any):void;
}

declare interface HTMLDivElement{
    data?:any
}

declare function getAllPropertyNames<T>(t: T): string[];

declare interface Event
{
    path:EventTarget[];
}