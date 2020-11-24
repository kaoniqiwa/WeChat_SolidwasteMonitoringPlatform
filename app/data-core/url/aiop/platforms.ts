import {  IUrl, BaseUrl} from "../IUrl";

export class Platform extends BaseUrl implements IUrl{
    create(): string {
        return this.aiop + 'Platforms';
    }
    edit(id:string): string {
       return this.aiop + `Platforms/${id}`;
    }
    del(id:string): string {
        return this.aiop + `Platforms/${id}`;
    }
    get(id:string): string {
        return this.aiop + `Platforms/${id}`;
    }
    list(): string {
       return this.aiop + 'Platforms/List';
    }
    sync(id:string): string {
        return this.aiop + `Platforms/${id}/Sync`;
    }

    protocols(){
        return this.aiop + `Platforms/Protocols`;
    }
}