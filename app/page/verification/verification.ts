
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { WeChatCodeRequestService ,WeChatRequestService} from "../../data-core/repuest/we-chat.service";
import { SessionUser } from "../../common/session-user";
export namespace WeChatVerification {

    export class Verification {
        httpClient: HowellHttpClient.HttpClient;
        request: WeChatCodeRequestService;
        userRequest:WeChatRequestService;
        constructor() {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.request = new WeChatCodeRequestService(this.httpClient.http);
            this.userRequest=new WeChatRequestService(this.httpClient.http); 

        }
        init() {
            const phDom = document.getElementById('phone'),
                toastDom = document.getElementById('js_toast'),
                msgDom = document.getElementById('alertMsg'),
                codeBtnDom = document.getElementById('get_code'),
                codeDom = document.getElementById('code'),
                subBtnDom = document.getElementById('to_submit');
            codeBtnDom.addEventListener('click', async () => {
                if (phDom.value.length < 11) {
                    msgDom.innerText = '手机号有误';
                    toastDom.style.display = 'block';
                }
                else {
                    const code = await this.request.getCode(phDom.value);

                    codeDom.value = code;
                }

                setTimeout(() => {
                    msgDom.innerText = '';
                    toastDom.style.display = 'none';
                }, 1500);
            });
            // phDom.addEventListener('blur',()=>{

            // });
            codeDom?.addEventListener('change', (e) => {
                if (!/^[1-9]\d*$/.test(e.data))
                    codeDom.value = '';
                if(codeDom.value.length){
                    subBtnDom?.style.backgroundColor='#3a93ff';
                }
            });

            subBtnDom.addEventListener('click', async () => {
                if (phDom.value.length == 11 && (/^[1-9]\d*$/.test(codeDom.value))) {
                    const result = await this.request.checkCode(phDom.value, codeDom.value),
                    u = new SessionUser();
                    u.name=phDom.value;
                    if (result.success) {
                      const  buser=await  this.userRequest.bingingUser(phDom.value,u.name);
                      console.log(buser);
                      if(buser.OpenId)
                         u.name=buser.OpenId;
                      this.user.WUser = buser;    
                        msgDom.innerText = '注册成功';
                        toastDom.style.display = 'block';
                        setTimeout(() => {
                            mui.openWindow({
                                url: '../../index.html?openid='+phDom.value,
                                id: '../../index.html?openid='+phDom.value',

                            });
                        }, 1500);
                    } 
                    else{
                        msgDom.innerText = '验证失败';
                        toastDom.style.display = 'block';
                    }

                    setTimeout(() => {
                        msgDom.innerText = '';
                        toastDom.style.display = 'none';                      
                    }, 1500);
                } 
            });
        }
    }
}

new WeChatVerification.Verification().init();