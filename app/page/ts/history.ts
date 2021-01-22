
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { getQueryVariable, dateFormat, getAllDay } from "../../common/tool";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { PagedList } from "../../data-core/model/page";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { Service } from "../../data-core/repuest/service";
import { ResourceType } from "../../data-core/model/we-chat";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow, SelectionMode } from "./aside-list";
import { Language } from "./language";



declare var MiniRefresh: any;
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
        filterBtn: document.querySelector('.btn.filter') as HTMLDivElement,
        IllegalDrop: {
            list: document.getElementById("illegalDrop")!,
            totalRecordCount: document.getElementById("illegalDropTotalRecordCount")!,
            recordCount: document.getElementById("illegalDropRecordCount")!,
            date: document.getElementById("date")!
        }
    }


    var MiniRefreshId = {
        IllegalDrop: "illegalDropRefreshContainer"
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
        }
    }


    export class IllegalDropEvent {
        /**
         * autho:pmx
         */

        //记录所有的居委会
        divisions: Map<string, Division> = new Map();
        selectedDivisions: Map<string, any> = new Map();
        garbageElements: Map<string, any> = new Map();


        asideControl: AsideControl;
        asidePage?: AsideListPage;

        /**
         * author:zha
         */

        pageIndex = 0;
        pageTotal = 0;
        totalRecordCount = 0;

        dataSource = new Array<IllegalDropEventRecord>();



        filter: {
            date: Date,
            divisionId?: string
        }

        defaultDivisionId = '';
        constructor(private service: Service, private user: SessionUser) {

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
            this.loadData().then(() => {
                if (this.user.WUser.Resources && this.user.WUser.Resources.length > 0) {
                    this.createAside(this.user.WUser.Resources[0].ResourceType)
                }
            })
        }
        createAside(type: ResourceType) {
            let items = [];
            for (const [key, value] of this.divisions) {
                items.push(value);
            }
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
                            name: x.Name
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




        confirmSelect(selectedIds: string[]) {
            this.filter.divisionId = selectedIds[0];
            // for (let [k, v] of this.garbageElements) {
            //     if (selectedIds.length == 0 || selectedIds.includes(v.divisionId)) {
            //         v.Element.style.display = 'block'
            //     } else {
            //         v.Element.style.display = 'none'
            //     }
            // }
            this.refresh();
            this.asideControl.Hide();

        }
        async loadData() {
            this.divisions = await this.LoadDivisionList();
            console.log('居委会', this.divisions)
            return 'success'
        }
        LoadDivisionList() {
            var req = new GetDivisionsParams();
            // 将数组 map 化返回
            let mapedDivisions = new Map();

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




        getData(begin: Date, end: Date, index: number, opts?: {
            divisionIds?: string[],
            stationIds?: string[]
        }
        ) {
            const params = new GetEventRecordsParams();
            params.BeginTime = begin;
            params.EndTime = end;
            params.PageSize = PageSize;
            params.PageIndex = index;
            params.Desc = true;
            if (opts) {
                params.DivisionIds = opts.divisionIds;
                params.StationIds = opts.stationIds;
            }
            return this.service.event.list(params);
        }

        convert(record: IllegalDropEventRecord) {
            let template = new Template();

            template.img.src = this.service.medium.getData(record.ImageUrl) as string;
            template.title.innerHTML = record.Data.DivisionName;
            template.footer.innerHTML = record.ResourceName;
            template.remark.innerHTML = dateFormat(new Date(record.EventTime), 'HH:mm:ss');


            let item = document.createElement("div");
            item.id = record.EventId;
            item.setAttribute('divisionid', record.Data.DivisionId)
            item.innerHTML = template.element.innerHTML;
            item.getElementsByTagName("img")[0].addEventListener("error", function () {
                this.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=";
                this.style.background = "black";
            });

            item.addEventListener("click", () => {

                window.parent.recordDetails = record;
                const url = "./event-details.html?openid=" + this.user.WUser.OpenId + "&eventid=" + record.EventId;
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
            this.garbageElements.set(record.EventId, {
                Element: item,
                id: record.EventId,
                divisionId: record.Data.DivisionId,
            })
            return item;
        }

        datas: Global.Dictionary<IllegalDropEventRecord> = {};

        view(date: Date, list: PagedList<IllegalDropEventRecord>) {
            for (let i = 0; i < list.Data.length; i++) {
                const data = list.Data[i];
                this.datas[data.EventId] = data;
                let item = this.convert(data);
                element.IllegalDrop.list.appendChild(item);
            }
            element.IllegalDrop.totalRecordCount.innerHTML = list.Page.TotalRecordCount.toString();
            element.IllegalDrop.recordCount.innerHTML = (list.Page.PageSize * (list.Page.PageIndex - 1) + list.Page.RecordCount).toString();

        }

        async refresh() {

            if (!this.user.WUser.Resources)
                return;


            element.IllegalDrop.list.innerHTML = "";
            this.pageIndex = 1;


            let stationIds = this.user.WUser.Resources.filter(x => x.ResourceType == ResourceType.GarbageStations).map(x => {
                return x.Id
            })
            let divisionIds = this.user.WUser.Resources.filter(x => {
                return x.ResourceType == ResourceType.County ||
                    x.ResourceType == ResourceType.Committees
            }
            ).map(x => {
                return x.Id
            })

            const day = getAllDay(date);
            if (this.filter.divisionId) {
                divisionIds = [this.filter.divisionId];
            }
            let page = await this.getData(day.begin, day.end, this.pageIndex, { divisionIds: divisionIds, stationIds: stationIds });
            console.log('page', page)

            this.view(date, page.Data);
        }

        init() {
            try {
                var miniRefresh = new MiniRefresh({
                    container: "#" + MiniRefreshId.IllegalDrop,
                    down: {
                        callback: () => {
                            setTimeout(() => {
                                // 下拉事件
                                this.refresh();
                                miniRefresh.endDownLoading();
                            }, 500);
                        }
                    },
                    up: {
                        isAuto: true,
                        callback: async () => {
                            let stop = true;
                            try {
                                debugger;
                                if (!this.user.WUser.Resources)
                                    return;
                                    debugger;
                                const day = getAllDay(date);
                                let divisionIds: string[];
                                let stationIds = this.user.WUser.Resources.filter(x => x.ResourceType == ResourceType.GarbageStations).map(x => {
                                    return x.Id
                                })
                                divisionIds = this.user.WUser.Resources.filter(x =>
                                    x.ResourceType == ResourceType.Committees
                                ).map(x => {
                                    return x.Id
                                });

                                if (divisionIds.length < 2) {
                                    element.filterBtn.style.display = "none";
                                }
                                divisionIds = divisionIds.concat(this.user.WUser.Resources.filter(x => {
                                    return x.ResourceType == ResourceType.County;
                                }
                                ).map(x => {
                                    element.filterBtn.style.display = "";
                                    return x.Id
                                }));
                                if (this.filter.divisionId) {
                                    divisionIds = [this.filter.divisionId];
                                }
                                var data = await this.getData(day.begin, day.end, ++this.pageIndex, {
                                    divisionIds: divisionIds,
                                    stationIds: stationIds
                                });
                                console.log('data', data)
                                this.view(date, data.Data);
                                
                                stop = data.Data.Page.PageCount == 0 || data.Data.Page.PageIndex == data.Data.Page.PageCount;
                            } finally {

                                miniRefresh.endUpLoading(stop);
                            }
                        }
                    }
                });

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
                            console.log(result);

                            date = new Date(result[0].value, result[1].value - 1, result[2].value);
                            this.loadData();
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
                this.record.refresh();
            }
        }

        record?: IllegalDropEvent;

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
            new HowellHttpClient.HttpClient().login((http: HowellAuthHttp) => {

                const user = new SessionUser();

                this.record = new IllegalDropEvent(new Service(http), user);
                this.record.init();
                this.record.loadAside();
            });
            // }
        }
    }
}
console.log("User", window.parent.User);
console.log("Auth", window.parent.hwAuth);
const page = new EventHistoryPage.Page();
page.viewDatePicker(new Date());
page.init();



