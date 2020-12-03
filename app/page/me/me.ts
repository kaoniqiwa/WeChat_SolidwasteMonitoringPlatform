import { MediumPicture } from "../../data-core/url/aiop/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { WeChatRequestService } from "../../data-core/repuest/we-chat.service"; 
import { SessionUser } from "../../common/session-user";
namespace MePage{

    export class Me{
        httpClient: HowellHttpClient.HttpClient;
        requestService: WeChatRequestService; 
        user :SessionUser;
        constructor(){
            this.httpClient = new HowellHttpClient.HttpClient(); 
            this.requestService = new WeChatRequestService(this.httpClient.http);
            this.user=new SessionUser();
             

        }

     async   getUser(){
        await   this.httpClient.login();
        //  const r = await  this.requestService.get(this.user.name);
        }
    }
}

new MePage.Me().getUser();