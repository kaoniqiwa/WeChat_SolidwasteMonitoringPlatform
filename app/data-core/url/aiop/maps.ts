import {  IUrl} from "../IUrl";
export class GisMap implements IUrl{
    create(): string {
        throw new Error("Method not implemented.");
    }
    edit(id:string): string {
       return `Maps/${id}`
    }
    del(id:string): string {
        return `Maps/${id}`
    }
    get(id:string): string {
        return `Maps/${id}`
    }
    list(...param: string[]): string {
        throw new Error("Method not implemented.");
    }

}


export class GisMapElement implements IUrl{
    create(mapId:string): string {
        return `Maps/${mapId}/Elements`;
    }
    edit(mapId:string,eleId:string): string {
        return `Maps/${mapId}/Elements/${eleId}`;
    }
    del(mapId:string,eleId:string): string {
        return `Maps/${mapId}/Elements/${eleId}`;
    }
    get(mapId:string,eleId:string): string {
        return `Maps/${mapId}/Elements/${eleId}`;
    }
    list(...param: string[]): string {
        return ``;
    }

}

export  class GisMapElementResource implements IUrl{
    create(mapId:string,eleId:string,sourceId:string): string {
        return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
    }
    edit(): string {
        return ``;
    }
    del(mapId:string,eleId:string,sourceId:string): string {
        return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
    }
    get(mapId:string,eleId:string,sourceId:string): string {
        return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
    }
    list(mapId:string,eleId:string): string {
        return `Maps/${mapId}/Elements/${eleId}/Resources`;
    }

}