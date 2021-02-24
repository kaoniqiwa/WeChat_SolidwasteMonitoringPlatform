
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { getQueryVariable, dateFormat, getAllDay } from "../../common/tool";
import { IllegalDropEventData, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { PagedList } from "../../data-core/model/page";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { Service } from "../../data-core/repuest/service";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow, SelectionMode } from "./aside-list";
import { Language } from "./language";
import { IEventHistory, Paged } from "./data-controllers/IController";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { MixedIntoEventData, MixedIntoEventRecord } from "../../data-core/model/waste-regulation/mixed-into-event-record";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { SwiperControl } from "./data-controllers/modules/SwiperControl";
import { EventData, EventRecord, EventRecordData } from "../../data-core/model/waste-regulation/event-record";
import { GarbageFullEventData, GarbageFullEventRecord } from "../../data-core/model/waste-regulation/garbage-full-event-record";
import { NavigationWindow } from ".";
import { DataController } from "./data-controllers/DataController";



declare var weui: any;

export namespace EventHistoryPage {

    var date = new Date();
    var PageSize = 20;
    var element = {
        date: document.getElementById("date")!,
        datePicker: document.getElementById("showDatePicker")!,
        aside: {
            backdrop: document.querySelector('.backdrop') as HTMLDivElement,
            iframe: document.getElementById('aside-iframe') as HTMLIFrameElement
        },
        filterBtn: document.querySelector('#filter') as HTMLDivElement,
        totalRecordCount: document.getElementById("illegalDropTotalRecordCount")!,
        recordCount: document.getElementById("illegalDropRecordCount")!,
        IllegalDrop: {
            list: document.getElementById("illegalDrop") as HTMLDivElement,
        },
        MixedInto: {
            list: document.getElementById("mixedInto") as HTMLDivElement
        },
        GarbageFull: {
            list: document.getElementById("garbageFull") as HTMLDivElement
        }
    }


    var MiniRefreshId = {
        IllegalDrop: "illegalDropRefreshContainer",
        MixedInto: "mixedIntoRefreshContainer",
        GarbageFull: "garbageFullRefreshContainer"
    }

    class Template {
        element: HTMLElement;
        img: HTMLImageElement;
        title: HTMLDivElement;
        footer: HTMLDivElement;
        remark: HTMLDivElement;
        constructor() {
            this.element = document.getElementById('template') as HTMLElement;
            this.img = this.element.getElementsByTagName('img')[0];
            this.title = this.element.getElementsByClassName('title')[0] as HTMLDivElement;
            this.footer = this.element.getElementsByClassName('footer-title')[0] as HTMLDivElement;
            this.remark = this.element.getElementsByClassName('remark')[0] as HTMLDivElement;
            this.clear();
        }
        clear() {
            this.img.src = DataController.defaultImageUrl;
            this.title.innerHTML = "";
            this.footer.innerHTML = "";
            this.remark.innerHTML = "";
        }
    }


    export class IllegalDropEvent {
        /**
         * autho:pmx
         */

        //记录所有的居委会
        asideControl: AsideControl;
        asidePage?: AsideListPage;

        parentElement: { [key: number]: HTMLDivElement } = {};
        miniRefresh: { [key: number]: MiniRefresh } = {};

        filter: {
            date: Date,
            sourceId?: string
        }

