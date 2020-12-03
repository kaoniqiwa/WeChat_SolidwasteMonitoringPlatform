import { SaveModel } from "../model/save-model"; 
import { WeChatUser } from "../model/we-chat";
import * as url from "../url/user-url";   
import { HowellAuthHttp } from "./howell-auth-http";
import { Digest } from "./digest";
import { SessionUser } from "../../common/session-user";
import { Response } from '../model/Response';
 
export class WeChatRequestService extends SaveModel{
    url: url.WeChat;
    
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.WeChat();
    }

    login(){
        const   su=new SessionUser(); 
        return this.requestService.auth<Response<WeChatUser>>(this.url.get(su.name),(header)=>{ 
            const digest = new Digest(header,  this.url.get(su.name));             
            return digest;
        });
    }
    create(item:WeChatUser){ 
        return this.requestService.post<WeChatUser, WeChatUser>(this.url.create(), item);
    }

   
    get(id: string) { 
 
        return this.requestService.get<WeChatUser>(this.url.get(id));
    }

    set(item: WeChatUser){
        return this.requestService.put<WeChatUser, WeChatUser>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.delete<WeChatUser>(this.url.del(id));
    }

    list(){
        return this.requestService.get<WeChatUser[]>(this.url.list());         
    }
 

    
}


