
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { WeChatCodeRequestService, WeChatRequestService } from "../../data-core/repuest/we-chat.service";
import { SessionUser } from "../../common/session-user";
export namespace RegisterPage {

    class Message {
        constructor(private page: Page) { }
        isShow = false;
        show = (message) => {
            this.page.element.message.message.innerText = message;
            this.page.element.message.window.style.display = '';
            this.isShow = true;
        }
        hide = () => {
            this.page.element.message.window.style.display = 'none';
            this.isShow = false;
        }
        autoHide = () => {
            setTimeout(() => {
                this.hide();
            }, 5000);
        }

    }

    class Page {
        element = {
            input: {
                phone: document.getElementById('phone') as HTMLInputElement,
                code: document.getElementById('code') as HTMLInputElement
            },
            button: {
                code: document.getElementById('get_code') as HTMLButtonElement,
                submit: document.getElementById('to_submit') as HTMLButtonElement
            },
            message: {
                window: document.getElementById('js_toast'),
                message: document.getElementById('alertMsg')
            }
        }

        Message: Message;



        constructor() {

            this.element.button.code.disabled = true;
            this.element.button.submit.disabled = true;
            this.Message = new Message(this);
        }

        inSendCodeInterval = false;

        get canSendCode() {
            if (this.element.input.phone.value.length != 11) {
                return false
            }
            if (this.inSendCodeInterval) {
                return false;
            }
            return true;
        }


        gotCode = false;

        number = 60;

        countdownHandle: number;

        countdown() {
            this.countdownHandle = setInterval(() => {
                console.log(this.number);
                this.element.button.code.innerHTML = "重新发送（" + (this.number--) + "）";

                this.inSendCodeInterval = this.number > 0;

                if (!this.inSendCodeInterval) {
                    clearInterval(this.countdownHandle);
                    this.countdownHandle = 0;
                    this.number = 60;
                    this.element.button.code.innerHTML = "重新发送"
                }
                this.element.button.code.disabled = !this.canSendCode;
            }, 1000);
        }

        eventRegist() {
            this.element.input.phone.addEventListener('input', (e) => {
                this.element.button.code.disabled = !this.canSendCode;
            });
            this.element.input.code.addEventListener('input', (e) => {
                this.element.button.submit.disabled = !this.gotCode;
            });
            this.element.button.code.addEventListener('click', (e) => {
                this.element.button.code.disabled = true;
                this.gotCode = true;
                this.countdown();
            })

        }


    }

    //#region Register
    export class Register {
        constructor(
            private page: Page,
            private service: {
                code: WeChatCodeRequestService,
                user: WeChatRequestService
            }) {


        }

        phoneNumber: string;

        eventRegist() {
            this.page.element.button.code.addEventListener("click", () => {
                this.phoneNumber = page.element.input.phone.value;
                this.service.code.getCode(page.element.input.phone.value);
            });
            this.page.element.button.submit.addEventListener("click", async () => {
                const result = await this.service.code.checkCode(this.phoneNumber, this.page.element.input.code.value);

                if (result.success) {

                    const buser = await this.regist();
                    this.page.Message.show("注册成功");
                    setTimeout(() => {
                        location.href = "./index.html?openid=" + buser.OpenId + "&index=4";
                    }, 1500);
                }
                else{
                    this.page.Message.show("验证失败");
                    this.page.Message.autoHide();
                }
            });
        }

        async regist() {
            const user = new SessionUser();
            const buser = await this.service.user.bingingUser(this.phoneNumber, user.name);
            // console.log(buser);
            if (buser.OpenId) {
                user.name = buser.OpenId;
            }
            user.WUser = buser;
            return buser;
        }
    }
    //#endregion

    let page = new Page();
    page.eventRegist();
    var httpClient = new HowellHttpClient.HttpClient();
    let register = new Register(page,
        {
            code: new WeChatCodeRequestService(httpClient.http),
            user: new WeChatRequestService(httpClient.http)
        }
    )
    register.eventRegist();


}

// var httpClient = new HowellHttpClient.HttpClient();

// new RegisterPage.Register({
//     code: new WeChatCodeRequestService(httpClient.http),
//     user: new WeChatRequestService(httpClient.http)
// }).init();