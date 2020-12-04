declare module 'style/other.css'


interface IAccept {
    (lib: string | string[], callback: (module:string) => void): void
}
declare var module:webpackModule;

interface webpackModule{
    hot:{
        accept:IAccept
    }
}



