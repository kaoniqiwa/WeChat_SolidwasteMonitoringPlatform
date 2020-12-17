
import {  IUrl, BaseUrl} from "./IUrl";
import { SessionUser } from "../../common/session-user";
export class Mediume extends BaseUrl {
    add(){
        return this.gateway+`Pictures`;
    }
    
    getData(id:string){
        const u =new SessionUser();
        if(u.WUser)
           return this.gateway+`Pictures/${id}.jpg?pictureId=${id}&ServerId=${u.WUser.ServerId}`;
    }

    getJPG(jpg:string){
        return this.gateway+`Pictures/${jpg}`; 
    }
} 