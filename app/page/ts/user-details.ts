import { SessionUser } from "../../common/session-user";
import { getQueryVariable } from "../../common/tool";
import { ResourceRole, ResourceType, WeChatUser } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { AsideControl } from "./aside";
import { AsideListItem, AsideListPage, AsideListPageWindow } from "./aside-list";
import { Language } from "./language";

namespace UserDetailsPage {




    class Page {

        asideDivision: AsideControl;
        asideSetUser: AsideControl;
        asidePage?: AsideListPage;
        constructor(
            private user: WeChatUser,
            private service: Service,
            private isCurrent = false
        ) {
            this.asideDivision = new AsideControl("aside-divisions");
            this.asideDivision.backdrop = document.querySelector(".backdrop") as HTMLDivElement;
            this.asideSetUser = new AsideControl("aside-set-user");
            window.HideUserAside = (user) => {
                this.asideSetUser.Hide();
                if (user) {
                    console.log(user);
                    this.element.info.name.innerHTML = '';
                    if (user.FirstName) {
                        this.element.info.name.innerHTML = user.FirstName
                    }
                    if (user.LastName) {
                        this.element.info.name.innerHTML += user.LastName;
                    }
                    this.element.info.gender.innerHTML = Language.Gender(user.Gender);
                }
            }
        }

        loadDivision(type: ResourceType, resources: ResourceRole[]) {

            let promise = this.service.division.list({
                Ids: resources.map(x => x.Id)
            });
            promise.then(res => {
                let data = res.Data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name
                    }
                }).sort((a, b) => {
                    return a.name.localeCompare(b.name)
                });

                if (this.element.iframe.divisions.contentWindow) {
                    let currentWindow = this.element.iframe.divisions.contentWindow as AsideListPageWindow;
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
            let promise = this.service.garbageStation.list({ Ids: resources.map(x => x.Id) });
            promise.then(res => {
                let data = res.Data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name
                    }
                });
                if (this.element.iframe.divisions.contentWindow) {
                    let currentWindow = this.element.iframe.divisions.contentWindow as AsideListPageWindow;
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



        dividionsPageConfirm(selecteds: Global.Dictionary<AsideListItem>) {
            console.warn(this);
            this.asideDivision.Hide();
        }



        element = {
            btn: {
                back: document.getElementById('back') as HTMLDivElement,
                delete: document.getElementById('delete') as HTMLLinkElement
            },
            info: {
                name: document.getElementById('user-name') as HTMLDivElement,
                mobileNo: document.getElementById('user-mobileNo') as HTMLDivElement,
                gender: document.getElementById('user-gender') as HTMLDivElement,
                count: document.getElementById('user-resource') as HTMLDivElement,
                type: document.getElementById('user-resource-type') as HTMLDivElement
            },
            iframe: {
                divisions: document.getElementById("iframe") as HTMLIFrameElement,
                setUser: document.getElementById("iframe-set-user") as HTMLIFrameElement
            },
            icons: document.querySelectorAll(".howell-icon-arrow2right"),
            link:{
                setUser:document.getElementById("link-set-user") as HTMLLinkElement
            }
        }


        init() {
            this.element.info.name.innerHTML = '';
            this.element.iframe.setUser.src = this.element.link.setUser.href + "?openid=" + this.user.OpenId;



            if (this.user.FirstName) {
                this.element.info.name.innerHTML += this.user.FirstName;
            }
            if (this.user.LastName) {
                this.element.info.name.innerHTML += this.user.LastName;
            }
            if (this.isCurrent) {
                this.element.info.name.parentElement?.parentElement?.addEventListener("click", () => {
                    this.asideSetUser.Show();
                });
                this.element.info.gender.parentElement?.parentElement?.addEventListener("click", () => {
                    this.asideSetUser.Show();
                });
            }

            if (this.user.MobileNo) {
                this.element.info.mobileNo.innerHTML = this.user.MobileNo;
            }
            if (this.user.Gender) {
                const language = Language.Gender(this.user.Gender);
                this.element.info.gender.innerHTML = language;
            }
            if (this.user.Resources) {
                if (this.user.Resources.length > 0) {
                    this.element.info.count.innerHTML = this.user.Resources[0].Name || "";
                    const language = Language.ResourceType(this.user.Resources[0].ResourceType);
                    this.element.info.type.innerHTML = language;
                }
                if (this.user.Resources.length > 1) {
                    this.element.info.count.innerHTML = this.user.Resources.length.toString();
                    this.element.info.count.addEventListener('click', () => {
                        this.asideDivision.Show();
                        if (this.user.Resources && this.user.Resources.length > 0) {
                            let resource = this.user.Resources[0];
                            if (!this.asidePage) {
                                switch (resource.ResourceType) {
                                    case ResourceType.County:
                                    case ResourceType.Committees:

                                        this.loadDivision(this.user.Resources[0].ResourceType, this.user.Resources);

                                        break;
                                    case ResourceType.GarbageStations:
                                        this.loadGarbageStations(this.user.Resources);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    })
                }
            }


            this.element.btn.back.addEventListener('click', () => {
                window.parent.HideUserAside();
            });
            this.element.btn.delete.addEventListener('click', () => {
                
                if (this.user.Id) {
                    this.service.wechat.del(this.user.Id)
                }
                window.parent.HideUserAside(this.user.Id);
            })

        }
    }

    if (location.search) {

        const client = new HowellHttpClient.HttpClient();
        client.login(async (http: HowellAuthHttp) => {

            const service = new Service(http);
            let user = client.user.WUser;
            let childId = getQueryVariable("childId")
            if (childId) {
                try {
                    
                    user = await service.wechat.get(childId);

                } catch (ex) {
                    console.error(ex);
                }
            }

            const page = new Page(user, service, !childId);

            if (childId) {
                page.element.btn.delete.style.display = "";
                page.element.icons.forEach((val, key) => {
                    (val as HTMLElement).style.visibility = "hidden";
                });
            }


            page.init();
        });
    }
}
