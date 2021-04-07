import { NavigationWindow } from ".";
import { SessionUser } from "../../common/session-user";
import { dateFormat } from "../../common/tool";
import { ResponseData } from "../../data-core/model/response-data";
import { OnlineStatus } from "../../data-core/model/waste-regulation/camera";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { Flags, GarbageStation, GetGarbageStationsParams, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow, SelectionMode } from "./aside-list";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { DataController } from "./data-controllers/DataController";
import { IGarbageStationController, StatisticNumber } from "./data-controllers/IController";
import { ClassNameHelper, Language } from "./language";
import Swiper, { Virtual, Pagination, } from 'swiper';
import $ from 'jquery';
import MyAside from './myAside';
import { GarbageStationViewModel } from "./data-controllers/ViewModels";

// 理论上应在ts中根据需求导入minirefresh，而不是写死在html中，受项目parcel-bundler版本限制，未实现
// import "minirefresh";





// 模块化方式使用 Swiper库
Swiper.use([
    Virtual,
    Pagination
])


enum ZoomStatus {
    out = "zoomOut",
    in = "zoomIn"
}
// 使用简单的观察者模式，实现 GarbageStationClient 和 myAside 类的通信
class GarbageStationClient implements IObserver {
    content: HTMLElement | null;
    template: HTMLTemplateElement | null;
    asideTemplate: HTMLTemplateElement | null;
    asideMain?: HTMLDivElement;

    GarbageStationNumberStatistic: Map<string, GarbageStationNumberStatistic> = new Map();
    garbageElements: Map<string, any> = new Map();
    garbageElementsDivision: Map<string, any> = new Map();

    btnDivision: HTMLDivElement;
    imgDivision: HTMLDivElement;
    searchInput: HTMLInputElement;
    btnSearch: HTMLElement;
    originImg: HTMLDivElement;
    hwBar: HTMLDivElement

    zoomStatus: ZoomStatus = ZoomStatus.in;
    swiper: Swiper;
    swiperStatus: boolean = false;
    originStatus: boolean = false;

    asideControl: AsideControl;
    asidePage?: AsideListPage;
    asideIframe: HTMLIFrameElement;

    selectedDivisions: Map<string, any> = new Map();

    private customElement = document.createElement('div');

    dataController: IGarbageStationController;
    type: ResourceType;
    garbageStations: GarbageStationViewModel[];
    numberList: StatisticNumber[];
    roleList: ResourceRole[];
    myAside: MyAside;
    _show = false;
    get show() {
        return this._show
    }
    set show(val) {
        this._show = val;
        if (val) {
            $(this.elements.asideContainer).show();
            setTimeout(() => {
                this.myAside.slideIn()
            }, 100);
        }
        else {
            setTimeout(() => {
                $(this.elements.asideContainer).hide();
            }, 300);
        }

    }

    elements = {
        doms: {
            container: document.querySelector('#hw-container') as HTMLDivElement,
            template: document.querySelector('#card-template') as HTMLTemplateElement,
        },
        btns: {
            imgDivision: document.querySelector('#img_division') as HTMLDivElement,
            btnDivision: document.querySelector('#btn_division') as HTMLDivElement,
            searchInput: document.querySelector('#searchInput') as HTMLInputElement,
            btnSearch: document.querySelector('#btn_search') as HTMLInputElement,
            imgIcon: document.querySelector('#img_division i') as HTMLElement
        },

        asideContainer: document.querySelector('#aside-container') as HTMLElement,
        originImg: document.querySelector('#origin-img') as HTMLDivElement,
        hwBar: document.querySelector('.hw-bar') as HTMLDivElement,
        backdrop: document.querySelector(".backdrop") as HTMLDivElement
    }

