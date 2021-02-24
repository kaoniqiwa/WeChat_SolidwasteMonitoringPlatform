import { SessionUser } from "../../common/session-user";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { GarbageStation, GetGarbageStationsParams } from "../../data-core/model/waste-regulation/garbage-station";
import { GenderType, ResourceRole, ResourceType, WeChatUser } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { Language } from "./language";

let $ = Reflect.get(window, '$');

class AddUser {
    myData: Map<string, Division> = new Map();
    garbageStations: Map<string, GarbageStation> = new Map();

    language: string = '';
    resourceType: ResourceType = ResourceType.GarbageStations;

    selectedData: Map<string, any> = new Map();
    myUser = new WeChatUser();

    constructor(private user: SessionUser, private service: Service) {
        this.element.info.ugender.selectedIndex = -1;
    }
    element = {
        info: {
            uname: document.querySelector('#uname') as HTMLInputElement,
            uphone: document.querySelector('#uphone') as HTMLInputElement,
            ugender: document.querySelector('#ugender') as HTMLSelectElement,
            type: document.querySelector('#type')!,
            ruleArea: document.querySelector('#area > span') as HTMLSpanElement,

            $toast:$('#toast'),
            $warnToast:$('#warnToast'),
            $textToast: $('#textToast'),
            $toastContent: $('#textToast .weui-toast__content'),
        },
        btn: {
            area: document.querySelector('#area')!,
            back: document.getElementById('back') as HTMLDivElement,
            addBtn: document.getElementById('addBtn') as HTMLDivElement
        },
        aside: {
            backdrop: document.querySelector('.backdrop') as HTMLDivElement,
            asideContent: document.querySelector('.aside-content') as HTMLDivElement,
            asideTitle: document.querySelector('.aside-title') as HTMLHeadElement,
            asideMain: document.querySelector('.aside-main') as HTMLDivElement,
            asideTemplate: document.querySelector('#aside-template') as HTMLTemplateElement,
            footerReset: document.querySelector('.footer-reset') as HTMLDivElement,
            footerConfirm: document.querySelector('.footer-confirm') as HTMLDivElement,
        }
    }
    async loadData() {
        if (this.user.WUser.Resources) {
            if (this.user.WUser.Resources.length > 0) {
                let resourceType = this.user.WUser.Resources[0].ResourceType;
                let resourceId = this.user.WUser.Resources[0].Id;

                this.resourceType = resourceType;
                this.language = Language.ResourceType(this.resourceType + 1);

                if (resourceType == ResourceType.County) {
                    // 当前是街道权限,拉取下级居委会列表
                    this.myData = await this.loadDivisionList(resourceId);
                    
                } else if (resourceType == ResourceType.Committees) {
                    // 当前是居委会权限,拉取下级厢房列表
                    this.myData = await this.LoadGarbageStation(resourceId);
                    
                }

            }
        }
    }
    init() {

        this.createMain();

        this.createAside();

        this.bindEvents();

    }
    createMain() {

        this.element.info.type.innerHTML = this.language;

        // 性别默认未知
        //this.myUser.Gender = Number(this.element.info.ugender.value);
        this.myUser.CanCreateWeChatUser = (this.resourceType + 1 == 2);
    }
    createAside() {
        let self = this;

        this.element.aside.asideTitle.innerHTML = this.language;
        this.element.aside.asideMain!.innerHTML = '';

        let tempContent = this.element.aside.asideTemplate?.content as DocumentFragment;

        for (let [k, v] of this.myData) {
            // 不能在 documentFragment 上添加任何事件
            let info = tempContent.cloneNode(true) as DocumentFragment;
            let div = info.querySelector('div.aside-item') as HTMLDivElement;
            div!.textContent = v.Name;
            div.setAttribute('id', v.Id);
            this.element.aside.asideMain!.appendChild(info)
        }
    }
    bindEvents() {
        let self = this;

        this.element.info.uname.addEventListener('change', function () {
            self.myUser.LastName = this.value;
        })
        this.element.info.uphone.addEventListener('change', function () {
            self.myUser.MobileNo = this.value;
        })
        this.element.info.ugender.addEventListener('change', function () {
            self.myUser.Gender = Number(this.value);
        })
        this.element.btn.area.addEventListener('click', () => {
            this.showOrHideAside()
        })
        this.element.btn.back.addEventListener('click', () => {
            window.parent?.HideUserAside();
        });
        this.element.aside.backdrop.addEventListener('click', () => {
            this.showOrHideAside()
        })

        this.element.aside.footerReset.addEventListener('click', () => {
            this.resetSelected()
        })
        this.element.aside.footerConfirm.addEventListener('click', () => {
            this.confirmSelect()
        })
        this.element.btn.addBtn.addEventListener('click', () => {
            this.createUser();
        })
        document.querySelectorAll('.aside-item').forEach(item => {
            item.addEventListener('click', function (this: any) {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected')
                    self.selectedData.delete(this.id)

                } else {
                    // 街道下面的居委会只能选择一个
                    if (self.resourceType == ResourceType.County) {
                        for (let [k, v] of self.selectedData) {
                            v.Element.classList.remove('selected')
                        }
                        self.selectedData.clear();

                    }
                    this.classList.add('selected');

                    self.selectedData.set(this.id, {
                        Element: this,
                        id: this.id,
                        name: this.textContent,
                        resourceType: self.resourceType + 1
                    })

                }
            })
        })

    }

    loadDivisionList(ParentId: string) {
        // 将数组 map 化返回
        let mapedDivisions = new Map();
        var req = new GetDivisionsParams();
        req.ParentId = ParentId;


        return this.service.division.list(req).then(x => {
            let divisions = x.Data.sort((a, b) => {
                return a.Name.localeCompare(b.Name);
            });

            divisions.forEach(division => {
                mapedDivisions.set(division.Id, division)
            })
            return mapedDivisions

        });
    }
    LoadGarbageStation(DivisionId: string) {
        const request = new GetGarbageStationsParams();
        request.DivisionId = DivisionId;
        let mapedStations = new Map()
        return this.service.garbageStation.list(request).then(x => {
            x.Data.forEach(data => {
                mapedStations.set(data.Id, data)
            })

            return mapedStations;

        });
    }
    showOrHideAside() {
        if (this.element.aside.asideContent.classList.contains('active')) {
            this.element.aside.asideContent.classList.remove('active');
            this.element.aside.backdrop.classList.remove('active');
        } else {
            this.element.aside.asideContent.classList.add('active')
            this.element.aside.backdrop.classList.add('active')
        }
    }

    resetSelected() {
        for (let [k, v] of this.selectedData) {
            v.Element.classList.remove('selected')
        }
        this.selectedData.clear();


    }
    confirmSelect() {

        this.element.info.ruleArea.textContent = '添加'

        let selectedIds = [];

        for (let v of this.selectedData.values()) {
            selectedIds.push(v.id);
            if (this.resourceType == ResourceType.County) {
                this.element.info.ruleArea.textContent = v.name
            } else if (this.resourceType == ResourceType.Committees) {
                this.element.info.ruleArea.textContent = this.selectedData.size.toString()
            }
        }
        let Resources = [];
        for (let [k, v] of this.selectedData) {
            let role = new ResourceRole();
            role.Name = v.name;
            role.Id = v.id;
            role.RoleFlags = 0;
            role.AllSubResources = false;
            role.ResourceType = v.resourceType
            Resources.push(role)
        }
        this.myUser.Resources = Resources;


        this.showOrHideAside();

    }
    createUser() {
        if (!this.myUser.LastName) {
            this.showTextToast('请填写姓名')
            return;
        }
        if (!this.myUser.MobileNo) {
            this.showTextToast('请填写手机号');
            return;
        }
        let reg = /(1[3|4|5|6|7|8])[\d]{9}/
        if (!reg.test(this.myUser.MobileNo)) {
            this.showTextToast('请填写正确手机号'); return false;
        }
        if (!this.myUser.Resources || this.myUser.Resources.length == 0) {
            this.showTextToast('请选择管辖范围');
            return
        }


        this.service.wechat.create(this.myUser).then((res:any)=>{
            
            if(res.FaultCode == 0){
                //this.showToast();
                window.parent?.HideUserAside("true");
            }else{
                this.showWarnToast()
            }
        })
    }
    showToast(){
        let $toast = this.element.info.$toast;

        if ($toast.css('display') != 'none') return;
        $toast.fadeIn(100);
        setTimeout(function () {
            $toast.fadeOut(100);
        }, 1000);
    }
    showWarnToast(){
        let $warnToast = this.element.info.$warnToast;

        if ($warnToast.css('display') != 'none') return;
        $warnToast.fadeIn(100);
        setTimeout(function () {
            $warnToast.fadeOut(100);
        }, 1000);
    }
    showTextToast(msg: string) {
        let $textToast = this.element.info.$textToast;
        let $toastContent = this.element.info.$toastContent;
        $toastContent.html(msg);

        if ($textToast.css('display') != 'none') return;
        $textToast.fadeIn(100);
        setTimeout(function () {
            $textToast.fadeOut(100,function(){
                $toastContent.html('howell');
            });
        }, 1000);
    }

}


if (location.search) {
    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {
        const user = new SessionUser();
        const service = new Service(http);
        const page = new AddUser(client.user, service);

        // 数据请求完成，初始化页面
        page.loadData().then(() => {
            page.init()
        });
    });
}
