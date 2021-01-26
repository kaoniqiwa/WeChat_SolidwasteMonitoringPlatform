import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SRServer } from "../../data-core/model/aiop/sr-server";
import { SessionUser } from "../../common/session-user";
import { AsideControl } from "./aside";


namespace UserPage {
    class Page {

        aside: AsideControl;


        constructor(private user: SessionUser, private service: Service) {
            this.aside = new AsideControl("aside");

        }

        element = {
            aside: document.getElementById('aside')!,
            btn: {
                details: document.getElementById('btn-user-details')!,
                add: document.getElementById('btn-add-user')!,
                list: document.getElementById('btn-user-list')!
            },
            info: {
                name: document.getElementById('name')!,
                resource: {
                    name: document.getElementById('resource-name')!
                }
            },
            iframe: document.getElementById('user-child-iframe') as HTMLIFrameElement,
            link:{
                details:document.getElementById("link-details") as HTMLLinkElement,
                list:document.getElementById("link-list") as HTMLLinkElement,
                add:document.getElementById("link-add") as HTMLLinkElement
            }
        }

        init() {
            this.loadUser();
            window.element = this.element;
            window.HideUserAside = this.hideAside;
            this.element.btn.details.addEventListener('click', () => {
                const url = this.element.link.details.href +"?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
            })
            this.element.btn.list.addEventListener('click', () => {
                const url = this.element.link.list.href +"?openid=" + this.user.WUser.OpenId;
                this.showAside(url)
            })
            this.element.btn.add.addEventListener('click', () => {
                const url = this.element.link.add.href +"?openid=" + this.user.WUser.OpenId;
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



        hideAside() {
            this.element.aside.classList.remove('active');
        }
    }

    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {

        const user = new SessionUser();
        const service = new Service(http);
        const page = new Page(user, service);
        page.init();
    });


}