    constructor(type: ResourceType, dataController: IGarbageStationController
    ) {
        this.type = type;
        this.dataController = dataController;



    }
    update(args) {
        if (args && args.selectedItems) {
            let selectedItems = [...args.selectedItems]
            let ids = selectedItems.map(item => {
                return item.getAttribute('id')
            });
            this.confirmSelect(ids);
        }
        if (args && 'show' in args) {
            this.show = args.show;
        }
    }
    init() {
        this.loadData().then(() => {
            this.createAside()
            this.resetBar()
            this.createContent();
            this.createNumberList();

            if (!refreshed) {
                this.bindEvents();
            }
        })

    }
    async loadData() {
        // 拉取厢房数据
        this.garbageStations = await this.dataController.getGarbageStationList();
        let ids = this.garbageStations.map(item => item.Id)
        console.log('厢房数据', this.garbageStations)

        // 获取垃圾厢房当天的统计数据
        let roles = ids.map(x => {
            let role = new ResourceRole();
            role.Id = x;
            role.ResourceType = type;
            return role;
        })
        this.numberList = await this.dataController.getGarbageStationStatisticNumberListInToday(roles);
        console.log('今日统计数据', this.numberList)

        this.roleList = await this.dataController.getResourceRoleList()

    }

    resetBar() {
        this.elements.btns.imgIcon.className = "howell-icon-list";
        this.elements.btns.searchInput.value = "";
    }
    createContent() {
        let _this = this;
        // 清空容器内容
        this.elements.doms.container.innerHTML = "";

        // 模板内容
        let tempContent = this.elements.doms.template?.content as DocumentFragment;

        let len = this.garbageStations.length
        for (let i = 0; i < len; i++) {
            const v = this.garbageStations[i];

            if (typeof v.StationState == "number") {
                v.StationState = new Flags<StationState>(v.StationState);
            }
            if (!v.DivisionId)
                continue;
            let info = tempContent.cloneNode(true) as DocumentFragment;
            let content_card = info.querySelector('.hw-content__card') as HTMLDivElement;
            content_card.setAttribute('id', v.Id)
            content_card.setAttribute('divisionid', v.DivisionId)


            // 标题
            let title_head = info.querySelector('.content__title__head') as HTMLDivElement;
            title_head.textContent = v.Name

            // 标题状态
            let title_bandage = info.querySelector('.content__title__badage') as HTMLDivElement;

            info.querySelector('.constDrop-number').textContent = (v.NumberStatistic.CurrentGarbageTime >> 0) + '';

            title_bandage.classList.remove('red');
            title_bandage.classList.remove('green');
            title_bandage.classList.remove('orange');
            let states = v.StationState as Flags<StationState>;

            if (states.contains(StationState.Error)) {

                title_bandage.textContent = Language.StationState(StationState.Error);
                title_bandage.classList.add('red');
            }
            else if (states.contains(StationState.Full)) {
                title_bandage.textContent = Language.StationState(StationState.Full);
                title_bandage.classList.add('orange');
            }
            else {
                title_bandage.textContent = Language.StationState(StationState.Normal);
                title_bandage.classList.add('green');
            }
            this.createFooter(v.Id, v.DivisionId);

            let wrapper = info.querySelector('.content__img .swiper-wrapper') as HTMLDivElement;
            let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement;
            let imageUrls: Array<string> = [];

            this.dataController.getCameraList(v.Id, (cameraId: string, url?: string) => {
                let img = document.getElementById(cameraId) as HTMLImageElement;
                // img.setAttribute('index', index + '')                        
                img.src = url!;

                img.onerror = () => {
                    img.src = DataController.defaultImageUrl;
                }

            }).then(cameras => {
                cameras.forEach((camera, index) => {

                    imageUrls.push(camera.ImageUrl!)
                    let div: HTMLDivElement;

                    index != 0 ? div = slide?.cloneNode(true) as HTMLDivElement : div = slide;

                    let img = div!.querySelector('img') as HTMLImageElement;
                    img.id = camera.Id;
                    img.setAttribute('index', index + '')
                    // img!.src = camera.ImageUrl!;

                    if (!camera.OnlineStatus == undefined || camera.OnlineStatus == OnlineStatus.Offline) {
                        let nosignal = div.querySelector('.nosignal') as HTMLDivElement;
                        nosignal.style.display = "block";
                    }


                    wrapper!.appendChild(div);
                })
            })
            content_card.addEventListener('click', function (e) {
                let target = e.target as HTMLElement;
                // 如果点击图片，则传递图片index和父元素id
                // 小窗口的时候才会全屏显示功能
                if (target.tagName.toString().toLowerCase() == 'img') {
                    let ev = new CustomEvent('cat', {
                        detail: {
                            index: target.getAttribute('index'),
                            id: v.Id
                        }
                    })
                    _this.customElement.dispatchEvent(ev)
                }

            })

            this.garbageElements.set(v.Id, {
                Element: content_card,
                id: v.Id,
                divisionId: v.DivisionId,
                imageUrls: imageUrls
            })

            this.elements.doms.container?.appendChild(info)
        }
    }
    bindEvents() {
        this.elements.btns.btnDivision.addEventListener('click', () => {
            this.toggle()
        })
        this.elements.btns.imgDivision.addEventListener('click', () => {
            // 在蒙版消失之前，所有按钮不能点击

            if (this.originStatus) return
            if (this.zoomStatus == ZoomStatus.in) {
                let icon = this.elements.btns.imgDivision.getElementsByClassName("howell-icon-list")[0]
                icon.className = "howell-icon-list2";
                this.zoomOut();
            } else {
                let icon = this.elements.btns.imgDivision.getElementsByClassName("howell-icon-list2")[0]
                icon.className = "howell-icon-list";
                this.zoomIn();
            }


        })
        this.elements.btns.searchInput.addEventListener('search', (e) => {
            this.filerContent();

        })
        this.elements.btns.btnSearch.addEventListener('click', () => {
            this.filerContent();
        })
        // // 用私有变量监听事件
        this.customElement.addEventListener('cat', (e: any) => {
            this.showDetail({
                id: e.detail.id,
                index: e.detail.index
            });
        })
    }

