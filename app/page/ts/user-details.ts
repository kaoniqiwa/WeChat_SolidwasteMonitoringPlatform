import { SessionUser } from "../../common/session-user";
import { DivisionType } from "../../data-core/model/waste-regulation/division";
import { GenderType, ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow } from "./aside-list";

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

        asideDivision: AsideControl;
        asidePage?: AsideListPage.Page;
        constructor(
            private user: SessionUser,
            private service: Service
        ) {
            this.asideDivision = new AsideControl("aside-divisions", true);
            this.asideDivision.backdrop = document.querySelector(".backdrop") as HTMLDivElement;

        }

        loadDivision(type: ResourceType, resources: ResourceRole[]) {

            let promise = this.service.division.list({
                Ids: resources.map(x => x.Id)
            });
            promise.then(res => {
                let data = res.Data.Data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name
                    }
                });
                if (this.element.iframe.contentWindow) {
                    let currentWindow = this.element.iframe.contentWindow as AsideListPageWindow;
                    this.asidePage = currentWindow.Page;
                    this.asidePage.canSelected = false;
                    this.asidePage.view({
                        title: Language.ResourceType(type),
                        items: data,
                        footer_display: false
                    });
                    this.asidePage.confirmclicked = (selecteds) => {
                        this.dividionsPageConfirm(selecteds);
                    }
                }
            })
        }

        loadGarbageStations(resources: ResourceRole[]) {
            let promise = this.service.garbageStation.list({Ids:resources.map(x=>x.Id)});
            promise.then(res=>{
                let data = res.Data.Data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name
                    }
                });
                if (this.element.iframe.contentWindow) {
                    let currentWindow = this.element.iframe.contentWindow as AsideListPageWindow;
                    this.asidePage = currentWindow.Page;
                    this.asidePage.canSelected = false;
                    this.asidePage.view({
                        title: Language.ResourceType(ResourceType.GarbageStations),
                        items: data,
                        footer_display: false
                    });
                    this.asidePage.confirmclicked = (selecteds) => {
                        this.dividionsPageConfirm(selecteds);
                    }
                }
            });
        }



        dividionsPageConfirm(selecteds: Global.Dictionary<AsideListPage.AsideListItem>) {
            console.warn(this);
            this.asideDivision.Hide();
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
            },
            iframe: document.getElementById("iframe-divisions") as HTMLIFrameElement
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

            this.element.info.count.addEventListener('click', () => {
                this.asideDivision.Show();
                if (this.user.WUser.Resources && this.user.WUser.Resources.length > 0) {
                    let resource = this.user.WUser.Resources[0];
                    if (!this.asidePage) {
                        switch (resource.ResourceType) {
                            case ResourceType.County:
                            case ResourceType.Committees:

                                this.loadDivision(this.user.WUser.Resources[0].ResourceType, this.user.WUser.Resources);

                                break;
                            case ResourceType.GarbageStations:
                                this.loadGarbageStations(this.user.WUser.Resources);
                                    break;
                            default:
                                break;
                        }
                    }
                }
            })
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