        defaultDivisionId = '';
        constructor(private type: ResourceType, private dataController: IEventHistory, private openId: string) {


            this.parentElement[EventType.IllegalDrop] = element.IllegalDrop.list;
            this.parentElement[EventType.MixedInto] = element.MixedInto.list;
            this.parentElement[EventType.GarbageFull] = element.GarbageFull.list;



            this.filter = {
                date: new Date()
            }

            this.asideControl = new AsideControl("aside-content");
            this.asideControl.backdrop = element.aside.backdrop;
            element.filterBtn.addEventListener('click', () => {
                this.asideControl.Show();
            })

        }
        loadAside() {
            this.createAside(this.type);
        }
        async createAside(type: ResourceType) {

            let items = await this.dataController.getResourceRoleList();


            if (element.aside.iframe.contentWindow) {
                let currentWindow = element.aside.iframe.contentWindow as AsideListPageWindow;
                this.asidePage = currentWindow.Page;
                this.asidePage.canSelected = true;
                this.asidePage.selectionMode = SelectionMode.single;
                this.asidePage.view({
                    title: Language.ResourceType(type),
                    items: items.map(x => {
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
                    this.confirmSelect(selectedIds);
                    this.asideControl.Hide();
                }
            }
        }




        confirmSelect(selectedIds?: string[]) {
            this.selectedIds = selectedIds;
            console.log("confirmSelect");
            this.clean();
            this.miniRefresh[this.eventType].resetUpLoading();
        }

        convert(record: IllegalDropEventRecord|GarbageFullEventRecord|MixedIntoEventRecord, index: number, getImageUrl: (id: string) => string | undefined) {
            let template = new Template();
            if (record.ImageUrl) {
                template.img.src = getImageUrl(record.ImageUrl) as string;
            }
            if (record instanceof GarbageFullEventRecord) {
                if (record.Data.CameraImageUrls && record.Data.CameraImageUrls.length > 0) {
                    template.img.src = getImageUrl(record.Data.CameraImageUrls[0].ImageUrl) as string;
                }
            }

            if (record.Data.StationName) {
                template.title.innerHTML = record.Data.StationName;
            }
            if (record.Data.DivisionName) {
                template.footer.innerHTML = record.Data.DivisionName;
            }

            template.remark.innerHTML = dateFormat(new Date(record.EventTime), 'HH:mm:ss');


            let item = document.createElement("div");
            item.id = record.EventId!;
            item.setAttribute('divisionid', record.Data.DivisionId!)
            item.innerHTML = template.element.innerHTML;
            item.getElementsByTagName("img")[0].addEventListener("load", function () {
                this.removeAttribute("data-src");
            })

            item.getElementsByTagName("img")[0].addEventListener("error", function () {
                this.src = DataController.defaultImageUrl;
                this.style.background = "black";
            });

            item.addEventListener("click", () => {

                //window.parent.recordDetails = record;                
                const url = "./event-details.html?openid=" + this.openId + "&pageindex=" + (index) + "&eventtype=" + record.EventType;
                // console.log(window.parent);
                window.parent.showOrHideAside(url);
                // const aside_details = document.getElementById("aside-details") as HTMLIFrameElement;
                // aside_details.src = url;
                // this.showOrHideDetailsAside();
                // if (window.parent.pageJump)
                //     window.parent.pageJump(url);
                // else {
                //     window.parent.document.location.href = url;
                // }
            });
            // this.garbageElements.set(record.EventId, {
            //     Element: item,
            //     id: record.EventId,
            //     divisionId: record.Data.DivisionId,
            // })
            return item;
        }

        datas: Global.Dictionary<EventRecord> = {};

        getElementByDataType(type: EventType) {
            switch (type) {
                case EventType.IllegalDrop:
                    return element.IllegalDrop.list;
                case EventType.MixedInto:
                    return element.MixedInto.list;
                case EventType.GarbageFull:
                    return element.GarbageFull.list;
                default:
                    return undefined;
            }
        }


        view(list: PagedList<IllegalDropEventRecord|MixedIntoEventRecord|GarbageFullEventRecord>) {

            for (let i = 0; i < list.Data.length; i++) {
                const data = list.Data[i];
                this.datas[data.EventId!] = data;
                let item = this.convert(data, (list.Page.PageIndex - 1) * list.Page.PageSize + i, this.dataController.getImageUrl);

                this.parentElement[data.EventType].appendChild(item);
            }
            element.totalRecordCount.innerHTML = list.Page.TotalRecordCount.toString();
            if (list.Page.TotalRecordCount == 0) {
                element.recordCount.innerHTML = "0";
            }
            else {

                console.log("Page", list.Page);
                element.recordCount.innerHTML = (list.Page.PageSize * (list.Page.PageIndex - 1) + list.Page.RecordCount).toString();
            }

        }
        page: { [key: number]: Paged } = {};
        eventType: EventType = EventType.IllegalDrop;
        selectedIds?: string[]
        async refresh(page: Paged, eventType: EventType) {
            console.log("current page", page);
            const day = getAllDay(date);

            let data = await this.dataController.getEventList(day, page, eventType, this.selectedIds);



            if (data) {
                this.view(data);
                if (window.parent) {
                    (window.parent as NavigationWindow).Day = getAllDay(date);
                    (window.parent as NavigationWindow).RecordPage = {
                        index: data.Page.PageIndex,
                        size: data.Page.PageSize,
                        count: data.Page.TotalRecordCount

                    }
                }
            }



            return data;
        }

        clean() {
            this.page = {};
            this.parentElement[this.eventType].innerHTML = "";
        }

        createMiniRefresh(id: string, isAuto: boolean, down: (r: MiniRefresh) => void, up: (r: MiniRefresh) => void) {

            return new MiniRefresh({
                container: "#" + id,
                down: {
                    bounceTime: 0,
                    callback: () => {
                        down(this.miniRefresh[this.eventType]);
                    }
                },
                up: {
                    isAuto: isAuto,
                    callback: () => {
                        up(this.miniRefresh[this.eventType])
                    }
                }
            });

        }

        miniRefreshDown(r: MiniRefresh) {

            // 下拉事件
            this.clean();
            console.log("miniRefreshDown");

            r.endDownLoading();
            // r.resetUpLoading();      
        }
        async miniRefreshUp(r: MiniRefresh) {
            {

                let stop = true;
                try {

                    if (this.page[this.eventType]) {
                        this.page[this.eventType].index++;
                    }
                    else {
                        this.page[this.eventType] = {
                            index: 1,
                            size: 20,
                            count: 0
                        }
                    }

                    let data = await this.refresh(this.page[this.eventType], this.eventType)

                    if (data) {
                        stop = data.Page.PageIndex >= data.Page.PageCount;
                    }
                    else {
                        stop = true;
                    }

                } finally {
                    r.endUpLoading(stop);
                }
            }
        }

        init() {

            element.IllegalDrop.list.innerHTML = "";
            element.MixedInto.list.innerHTML = "";
            element.GarbageFull.list.innerHTML = "";
            try {
                this.miniRefresh[EventType.IllegalDrop] = this.createMiniRefresh(
                    MiniRefreshId.IllegalDrop,
                    true,
                    (r) => {
                        this.miniRefreshDown(r)
                    },
                    (r) => {
                        this.miniRefreshUp(r)
                    }
                )
                this.miniRefresh[EventType.MixedInto] = this.createMiniRefresh(
                    MiniRefreshId.MixedInto,
                    false,
                    (r) => {
                        this.miniRefreshDown(r)
                    },
                    (r) => {
                        this.miniRefreshUp(r)
                    }
                )
                this.miniRefresh[EventType.GarbageFull] = this.createMiniRefresh(
                    MiniRefreshId.GarbageFull,
                    false,
                    (r) => {
                        this.miniRefreshDown(r)
                    },
                    (r) => {
                        this.miniRefreshUp(r)
                    }
                )

            } catch (error) {
                console.error(error);
            }
        }
    }



    export class Page {
        initDatePicker() {
            try {

                element.datePicker.addEventListener('click', () => {
                    weui.datePicker({
                        start: new Date(2020, 12 - 1, 1),
                        end: new Date(),
                        onChange: function (result: any) {

                        },
                        onConfirm: (result: any) => {
                            date = new Date(result[0].value, result[1].value - 1, result[2].value);

                            this.loadData()
                            this.viewDatePicker(date);
                        },
                        title: '请选择日期'
                    });
                });
            } catch (ex) {
                console.error(ex);
            }
        }
        viewDatePicker(date: Date) {
            element.date.innerHTML = dateFormat(date, "yyyy年MM月dd日");
        }
        loadNavigation() {

            var navigation = document.getElementById("navigation")!;
            var lis = navigation.getElementsByTagName("li");
            for (let i = 0; i < lis.length; i++) {
                lis[i].addEventListener("click", function () {
                    let selected = navigation.getElementsByClassName("selected");
                    if (selected && selected.length > 0) {
                        selected[0].className = '';
                    }
                    this.className = "selected";

                    let tabs = document.getElementsByClassName("tab");
                    for (let i = 0; i < tabs.length; i++) {
                        (tabs[i] as HTMLElement).style.display = '';
                    }

                    let tab = document.getElementById(this.getAttribute("tab")!)!;
                    tab.style.display = "block";
                });
            }
        }



        loadData() {
            if (this.record) {
                this.record.clean();
                console.log("loadData");
                this.record.miniRefresh[this.record.eventType].resetUpLoading();
            }
        }

        record?: IllegalDropEvent;

        getEventTypeByIndex(index: number) {
            switch (index) {
                case 0:
                    return EventType.IllegalDrop;
                case 1:
                    return EventType.GarbageFull;
                case 2:
                    return EventType.MixedInto;
                default:
                    return EventType.IllegalDrop;
            }
        }


        SwiperControlChanged(index: number) {
            if (this.record) {
                console.log("SwiperControlChanged")
                this.record.eventType = this.getEventTypeByIndex(index);
                this.record.clean();
                this.record.miniRefresh[this.record.eventType].resetUpLoading();
            }

        }
        getSwiperIndex(type: EventType) {
            switch (type) {

                case EventType.GarbageFull:
                    return 1;
                case EventType.MixedInto:
                    return 2;
                case EventType.IllegalDrop:
                default:
                    return 0;
            }
        }

        initSwiper() {

            let eventType = EventType.IllegalDrop;
            console.log(window.location.href);
            let strEventType = getQueryVariable("eventtype");
            console.log(strEventType)
            if (strEventType) {
                eventType = parseInt(strEventType);
            }

            let swiper = new SwiperControl(
                {
                    selectors: {
                        container: ".swiper-container",
                        pagination: ".swiper-pagination"
                    },
                    navBar: ["乱扔垃圾", "满溢情况", "混合投放"],
                    callback: (index) => {
                        this.SwiperControlChanged(index);
                    },
                    initialSlide: this.getSwiperIndex(eventType)
                },
            );
        }


        init() {



            this.viewDatePicker(new Date());

            const eventId = getQueryVariable('eventid');
            // if (eventId) {
            //     new HowellHttpClient.HttpClient().login2(() => {
            //         new PushEventDetail().init(eventId);
            //     });
            // }
            // else {

            this.loadNavigation();
            this.initDatePicker();

            const user = (window.parent as NavigationWindow).User;
            const http = (window.parent as NavigationWindow).Authentication;
            console.log(http);
            const type = user.WUser.Resources![0].ResourceType;
            const service = new Service(http)
            const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!)

            this.record = new IllegalDropEvent(type, dataController, user.WUser.OpenId!);
            this.record.init();
            this.record.loadAside();

            this.initSwiper();
            // }
        }
    }
}
console.log("User", (window.parent as NavigationWindow).User);
console.log("Auth", (window.parent as NavigationWindow).Authentication);

const page = new EventHistoryPage.Page();
page.viewDatePicker(new Date());
page.init();



