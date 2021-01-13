
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { getQueryVariable, dateFormat, getAllDay } from "../../common/tool";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { PagedList } from "../../data-core/model/page";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { Service } from "../../data-core/repuest/service";
import { ResourceType } from "../../data-core/model/we-chat";



declare var MiniRefresh: any;
declare var weui: any;

export namespace EventHistoryPage {

    var date = new Date();
    var PageSize = 20;
    var element = {
        date: document.getElementById("date")!,
        datePicker: document.getElementById("showDatePicker")!,
        aside: {
            divisions: document.querySelector('.aside-content.divisions') as HTMLDivElement,
            backdrop: document.querySelector('.backdrop') as HTMLDivElement,
            template: document.querySelector('#aside-template') as HTMLTemplateElement,
            main: document.querySelector('.aside-main') as HTMLDivElement,
            btn: {
                reset: document.querySelector('.footer-reset') as HTMLDivElement,
                confirm: document.querySelector('.footer-confirm') as HTMLDivElement
            }
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


            element.filterBtn.addEventListener('click', () => {
                this.showOrHideDivisionsAside()
            })
            element.aside.backdrop.addEventListener('click', () => {
                this.showOrHideDivisionsAside()
            })




            element.aside.btn.reset.addEventListener('click', () => {
                this.resetSelected()
            })
            element.aside.btn.confirm.addEventListener('click', () => {
                this.confirmSelect()
            })


        }
        loadAside() {
            this.loadData().then(() => {
                this.createAside()
            })
        }
        createAside() {
            let _this = this;
            element.aside.main.innerHTML = '';
            let tempContent = element.aside.template.content as DocumentFragment;

            for (let [k, v] of this.divisions) {
                let info = tempContent.cloneNode(true) as DocumentFragment;
                let div = info.querySelector('div.aside-item') as HTMLDivElement;
                div.textContent = v.Name;
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
                element.aside.main.appendChild(info)
            }
        }
        showOrHideDivisionsAside() {

            if (element.aside.divisions.classList.contains('active')) {
                element.aside.divisions.classList.remove('active');

                element.aside.backdrop.style.display = 'none'
            } else {
                element.aside.backdrop.style.display = 'block'
                element.aside.divisions.classList.add('active')
            }
        }



        resetSelected() {
            console.log('reset', this.selectedDivisions)
            for (let [k, v] of this.selectedDivisions) {
                v.Element.classList.remove('selected')
            }
            this.selectedDivisions.clear();


        }
        confirmSelect() {
            console.log('selectedDivisions', this.selectedDivisions)

            let selectedIds = [];

            for (let v of this.selectedDivisions.values()) {
                selectedIds.push(v.id)
            }
            console.log(this.garbageElements)

            for (let [k, v] of this.garbageElements) {
                if (selectedIds.length == 0 || selectedIds.includes(v.divisionId)) {
                    v.Element.style.display = 'block'
                } else {
                    v.Element.style.display = 'none'
                }
            }
            this.showOrHideDivisionsAside();

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
                this.src = "../../img/black.png"
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
                            if (!this.user.WUser.Resources)
                                return;
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
                            divisionIds = divisionIds.concat(this.user.WUser.Resources.filter(x =>{                                
                                return x.ResourceType == ResourceType.County;
                            }                                
                            ).map(x => {
                                element.filterBtn.style.display = "";
                                return x.Id
                            }));
                            var data = await this.getData(day.begin, day.end, ++this.pageIndex, {
                                divisionIds: divisionIds,
                                stationIds: stationIds
                            });
                            console.log('data', data)
                            this.view(date, data.Data);

                            miniRefresh.endUpLoading(data.Data.Page.PageIndex == data.Data.Page.PageCount);
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
console.log("User",window.parent.User);
console.log("Auth",window.parent.hwAuth);
const page = new EventHistoryPage.Page();
page.viewDatePicker(new Date());
page.init();



