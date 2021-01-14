import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SRServer } from "../../data-core/model/aiop/sr-server";
import { SessionUser } from "../../common/session-user";


namespace UserPage {
    class Page {
        constructor(private user: SessionUser, private service: Service) { }

        element = {
            aside: {
                details: document.getElementById('user-details')!,
                add: document.getElementById('add-user')!,
                list: document.getElementById('user-list')!
            },
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
            iframe: {
                details: document.getElementById('user-details-iframe') as HTMLIFrameElement
            }
        }

        init() {
            this.loadUser();
            window.element = this.element;
            window.HideUserAside = this.hideAside;
            this.element.btn.details.addEventListener('click', () => {
                this.showDetailsAside();
            })
            this.element.iframe.details.src = "./user/details.html?openid=" + this.user.WUser.OpenId;
        }

        loadUser() {
            this.element.info.name.innerHTML = '';
            this.element.info.name.innerHTML += this.user.WUser.MobileNo;
            // this.element.info.name.innerHTML += this.user.WUser.FirstName;
            if (this.user.WUser.Resources && this.user.WUser.Resources.length > 0) {
                this.element.info.resource.name.innerHTML = this.user.WUser.Resources[0].Name!;
            }

        }



        showDetailsAside() {
            this.element.aside.details.classList.add('active');
        }

        hideAside() {            
            this.element.aside.add.classList.remove('active');
            this.element.aside.details.classList.remove('active');
            this.element.aside.list.classList.remove('active');
        }


        /* showOrHideDivisionsAside() {

            if (element.aside.divisions.classList.contains('active')) {
                element.aside.divisions.classList.remove('active');

                element.aside.backdrop.style.display = 'none'
            } else {
                element.aside.backdrop.style.display = 'block'
                element.aside.divisions.classList.add('active')
            }
        } */
    }

    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {

        const user = new SessionUser();
        const service = new Service(http);
        const page = new Page(user, service);
        page.init();
    });


}
