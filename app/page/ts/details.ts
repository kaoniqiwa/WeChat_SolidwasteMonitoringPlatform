import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";

namespace UserDetailsPage {
    class Page {
        constructor(
            private user: SessionUser,
            private service: Service
        ) {
            
         }

        element = {
            btn: {
                back: document.getElementById('back')!
            },
            info:{
                name:document.getElementById('user-name')!,
                mobileNo:document.getElementById('user-mobileNo')!
            }
        }


        init() {

            // this.element.info.name.innerHTML = this.user.WUser.Id!
            // this.element.info.mobileNo.innerHTML = this.user.WUser.MobileNo!;            

            // this.element.btn.back.addEventListener('click', ()=>{                
            //     window.parent.HideUserAside();
            // });
        }
    }


    const client = new HowellHttpClient.HttpClient();
    // client.login((http: HowellAuthHttp) => {
        // const user = new SessionUser();
        // console.log(user)
        // const service = new Service(http);
        // const page = new Page(user, service);
        // page.init();
    // });
}
