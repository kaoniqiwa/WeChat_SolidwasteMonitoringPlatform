import { Service } from "../../data-core/repuest/service";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SRServer } from "../../data-core/model/aiop/sr-server";
import { SessionUser } from "../../common/session-user";
import { WeChatUser } from "../../data-core/model/we-chat";



declare var MiniRefresh: any;


namespace UserPage {
    class UserPage {
        content: HTMLDivElement;
        template: HTMLTemplateElement;

        addUser: HTMLDivElement;
        setPage: HTMLDivElement;


        uerInfo = new Map()


        constructor(private user: SessionUser, private service: Service) {
            this.content = document.querySelector('#content') as HTMLDivElement;
            this.template = document.querySelector('#infoTemplate') as HTMLTemplateElement;

            this.addUser = document.querySelector('#addUser') as HTMLDivElement;

            this.setPage = document.querySelector('#setPage') as HTMLDivElement;

            this.bindEvents();
        }

        async loadData() {
            let a = await this.loadWechatUser();
            return 'success';
        }
        loadWechatUser() {
            return this.service.user.list().then((res) => {
                console.log(res)
            }).catch((er) => {
                console.warn(er)
            })
        }
        init() {

            // 创建主页面
            // this.createContent();

            // 创建侧边
            // this.createAside();

            if (!refreshed) {
                console.log('bind event')
                this.bindEvents();
            }

        }
        createContent(){
            let _this = this;
            if (this.content && this.template) {
                this.content.innerHTML = '';
                let tempContent = this.template?.content as DocumentFragment;
                for (let [k, v] of this.uerInfo) {
                    let info = tempContent.cloneNode(true) as DocumentFragment;
                    this.content?.appendChild(info)
                }
            }
        }
        bindEvents() {
            this.addUser.addEventListener('click', () => {
                // this.showOrHideAside();
            })
        }
        showOrHideAside() {
            if (this.setPage.classList.contains('fadeIn')) {
                this.setPage.classList.remove('fadeIn');
            } else {
                this.setPage.classList.add('fadeIn');
            }
        }
    }


    let refreshed = false;


    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {
        const user = new SessionUser();
        const service = new Service(http);
        const stationClient = new UserPage(
            user,
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
                isLock: true,
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
                .catch((e) => {
                    console.error(`出错了~ ${e}`)
                })
        }

    });



    // new UserPage()
}
