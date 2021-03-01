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
import { IGarbageStationController } from "./data-controllers/IController";
import { ClassNameHelper, Language } from "./language";


let Swiper = Reflect.get(window, 'Swiper');
let $ = Reflect.get(window, '$');

enum ZoomStatus {
    out = "zoomOut",
    in = "zoomIn"
}

class GarbageStationClient {
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
    swiper: typeof Swiper;
    swiperStatus: boolean = false;
    originStatus: boolean = false;

    asideControl: AsideControl;
    asidePage?: AsideListPage;
    asideIframe: HTMLIFrameElement;

    selectedDivisions: Map<string, any> = new Map();

    private customElement = document.createElement('div');

    dataController: IGarbageStationController;
    type: ResourceType;

    constructor(type: ResourceType, dataController: IGarbageStationController
        //     {
        //     garbageStation: GarbageStationRequestService,        
        //     division: DivisionRequestService,
        //     camera: CameraRequestService,
        //     media: ResourceMediumRequestService
        // }
    ) {
        this.type = type;
        this.dataController = dataController;


        this.asideControl = new AsideControl("aside-control");
        this.asideControl.backdrop = document.querySelector(".backdrop") as HTMLDivElement;
        this.asideIframe = document.querySelector("#aside-iframe") as HTMLIFrameElement;

        this.content = document.querySelector('#content');
        this.template = document.querySelector('#card-template') as HTMLTemplateElement;
        this.asideTemplate = document.querySelector('#aside-template') as HTMLTemplateElement;
        this.asideMain = document.querySelector('.aside-main') as HTMLDivElement;

        this.btnDivision = document.querySelector('#btn_division') as HTMLDivElement;
        this.imgDivision = document.querySelector('#img_division') as HTMLDivElement;

        this.searchInput = document.querySelector('#searchInput') as HTMLInputElement;

        this.btnSearch = document.querySelector('#btn_search') as HTMLInputElement;

        this.originImg = document.querySelector('#origin-img') as HTMLDivElement;
        this.hwBar = document.querySelector('.hw-bar') as HTMLDivElement;

        this.swiper = new Swiper(this.originImg, {
            zoom: true,
            width: window.innerWidth,
            virtual: true,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
            },
            on: {
                click: () => {

                    $(this.originImg).fadeOut(() => {
                        this.originStatus = false;
                    })


                    $(this.hwBar).fadeIn()


                    this.swiper.virtual.slides.length = 0;
                    this.swiper.virtual.cache = [];
                    this.swiperStatus = false;
                },
            },

        });

    }

    init() {

        // 创建主页面
        this.createContent();

        // 创建侧边
        if (!refreshed) {
            let promise = this.dataController.getResourceRoleList();
            promise.then(x => {
                this.createAside(this.type, x);
            })
        }
        if (!refreshed) {

            this.bindEvents();
        }

        let icon = document.querySelector('#img_division i') as HTMLElement;
        icon.className = "howell-icon-list";
        this.zoomIn();

    }
    bindEvents() {
        this.btnDivision.addEventListener('click', () => {
            this.asideControl.Show();

        })
        this.imgDivision.addEventListener('click', () => {
            // 在蒙版消失之前，所有按钮不能点击
            
            if (this.originStatus) return
            if (this.zoomStatus == ZoomStatus.in) {
                let icon = this.imgDivision.getElementsByClassName("howell-icon-list")[0]
                icon.className = "howell-icon-list2";
                this.zoomOut();
            } else {
                let icon = this.imgDivision.getElementsByClassName("howell-icon-list2")[0]
                icon.className = "howell-icon-list";
                this.zoomIn();
            }
            console.log("imgDivision click", this.zoomStatus)


        })
        this.searchInput.addEventListener('search', (e) => {
            this.filerContent();

        })
        this.btnSearch.addEventListener('click', () => {
            this.filerContent();
        })
        // 用私有变量监听事件
        this.customElement.addEventListener('cat', (e: any) => {
            this.showDetail({
                id: e.detail.id,
                index: e.detail.index
            });
        })
    }

    setFooter(id: string, divisionId: string) {
        let p = this.dataController.getDivision(divisionId);
        p.then(division => {
            let info = document.getElementById(id) as HTMLDivElement;

            let content_footer = info.querySelector('.content__footer .division-name') as HTMLDivElement;
            content_footer.innerHTML = division.Name;
        });
    }
    setNumberStatic(ids: string[]) {
        let roles = ids.map(x => {
            let role = new ResourceRole();
            role.Id = x;
            role.ResourceType = type;
            return role;
        })
        let promise = this.dataController.getGarbageStationStatisticNumberListInToday(roles);
        promise.then(array => {
            for (let i = 0; i < array.length; i++) {
                const numberStatic = array[i];
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
        );

    }


    createContent() {
        let _this = this;
        if (this.content && this.template) {
            this.content.innerHTML = '';
            let tempContent = this.template?.content as DocumentFragment;

            let promise = this.dataController.getGarbageStationList();

            promise.then(async garbageStations => {
                for (let i = 0; i < garbageStations.length; i++) {
                    const v = garbageStations[i];

                    if (typeof v.StationState == "number") {
                        v.StationState = new Flags<StationState>(v.StationState);
                    }
                    if (!v.DivisionId)
                        continue;

                    let info = tempContent.cloneNode(true) as DocumentFragment;

                    // 最外层div
                    let content_card = info.querySelector('.hw-content__card') as HTMLDivElement;
                    content_card.setAttribute('id', v.Id)
                    content_card.setAttribute('divisionid', v.DivisionId)


                    // 标题
                    let title_head = info.querySelector('.content__title__head') as HTMLDivElement;
                    title_head.textContent = v.Name

                    // 标题状态
                    let title_bandage = info.querySelector('.content__title__badage') as HTMLDivElement;

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


                    //所在居委会         

                    this.setFooter(v.Id, v.DivisionId);
                    // 加载图片
                    let container = info.querySelector('.content__img .swiper-container');
                    let wrapper = info.querySelector('.content__img .swiper-wrapper') as HTMLDivElement;
                    let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement;


                    let imageUrls: Array<string> = [];


                    this.dataController.getCameraList(v.Id, (cameraId: string, url?: string) => {
                        let img = document.getElementById(cameraId) as HTMLImageElement;
                        // img.setAttribute('index', index + '')
                        img.src = url!;
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

                    // 父元素代理子元素的点击事件
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

                    this.content?.appendChild(info)
                    this.garbageElements.set(v.Id, {
                        Element: content_card,
                        id: v.Id,
                        divisionId: v.DivisionId,
                        imageUrls: imageUrls
                    })
                }

                this.setNumberStatic(garbageStations.map(x => x.Id));
            });



        }
    }
    createAside(type: ResourceType, roles: Array<ResourceRole>) {
        if (this.asideIframe.contentWindow) {
            let currentWindow = this.asideIframe.contentWindow as AsideListPageWindow;
            this.asidePage = currentWindow.Page;
            this.asidePage.canSelected = true;
            this.asidePage.selectionMode = SelectionMode.single;
            this.asidePage.view({
                title: Language.ResourceType(type),
                items: roles.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name!
                    };
                }),
                footer_display: true
            })
            this.asidePage.confirmclicked = (selecteds) => {
                let selectedIds = [];
                for (let id in selecteds) {
                    selectedIds.push(id)
                }
                this.confirmSelect(selectedIds)
            }
        }
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
        this.asideControl.Hide();
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
        let str = this.searchInput.value;
        for (let [k, v] of this.garbageElements) {
            let div = v.Element;
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


        for (let i = 0; i < imgs.length; i++) {
            let url = this.dataController.getImageUrl(imgs[i]);
            this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img src="' + url +
                '" /></div>');
        }
        this.swiper.slideTo(info.index);

        $(this.originImg).fadeIn(() => {
            this.originStatus = true
        })
        $(this.hwBar).fadeOut()


        this.swiperStatus = true;

    }
    hideDetail() {


    }


}

let refreshed = false;

const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;

const service = new Service(http);
const type = user.WUser.Resources![0].ResourceType;
const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);
const stationClient = new GarbageStationClient(type, dataController);



let MiniRefresh = Reflect.get(window, 'MiniRefresh')
let miniRefresh = new MiniRefresh({
    container: '#minirefresh',
    isLockX: false,
    down: {
        callback: () => {
            // 下拉事件

            refreshed = true;
            if (stationClient.asidePage) {
                stationClient.asidePage.resetSelected();
            }
            // render().then(() => {
            //     miniRefresh.endDownLoading();
            // })
            render();
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

// 加载数据，数据加载完成，创建页面内容
render()

function render() {

    stationClient.init();


    // return stationClient.loadData()
    //     .then((res) => {
    //         stationClient.init();
    //     })
    // .catch((e) => {
    //     console.error(`出错了~ ${e}`)
    // })
}

