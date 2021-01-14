import { SessionUser } from "../../common/session-user";
import { GenderType, ResourceType } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";

namespace UserDetailsPage {

    class Language {
        static ResourceType(type: ResourceType) {
            switch (type) {
                case ResourceType.County:
                    return '街道';
                case ResourceType.Committees:
                    return '居委会';
                case ResourceType.GarbageStations:
                    return '厢房';
                default:
                    return ''
            }
        }

        static Gender(gender: GenderType) {
            switch (gender) {
                case GenderType.male:
                    return '男';
                case GenderType.female:
                    return '女'
                default:
                    return '';
            }
        }
    }


    class Page {
        constructor(
            private user: SessionUser,
            private service: Service
        ) {

        }




        element = {
            btn: {
                back: document.getElementById('back') as HTMLDivElement
            },
            info: {
                name: document.getElementById('user-name') as HTMLDivElement,
                mobileNo: document.getElementById('user-mobileNo') as HTMLDivElement,
                gender: document.getElementById('user-gender') as HTMLDivElement,
                count: document.getElementById('user-resources-count') as HTMLDivElement,
                type: document.getElementById('user-resource-type') as HTMLDivElement
            }
        }


        init() {
            this.element.info.name.innerHTML = '';
            if (this.user.WUser.LastName) {
                this.element.info.name.innerHTML += this.user.WUser.LastName;
            }
            if (this.user.WUser.FirstName) {
                this.element.info.name.innerHTML += this.user.WUser.FirstName;
            }
            if (this.user.WUser.MobileNo) {
                this.element.info.mobileNo.innerHTML = this.user.WUser.MobileNo;
            }
            if (this.user.WUser.Gender) {
                const language = Language.Gender(this.user.WUser.Gender);
                this.element.info.gender.innerHTML = language;
            }

            if (this.user.WUser.Resources) {
                this.element.info.count.innerHTML = this.user.WUser.Resources.length.toString();
                if (this.user.WUser.Resources.length > 0) {
                    const language = Language.ResourceType(this.user.WUser.Resources[0].ResourceType);
                    this.element.info.type.innerHTML = language;
                }
            }


            this.element.btn.back.addEventListener('click', () => {
                window.parent.HideUserAside();
            });
        }
    }

    if (location.search) {
        const client = new HowellHttpClient.HttpClient();
        client.login((http: HowellAuthHttp) => {            
            const service = new Service(http);
            const page = new Page(client.user, service);
            page.init();
        });
    }
}
