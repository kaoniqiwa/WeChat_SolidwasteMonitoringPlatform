import { SessionUser } from "../../common/session-user";
import { OnlineStatus } from "../../data-core/model/waste-regulation/camera";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { GarbageStation, GetGarbageStationsParams, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ResourceType } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";


let Swiper = Reflect.get(window, 'Swiper');
let $ = Reflect.get(window, '$');


class GarbageStationClient {
    content: HTMLElement | null;
    template: HTMLTemplateElement | null;
    asideTemplate: HTMLTemplateElement | null;
    asideMain?: HTMLDivElement;
    divisions: Map<string, Division> = new Map();
    garbageStations: Map<string, GarbageStation> = new Map();
    GarbageStationNumberStatistic: Map<string, GarbageStationNumberStatistic> = new Map();
    garbageElements: Map<string, any> = new Map();
    garbageElementsDivision: Map<string, any> = new Map();

    footerReset: HTMLDivElement;
    footerConfirm: HTMLDivElement;
    backdrop: HTMLDivElement;
    btnDivision: HTMLDivElement;
    imgDivision: HTMLDivElement;
    asideContent: HTMLDivElement;
    searchInput: HTMLInputElement;
    btnSearch: HTMLElement;
    originImg: HTMLDivElement;
    hwBar: HTMLDivElement

    zoomStatus: string = 'zoomIn';
    swiper: typeof Swiper;
    swiperStatus: boolean = false;
    originStatus: boolean = false;




    selectedDivisions: Map<string, any> = new Map();

    private customElement = document.createElement('div');

