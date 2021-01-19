import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SRServer } from "../../data-core/model/aiop/sr-server";
import { SessionUser } from "../../common/session-user";
import { WeChatUser } from "../../data-core/model/we-chat";



declare var MiniRefresh: any;


namespace UserListPage {
    class Page {

        element = {
            back: document.querySelector('#back') as HTMLTemplateElement,
            content: document.querySelector('#content') as HTMLDivElement,
            template: document.querySelector('#infoTemplate') as HTMLTemplateElement,
            setPage: document.querySelector('#setPage') as HTMLDivElement
        }



        userInfos: Map<string, WeChatUser> = new Map()


        constructor(private user: SessionUser, private service: Service) {

        }
        async loadData() {
            let a = await this.loadWechatUser();
            return 'success';
        }
        loadWechatUser() {
            return this.service.user.list().then((res) => {
                let fake = {
                    "Id": '1212',
                    "OpenId": "12121",
                    "MobileNo": "18221772092",
                    "FirstName": "zhang",
                    "LastName": "san",
                    "Gender": 1,
                    "Resources": [
                        {
                            "Id": "12",
                            "Name": "街道",
                            "ResourceType": 1,
                            "RoleFlags": 0,
                            "AllSubResources": true,
                            "Resources": [

                            ]
                        }
                    ],
                    "ServerId": "1212",
                    "Note": "3333",
                    "CanCreateWeChatUser": true
                } as WeChatUser;

                res.data = Array(20).fill(fake);
                console.log('res', res)

                res.data.forEach((v) => {
                    this.userInfos.set('info' + v.Id + Math.random() * 999, v)
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

            if (!refreshed) {
                console.log('bind event')
                this.bindEvents();
            }

        }
        createContent() {
            let _this = this;
            console.log(this.userInfos)
            if (this.element.content && this.element.template) {
                this.element.content.innerHTML = '';
                let tempContent = this.element.template.content as DocumentFragment;
                for (let [k, v] of this.userInfos) {
                    let info = tempContent.cloneNode(true) as DocumentFragment;
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

                    this.element.content.appendChild(info)
                }
            }
        }
        bindEvents() {
            this.element.back.addEventListener('click', () => {
                window.parent.HideUserAside();
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