    createFooter(id: string, divisionId: string) {
        let p = this.dataController.getDivision(divisionId);
        p.then(division => {
            let info = document.getElementById(id) as HTMLDivElement;

            let content_footer = info.querySelector('.content__footer .division-name') as HTMLDivElement;
            content_footer.innerHTML = division.Name;
        });
    }
    createNumberList() {
        let len = this.numberList.length;
        for (let i = 0; i < len; i++) {
            const numberStatic = this.numberList[i];
            if (numberStatic) {
                let info = document.getElementById(numberStatic.id) as HTMLDivElement;
                if (info) {
                    let illegalDrop = info.querySelector('.illegalDrop-number') as HTMLSpanElement;
                    illegalDrop.innerHTML = numberStatic.illegalDropNumber.toString();
                    let mixedInto = info.querySelector('.MixedInto-number') as HTMLSpanElement;
                    mixedInto.innerHTML = numberStatic.mixedIntoNumber.toString();
                }
            }
        }
    }
    toggle() {
        this.show = !this.show;
    }
    createAside() {
        this.myAside = null;
        this.myAside = new MyAside(this.elements.asideContainer, {
            title: Language.ResourceType(type),
            data: this.roleList
        }, SelectionMode.multiple).init()

        this.myAside.add(this)
    }
    resetSelected() {
        for (let [k, v] of this.selectedDivisions) {
            v.Element.classList.remove('selected')
        }
        this.selectedDivisions.clear();


    }
    confirmSelect(selectedIds: string[]) {

        for (let [k, v] of this.garbageElements) {
            if (selectedIds.length == 0 || selectedIds.includes(v.divisionId) || selectedIds.includes(v.id)) {
                v.Element.style.display = 'block'
            } else {
                v.Element.style.display = 'none'
            }
        }
        if (this.zoomStatus == ZoomStatus.out) {

            this.zoomOut();
        }
        else if (this.zoomStatus == ZoomStatus.in) {

            this.zoomIn();
        }
        else {

        }
        console.log("confirmSelect click", this.zoomStatus)

    }
    filerContent() {
        let str = this.elements.btns.searchInput.value;
        for (let [k, v] of this.garbageElements) {
            let div = v.Element;
            // console.log(div)
            if (str && !div.textContent.includes(str)) {
                div.style.display = 'none';
            } else {
                div.style.display = '';
            }
        }
    }
    zoomOut() {
        console.log(this.garbageElements);
        for (let [k, v] of this.garbageElements) {
            let contentCard = v.Element;
            contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
                element.classList.add(ZoomStatus.out);
            });

            contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
                element.classList.add(ZoomStatus.out);
            });
            contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
                element.classList.add(ZoomStatus.out);
            });
            contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
                element.classList.add(ZoomStatus.out);
            });

            let container = contentCard.querySelector('.swiper-container');
            container.scrollLeft = 0;
            container.classList.add(ZoomStatus.out);

            let pagination = contentCard.querySelector('.swiper-pagination');

            if (v.swiper) {
                v.swiper.destroy();
                v.swiper = null
            }
            v.swiper = new Swiper(container, { pagination: { el: pagination, type: 'fraction' } })



        }

        this.zoomStatus = ZoomStatus.out;
    }
    zoomIn() {
        for (let [k, v] of this.garbageElements) {
            let contentCard = v.Element;
            contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
                element.classList.remove(ZoomStatus.out);
                element.style.width = "";
            });
            contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
                element.classList.remove(ZoomStatus.out);
            });
            contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
                element.classList.remove(ZoomStatus.out);
            });

            contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
                element.classList.remove(ZoomStatus.out);
            });

            let container = contentCard.querySelector('.swiper-container');
            container.classList.remove(ZoomStatus.out);



            if (v.swiper) {
                v.swiper.destroy();
                v.swiper = null
            }
        }

        this.zoomStatus = ZoomStatus.in;
    }
    showDetail(info: { id: string, index: number }) {



        let element = this.garbageElements.get(info.id)

        let imgs = element.imageUrls


        $(this.elements.originImg).fadeIn(() => {
            this.originStatus = true;


            // Swiper初始化时，元素 display不能为 none
            if (!this.swiper) {
                this.swiper = new Swiper(this.elements.originImg, {
                    virtual: true,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                    },
                    on: {
                        click: () => {
                            $(this.elements.originImg).fadeOut(() => {
                                this.originStatus = false;
                                this.swiper.virtual.removeAllSlides()
                                this.swiper.virtual.cache = [];

                            })
                            $(this.elements.hwBar).fadeIn()
                        },
                    },

                });


            }

            for (let i = 0; i < imgs.length; i++) {
                let url = this.dataController.getImageUrl(imgs[i]);
                this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img src="' + url +
                    '" /></div>');
            }
            this.swiper.slideTo(info.index, 0);

        })
        $(this.elements.hwBar).fadeOut()
    }
}

let refreshed = false;

const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;

console.log(user);
const service = new Service(http);
const type = user.WUser.Resources![0].ResourceType;
const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);
const stationClient = new GarbageStationClient(type, dataController);

stationClient.init();



let MiniRefresh = Reflect.get(window, 'MiniRefresh')
let miniRefresh = new MiniRefresh({
    container: '#minirefresh',
    isLockX: false,
    down: {
        callback: () => {
            // 下拉事件

            refreshed = true;
            stationClient.init();
            miniRefresh.endDownLoading();
        }
    },
    up: {
        isAuto: false,
        isLock: true,
        callback: function () {
            // 上拉事件
            miniRefresh.endUpLoading(true);


        }
    }
});

