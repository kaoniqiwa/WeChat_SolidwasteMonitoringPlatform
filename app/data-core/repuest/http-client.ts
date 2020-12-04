
import { HowellAuthHttp } from "./howell-auth-http";
import { WeChatRequestService } from "./we-chat.service"; 
import { SessionUser } from "../../common/session-user";
export namespace HowellHttpClient {

    export class HttpClient {
        userService: WeChatRequestService;
        user:SessionUser;
        constructor() {
           this.user = new SessionUser();
            this.userService = new WeChatRequestService(this.http);
        }

        async login(fn?:()=>void) {
        if(window['DIGEST'] == null){
            const a=    await this.userService.login();        
            this.user.WUser=a['data'];
            console.log(a['data']);
        }
        if(fn)fn(); 
        }

        get http() {             
            var http_: HowellAuthHttp;
            if (window['APPHTTP'] == null)
                window['APPHTTP'] = new HowellAuthHttp(this.user.name, this.user.pwd);
            http_ = window['APPHTTP'];
            return http_;
        }


    }
}