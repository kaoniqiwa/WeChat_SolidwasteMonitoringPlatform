import {  IUrl, BaseUrl} from "../IUrl";

export class Platform extends BaseUrl implements IUrl{
    create(): string {
        return this.gateway + 'Platforms';
    }
    edit(id:string): string {
       return this.gateway + `Platforms/${id}`;
    }
    del(id:string): string {
        return this.gateway + `Platforms/${id}`;
    }
    get(id:string): string {
        return this.gateway + `Platforms/${id}`;
    }
    list(): string {
       return this.gateway + 'Platforms/List';
    }
    sync(id:string): string {
        return this.gateway + `Platforms/${id}/Sync`;
    }

    protocols(){
        return this.gateway + `Platforms/Protocols`;
    }
}