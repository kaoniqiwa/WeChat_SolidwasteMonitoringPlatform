import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SessionUser } from "../../common/session-user";
import { WeChatUser } from "../../data-core/model/we-chat";
import { AsideControl } from "./aside";
import { ToastIcon, ToastMessage } from "./data-controllers/modules/ToastMessage";




namespace UserListPage {
    class Page {

        asideControl: AsideControl;

        toastMessage: ToastMessage;

        element = {
            back: document.querySelector('#back') as HTMLTemplateElement,
            content: document.querySelector('#content') as HTMLDivElement,
            template: document.querySelector('#infoTemplate') as HTMLTemplateElement,
            setPage: document.querySelector('#setPage') as HTMLDivElement,
            iframe: document.querySelector('#user-child-iframe') as HTMLIFrameElement,
            search: document.querySelector('#searchInput') as HTMLInputElement,
            link: {
                details: document.getElementById("link-user-details") as HTMLLinkElement
            }
        }



        userInfos: Map<string, WeChatUser> = new Map()


        constructor(private user: SessionUser, private service: Service) {
            this.asideControl = new AsideControl('aside', true);
            window.HideUserAside = (userId?) => {
                
                this.asideControl.Hide();
                if (userId) {
                    let e = document.getElementById(userId);
                    if (e) {
                        e.parentElement!.removeChild(e);
                    }
                    this.userInfos.delete(userId);
                    this.toastMessage.show("删除成功", ToastIcon.success)
                }
            }

            this.toastMessage = new ToastMessage({
                id: "message",
                parent: document.body
            });
        }

        async loadData() {
            let a = await this.loadWechatUser();
            return 'success';
        }
        loadWechatUser() {
            return this.service.wechat.list().then((res) => {
                res.forEach((v) => {
                    this.userInfos.set(v.Id!, v)
                })
            }).catch((er) => {
                console.warn(er)
            })
        }
        init() {

            // 创建主页面
            this.createContent();

            // 创建侧边
            // this.createAside();


            this.element.search.value = '';

            if (!refreshed) {
                this.bindEvents();
            }

        }

        private filter(source?: string, value?: string) {
            if (!value) {
                return true;
            }
            let index = -1;
            if (source) {
                index = source.toLowerCase().indexOf(value);
            }
            return index >= 0;
        }

        search() {
            let filter = this.element.search.value.toLowerCase();
            this.userInfos.forEach((value: WeChatUser, key: string) => {
                if (value.Id) {
                    let id = value.Id;
                    let element = document.getElementById(id);
                    if (element) {
                        if (this.filter(value.LastName, filter) ||
                            this.filter(value.FirstName, filter) ||
                            this.filter(value.MobileNo, filter)) {
                            element.style.display = '';
                        }
                        else {
                            element.style.display = 'none';
                        }
                    }

                }

            });

        }


        createContent() {
            let that = this;
            console.log(this.userInfos)
            if (this.element.content && this.element.template) {
                this.element.content.innerHTML = '';
                let tempContent = this.element.template.content as DocumentFragment;
                for (let [k, v] of this.userInfos) {

                    let info = tempContent.cloneNode(true) as HTMLDivElement;

                    let name = info.querySelector('.user-name') as HTMLDivElement;
                    name.innerHTML = '';
                    if (v.LastName) {
                        name.innerHTML += v.LastName;
                    }
                    if (v.FirstName) {
                        name.innerHTML += v.FirstName;
                    }
                    if (v.Resources && v.Resources.length > 0) {
                        let source = info.querySelector('.user-source') as HTMLDivElement;
                        if (v.Resources[0].Name) {
                            source.innerHTML = v.Resources[0].Name;
                        }
                    }

                    var main = info.querySelector(".info-item") as HTMLDivElement;
                    main.id = v.Id!;
                    main.data = v;
                    main.addEventListener('click', function () {
                        if (this.data) {

                            console.log('info click');
                            that.element.iframe.src = that.element.link.details.href + "?openid=" + that.user.WUser.OpenId + "&childId=" + (this.data as WeChatUser).Id;
                            that.asideControl.Show();
                        }
                    });



                    this.element.content.appendChild(info)
                }
            }
        }
        bindEvents() {
            this.element.back.addEventListener('click', () => {
                window.parent.HideUserAside();
            })
            this.element.search.addEventListener("search", () => {
                this.search();
            })
        }
        showOrHideAside() {
            if (this.element.setPage.classList.contains('fadeIn')) {
                this.element.setPage.classList.remove('fadeIn');
            } else {
                this.element.setPage.classList.add('fadeIn');
            }
        }
    }


    let refreshed = false;
    if (location.search) {
        const client = new HowellHttpClient.HttpClient();
        client.login((http: HowellAuthHttp) => {

            const service = new Service(http);
            const stationClient = new Page(
                client.user,
                service
            );

            let miniRefresh = new MiniRefresh({
                container: '#minirefresh',
                isLockX: false,
                down: {
                    callback: function () {
                        // 下拉事件
                        refreshed = true;
                        console.log('down')
                        render().then(() => {
                            miniRefresh.endDownLoading();
                        })
                    }
                },
                up: {
                    isAuto: true,
                    // isLock: true,
                    callback: function () {
                        // 上拉事件
                        miniRefresh.endUpLoading(true);
                        console.log('up')

                    }
                }
            });
            render()

            function render() {
                return stationClient.loadData()
                    .then((res) => {
                        stationClient.init();
                    })
            }

        });

    }
}
