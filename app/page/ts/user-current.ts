import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SessionUser } from "../../common/session-user";
import { AsideControl } from "./aside";
import { NavigationWindow } from ".";
import { ToastIcon, ToastMessage } from "./data-controllers/modules/ToastMessage";


export interface UserWindow extends Window{
    User:SessionUser;
    Authentication:HowellAuthHttp
}


namespace UserPage {
    class Page {

        aside: AsideControl;
        message: ToastMessage;

        constructor(private user: SessionUser, private service: Service) {
            this.aside = new AsideControl("aside");
            this.message = new ToastMessage({
                id: "message",
                parent: document.body
            })
        }

        element = {
            aside: document.getElementById('aside')!,
            btn: {
                details: document.getElementById('btn-user-details')!,
                add: document.getElementById('btn-add-user')!,
                list: document.getElementById('btn-user-list')!,
                pushManager:document.getElementById('btn-push-manager') as HTMLDivElement
            },
            info: {
                name: document.getElementById('name')!,
                resource: {
                    name: document.getElementById('resource-name')!
                }
            },
            iframe: document.getElementById('user-child-iframe') as HTMLIFrameElement,
            link: {
                details: document.getElementById("link-details") as HTMLLinkElement,
                list: document.getElementById("link-list") as HTMLLinkElement,
                add: document.getElementById("link-add") as HTMLLinkElement,
                pushManager:document.getElementById("link-push") as HTMLLinkElement
            }
        }

        init() {
            this.loadUser();
            window.element = this.element;
            window.HideUserAside = (result) => {
                this.hideAside(result);
            };
            this.element.btn.details.addEventListener('click', () => {
                const url = this.element.link.details.href + "?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
            })
            this.element.btn.list.addEventListener('click', () => {
                const url = this.element.link.list.href + "?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
            })
            this.element.btn.add.addEventListener('click', () => {
                const url = this.element.link.add.href + "?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
            })
            this.element.btn.pushManager.addEventListener('click', ()=>{
                const url = this.element.link.pushManager.href + "?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
                
            })
        }

        loadUser() {

            if (this.user.WUser.CanCreateWeChatUser) {
                this.element.btn.add.style.display = "";
                this.element.btn.list.style.display = "";
            }

            this.element.info.name.innerHTML = '';
            this.element.info.name.innerHTML += this.user.WUser.MobileNo;
            // this.element.info.name.innerHTML += this.user.WUser.FirstName;
            if (this.user.WUser.Resources && this.user.WUser.Resources.length > 0) {
                this.element.info.resource.name.innerHTML = this.user.WUser.Resources[0].Name!;
            }

        }
        showAside(url: string) {
            this.element.iframe.src = url;
            this.element.aside.classList.add('active');
        }



        hideAside(result?: string) {
            this.element.aside.classList.remove('active');
            
            if (result) {
                this.message.show("添加成功", ToastIcon.success);
            }
        }
    }

    const user = (window.parent as NavigationWindow).User;
    const http = (window.parent as NavigationWindow).Authentication;
    (window as unknown as UserWindow).User = user;
    (window as unknown as UserWindow).Authentication = http;
    const service = new Service(http);
    const page = new Page(user, service);
    page.init();

}