    constructor(private user: SessionUser, private service: Service
        //     {
        //     garbageStation: GarbageStationRequestService,        
        //     division: DivisionRequestService,
        //     camera: CameraRequestService,
        //     media: ResourceMediumRequestService
        // }
    ) {
        this.content = document.querySelector('#content');
        this.template = document.querySelector('#card-template') as HTMLTemplateElement;
        this.asideTemplate = document.querySelector('#aside-template') as HTMLTemplateElement;
        this.asideMain = document.querySelector('.aside-main') as HTMLDivElement;

        this.btnDivision = document.querySelector('#btn_division') as HTMLDivElement;
        this.imgDivision = document.querySelector('#img_division') as HTMLDivElement;
        this.asideContent = document.querySelector('.aside-content') as HTMLDivElement;

        this.footerReset = document.querySelector('.footer-reset') as HTMLDivElement;
        this.footerConfirm = document.querySelector('.footer-confirm') as HTMLDivElement;

        this.backdrop = document.querySelector('.backdrop') as HTMLDivElement;

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
    async loadData() {
        if (!this.user.WUser.Resources)
            return;
        let divisionIds: string[];
        let stationIds = this.user.WUser.Resources.filter(x => x.ResourceType == ResourceType.GarbageStations).map(x => {
            return x.Id
        })
        divisionIds = this.user.WUser.Resources.filter(x =>
            x.ResourceType == ResourceType.Committees
        ).map(x => {
            return x.Id
        })

        if (divisionIds.length < 2) {
            this.btnDivision.style.display = "none";
        }
        divisionIds = divisionIds.concat(this.user.WUser.Resources.filter(x => {
            return x.ResourceType == ResourceType.County;
        }
        ).map(x => {
            this.btnDivision.style.display = "";
            return x.Id
        }));

        this.divisions = await this.LoadDivisionList(divisionIds);
        let divisionId;
        if (divisionIds.length > 0) {
            divisionId = divisionIds[0];
        }
        this.garbageStations = await this.LoadGarbageStation({
            divisionId: divisionId,
            stationIds: stationIds
        });
        var ids = Array.from(this.garbageStations.keys());
        await this.LoadIllegalDropEventRecord(ids);
        return 'success'
    }

    async LoadIllegalDropEventRecord(ids: Array<string>) {
        const param = new GetGarbageStationStatisticNumbersParams();
        param.Ids = ids;
        const res = await this.service.garbageStation.statisticNumberList(param);

        for (let i = 0; i < res.Data.Data.length; i++) {
            const data = res.Data.Data[i];
            this.GarbageStationNumberStatistic.set(data.Id, data);
        }

    }


    LoadDivisionList(divisionIds: string[]) {

        // 将数组 map 化返回
        let mapedDivisions = new Map();
        var req = new GetDivisionsParams();
        req.Ids = divisionIds;

        return this.service.division.list(req).then(x => {

            let divisions = x.Data.Data.sort((a, b) => {
                return a.Name.localeCompare(b.Name);
            });

            divisions = divisions.filter(division => !['3'].includes(division.DivisionType.toString()));

            divisions.forEach(division => {
                mapedDivisions.set(division.Id, division)
            })
            return mapedDivisions

        });
    }
    LoadGarbageStation(opts: { divisionId?: string, stationIds: string[] }) {
        const request = new GetGarbageStationsParams();
        request.Ids = opts.stationIds;
        request.DivisionId = opts.divisionId;
        let mapedStations = new Map()
        return this.service.garbageStation.list(request).then(x => {

            x.Data.Data.forEach(data => {
                mapedStations.set(data.Id, data)
            })

            return mapedStations;

        });
    }
    init() {

        // 创建主页面
        this.createContent();

        // 创建侧边
        this.createAside();

        if (!refreshed) {
            this.bindEvents();
        }

    }
    bindEvents() {
        this.backdrop.addEventListener('click', () => {
            this.showOrHideAside()
        })

        this.footerReset.addEventListener('click', () => {
            this.resetSelected()
        })
        this.footerConfirm.addEventListener('click', () => {
            this.confirmSelect()
        })
        this.btnDivision.addEventListener('click', () => {
            this.showOrHideAside()
        })
        this.imgDivision.addEventListener('click', () => {
            // 在蒙版消失之前，所有按钮不能点击
            if (this.originStatus) return
            if (this.zoomStatus == 'zoomIn') {
                let icon = this.imgDivision.getElementsByClassName("howell-icon-list")[0]
                icon.className = "howell-icon-list2";
                this.zoomOut();
                this.zoomStatus = 'zoomOut';
            } else {
                let icon = this.imgDivision.getElementsByClassName("howell-icon-list2")[0]
                icon.className = "howell-icon-list";
                this.zoomIn();
                this.zoomStatus = 'zoomIn'
            }

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
    createContent() {
        let _this = this;
        if (this.content && this.template) {
            this.content.innerHTML = '';
            let tempContent = this.template?.content as DocumentFragment;
            for (let [k, v] of this.garbageStations) {
                if (!v.DivisionId)
                    continue;
                let division = this.divisions.get(v.DivisionId);
                let numberStatic = this.GarbageStationNumberStatistic.get(v.Id);

                let info = tempContent.cloneNode(true) as DocumentFragment;

                // 最外层div
                let content_card = info.querySelector('.hw-content__card') as HTMLDivElement;
                content_card.setAttribute('id', 'hw' + v.Id)
                content_card.setAttribute('divisionid', 'hw' + v.DivisionId)


                // 标题
                let title_head = info.querySelector('.content__title__head') as HTMLDivElement;
                title_head.textContent = v.Name

                // 标题状态
                let title_bandage = info.querySelector('.content__title__badage') as HTMLDivElement;

                title_bandage.classList.remove('red');
                title_bandage.classList.remove('green');
                title_bandage.classList.remove('orange');

                let status = '';
                switch (v.StationState) {
                    case StationState.Normal:
                        title_bandage.textContent = '正常';
                        title_bandage.classList.add('green')
                        break;
                    case StationState.Full:
                        title_bandage.textContent = '满溢';
                        title_bandage.classList.add('orange')
                        break;
                    case StationState.Error:
                        title_bandage.textContent = '异常';
                        title_bandage.classList.add('red')
                        break;

                }

                //所在居委会
                let content_footer = info.querySelector('.content__footer .division-name') as HTMLDivElement;
                content_footer.textContent = division!.Name;

                // 加载图片
                let container = info.querySelector('.content__img .swiper-container');
                let wrapper = info.querySelector('.content__img .swiper-wrapper') as HTMLDivElement;
                let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement;

                if (numberStatic) {
                    let illegalDrop = info.querySelector('.illegalDrop-number') as HTMLSpanElement;
                    let illegalDropNumber = numberStatic.TodayEventNumbers.filter(x => x.EventType == EventType.IllegalDrop);
                    if (illegalDropNumber && illegalDropNumber.length > 0) {
                        illegalDrop.innerHTML = illegalDropNumber[0].DayNumber.toString();
                    }
                    let mixedInto = info.querySelector('.MixedInto-number') as HTMLSpanElement;
                    let mixedIntoNumber = numberStatic.TodayEventNumbers.filter(x => x.EventType == EventType.MixedInto);
                    if (mixedIntoNumber && mixedIntoNumber.length > 0) {
                        mixedInto.innerHTML = mixedIntoNumber[0].DayNumber.toString();
                    }
                }
                let imageUrls: Array<string> = [];

                this.service.camera.list(v.Id).then(res => {
                    let cameras = res.data.Data.sort((a, b) => {
                        return a.CameraUsage - b.CameraUsage || a.Name.localeCompare(b.Name);
                    });
                    cameras.forEach((camera, index) => {
                        camera.OnlineStatus = OnlineStatus.Offline;
                        let imageUrl = "";
                        if (camera.ImageUrl) {
                            imageUrl = this.service.medium.getData(camera.ImageUrl)!;
                        }
                        else {
                            imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
                        }
                        imageUrls.push(imageUrl)
                        let div: HTMLDivElement;

                        index != 0 ? div = slide?.cloneNode(true) as HTMLDivElement : div = slide;

                        let img = div!.querySelector('img') as HTMLImageElement;
                        img.setAttribute('index', index + '')
                        img!.src = imageUrl;
                       

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
        }
    }
    createAside() {
        let _this = this;
        this.asideMain!.innerHTML = '';
        let tempContent = this.asideTemplate?.content as DocumentFragment;

        for (let [k, v] of this.divisions) {
            let info = tempContent.cloneNode(true) as DocumentFragment;
            let div = info.querySelector('div.aside-item') as HTMLDivElement;
            div!.textContent = v.Name;
            div.setAttribute('id', v.Id);
            div.addEventListener('click', function () {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected')
                    _this.selectedDivisions.delete(v.Id)

                } else {
                    this.classList.add('selected');


                    _this.selectedDivisions.set(v.Id, {
                        Element: this,
                        id: v.Id
                    })
                }
            })
            this.asideMain!.appendChild(info)
        }
    }
    resetSelected() {
        for (let [k, v] of this.selectedDivisions) {
            v.Element.classList.remove('selected')
        }
        this.selectedDivisions.clear();


    }
    confirmSelect() {

        let selectedIds = [];

        for (let v of this.selectedDivisions.values()) {
            selectedIds.push(v.id)
        }

        for (let [k, v] of this.garbageElements) {
            if (selectedIds.length == 0 || selectedIds.includes(v.divisionId)) {
                v.Element.style.display = 'block'
            } else {
                v.Element.style.display = 'none'
            }
        }
        this.showOrHideAside();

    }
    showOrHideAside() {
        if (this.asideContent.classList.contains('active')) {
            this.asideContent.classList.remove('active');
            this.backdrop.style.display = 'none'
        } else {
            this.backdrop.style.display = 'block'
            this.asideContent.classList.add('active')
        }
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
        for (let [k, v] of this.garbageElements) {
            let contentCard = v.Element;
            contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
                element.classList.add('zoomOut');
            });

            contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
                element.classList.add('zoomOut');
            });
            contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
                element.classList.add('zoomOut');
            });
            contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
                element.classList.add('zoomOut');
            });

            let container = contentCard.querySelector('.swiper-container');
            container.scrollLeft = 0;
            container.classList.add('zoomOut');

            let pagination = contentCard.querySelector('.swiper-pagination');

            v.swiper = new Swiper(container, { pagination: { el: pagination, type: 'fraction' } })



        }
    }
    zoomIn() {
        for (let [k, v] of this.garbageElements) {
            let contentCard = v.Element;
            contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
                element.classList.remove('zoomOut');
            });
            contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
                element.classList.remove('zoomOut');
            });
            contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
                element.classList.remove('zoomOut');
            });

            contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
                element.classList.remove('zoomOut');
            });

            let container = contentCard.querySelector('.swiper-container');
            container.classList.remove('zoomOut');


            let swiper = v.swiper;
            if (swiper)
                swiper.destroy();
            v.swiper = null;
        }
    }
    showDetail(info: { id: string, index: number }) {
        let element = this.garbageElements.get(info.id)
        let imgs = element.imageUrls


        for (let i = 0; i < imgs.length; i++) {
            this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img src="' + imgs[i] +
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

const client = new HowellHttpClient.HttpClient();
client.login((http: HowellAuthHttp) => {
    const user = new SessionUser();
    const service = new Service(http);
    const stationClient = new GarbageStationClient(
        user,
        service
    );



    let MiniRefresh = Reflect.get(window, 'MiniRefresh')
    let miniRefresh = new MiniRefresh({
        container: '#minirefresh',
        isLockX: false,
        down: {
            callback: function () {
                // 下拉事件
                refreshed = true;
                render().then(() => {
                    miniRefresh.endDownLoading();
                })

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
        return stationClient.loadData()
            .then((res) => {
                stationClient.init();
            })
        // .catch((e) => {
        //     console.error(`出错了~ ${e}`)
        // })
    }
});
