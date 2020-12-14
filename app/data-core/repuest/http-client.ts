
import { HowellAuthHttp } from "./howell-auth-http";
import { WeChatRequestService } from "./we-chat.service";
import { SessionUser } from "../../common/session-user";
import { getQueryVariable } from "../../common/tool";
export namespace HowellHttpClient {

    export class HttpClient {
        userService: WeChatRequestService;
        user: SessionUser;
        constructor() {
            this.user = new SessionUser();
            this.userService = new WeChatRequestService(this.http);
        }

        async login(fn?: (http: HowellAuthHttp) => void) {
            const openid = getQueryVariable('openid');             
            if(!openid) mui.openWindow({
                url: '../../verification.html',
                id: '../../verification.html', 
            });     
            if (window['DIGEST'] == null&&openid) {
                this.user.user = {
                    name:openid,
                    pwd:'123456'
                } 
                 
                const a = await this.userService.login(()=>{
                    mui.openWindow({
                        url: '../../verification.html',
                        id: '../../verification.html',
    
                    });    
                });
                // a['data'].Resources[0].Id='310109011029';
                // a['data'].Resources[0].Name='黄山路居委会';
                // a['data'].Resources[0].ResourceType=2;   
                // a['data'].Resources[0].Id='310109011013002000';
                // a['data'].Resources[0].Name='新中新村-厢1';
                // a['data'].Resources[0].ResourceType=3;    
                this.user.WUser = a['data'];    
                  
                if( !a['data'])
                mui.openWindow({
                    url: '../../verification.html',
                    id: '../../verification.html',

                }); 
                else
                    mui.openWindow({
                        url: '../../me.html'+`?openid=${this.user.name}`,
                        id: '../../me.html' +`?openid=${this.user.name}`

                    });
                       
            }
            if (fn) fn(this.http);
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