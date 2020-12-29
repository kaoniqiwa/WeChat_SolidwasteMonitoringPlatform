
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

        async login(seccess?: (http: HowellAuthHttp) => void, faild?: () => void) {
            const openid = getQueryVariable('openid');
            if (window['DIGEST'] == null && openid) {
                this.user.user = {
                    name: openid.trim(),
                    pwd: '123456'
                }

                const a = await this.userService.login(() => {

                });

                console.log(a);

                if (a && a['data']) {
                    this.user.WUser = a['data'];
                    if (seccess) seccess(this.http);
                }
                else {
                    if (faild) {
                        faild();
                    }
                }

            }

        }

        async login2(fn?: (http: HowellAuthHttp) => void) {
            const openid = getQueryVariable('openid'), eventId = getQueryVariable('eventid');

            if (eventId && !openid) {
                window.location.href = "http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetUserOpenId?appid=wx119358d61e31da01&returnUrl="
                    + window.location.href;
            }
            else if (eventId && openid) {
                if (window['DIGEST'] == null) {
                    this.user.user = {
                        name: openid,
                        pwd: '123456'
                    }

                    const a = await this.userService.login(() => {

                    });
                    if (a && a['data'])
                        this.user.WUser = a['data'];
                    if (fn) fn(this.http);
                }
            }
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