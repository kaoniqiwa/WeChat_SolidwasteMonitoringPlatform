import { GarbageBaseUrl } from "../IUrl";

export class ServersUrl extends GarbageBaseUrl {    

    static create(){
        return this.gateway + `Servers`;        
    }
    static item(serviceId:string){
        return this.gateway + `Servers/${serviceId}`;
    }
    static list(){
        return this.gateway + `Servers/List`;
    }
    static sync(serviceId:string){
        return this.gateway + `Servers/${serviceId}/Sync`;
    }
    static divisions(serviceId:string){
        return this.gateway + `Servers/${serviceId}/Divisions/List`;
    }
    static garbageStations(serviceId:string){
        return this.gateway + ` Servers/${serviceId}/GarbageStations/List`;
    }
    static pictures(serviceId:string, pictureId:string){
        return this.gateway + `Servers/${serviceId}/Pictures/${pictureId}.jpg`;
    }
}