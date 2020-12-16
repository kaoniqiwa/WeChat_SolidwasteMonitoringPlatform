
import {  IUrl, BaseUrl} from "./IUrl";
export class Mediume extends BaseUrl {
    add(){
        return this.gateway+`Pictures`;
    }
    
    getData(id:string){
        return this.gateway+`Pictures/${id}.jpg`;
    }

    getJPG(jpg:string){
        return this.gateway+`Pictures/${jpg}`; 
    }
} 