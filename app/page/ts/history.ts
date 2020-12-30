import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { SessionUser } from "../../common/session-user";
import { TheDayTime, TableAttribute, unique, dateFormat, TheDay } from "../../common/tool";
import { DivisionTypeEnum, EventTypeEnum } from "../../common/enum-helper";
import { GetEventRecordsParams, IllegalDropEventRecord, IllegalDropEventData } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { ResourceRoleType } from "../../common/enum-helper";
import { getQueryVariable } from "../../common/tool";
import { FilterAside } from "../component/aside";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { PagedList } from "../../data-core/model/page";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { DivisionRequestService } from "../../data-core/repuest/division.service";



declare var MiniRefresh: any;

export namespace EventHistoryPage {

    var PageSize = 20;
    var element = {
        IllegalDrop: {
            list: document.getElementById("illegalDrop"),
            totalRecordCount: document.getElementById("illegalDropTotalRecordCount"),
            recordCount: document.getElementById("illegalDropRecordCount"),
            date: document.getElementById("illegalDropDate")
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
        filterBtn: HTMLDivElement;
        asideContent: HTMLDivElement;
        backdrop: HTMLDivElement;
        asideMain?: HTMLDivElement;
        asideTemplate: HTMLTemplateElement | null;
        selectedDivisions: Map<string, any> = new Map();
        garbageElements: Map<string, any> = new Map();
        footerReset: HTMLDivElement;
    footerConfirm: HTMLDivElement;


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
        constructor(private service: {
            event: EventRequestService,
            medium: MediumPicture,
            division: DivisionRequestService,
        }, private user: SessionUser) {

            this.filter = {
                date: new Date()
            }

            this.asideContent = document.querySelector('.aside-content') as HTMLDivElement;

            this.backdrop = document.querySelector('.backdrop') as HTMLDivElement;

            this.filterBtn = document.querySelector('.btn.filter') as HTMLDivElement;

            this.filterBtn.addEventListener('click', () => {
                this.showOrHideAside()
            })
            this.backdrop.addEventListener('click', () => {
                this.showOrHideAside()
            })
            this.asideTemplate = document.querySelector('#aside-template') as HTMLTemplateElement;

            this.asideMain = document.querySelector('.aside-main') as HTMLDivElement;
            this.footerReset = document.querySelector('.footer-reset') as HTMLDivElement;
            this.footerConfirm = document.querySelector('.footer-confirm') as HTMLDivElement;
            this.footerReset.addEventListener('click', () => {
                this.resetSelected()
            })
            this.footerConfirm.addEventListener('click', () => {
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
        showOrHideAside() {
            if (this.asideContent.classList.contains('active')) {
                this.asideContent.classList.remove('active');
                this.backdrop.style.display = 'none'
            } else {
                this.backdrop.style.display = 'block'
                this.asideContent.classList.add('active')
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
            this.showOrHideAside();

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




        getData(begin: Date, end: Date, index: number, divisionId?: string) {
            const params = new GetEventRecordsParams();
            params.BeginTime = begin;
            params.EndTime = end;
            params.PageSize = PageSize;
            params.PageIndex = index;
            params.Desc = true;
            if (divisionId) {
                params.DivisionIds = [divisionId];
            }
            return this.service.event.list(params);
        }

        convert(record: IllegalDropEventRecord) {
            let template = new Template();

            template.img.src = this.service.medium.getData(record.ImageUrl) as string;
            template.title.innerHTML = record.Data.DivisionId + record.Data.DivisionName;
            template.footer.innerHTML = '';//record.ResourceName;
            template.remark.innerHTML = dateFormat(new Date(record.EventTime), 'HH:mm:ss');


            let item = document.createElement("div");
            item.id = record.EventId;
            item.setAttribute('divisionid', record.Data.DivisionId)
            item.innerHTML = template.element.innerHTML;
            item.getElementsByTagName("img")[0].addEventListener("error", function () {
                this.src = "./img/black.png"
            });
            item.addEventListener("click", () => {
                if (window.parent.pageJump)
                    window.parent.pageJump("./event-details.html?openid=" + this.user.WUser.OpenId + "&eventid=" + record.EventId);
            });
            this.garbageElements.set(record.EventId, {
                Element: item,
                id: record.EventId,
                divisionId: record.Data.DivisionId,
            })
            return item;
        }



        view(date: Date, list: PagedList<IllegalDropEventRecord>) {
            for (let i = 0; i < list.Data.length; i++) {
                const data = list.Data[i];
                let item = this.convert(data);
                element.IllegalDrop.list.appendChild(item);
            }
            element.IllegalDrop.totalRecordCount.innerHTML = list.Page.TotalRecordCount.toString();
            element.IllegalDrop.recordCount.innerHTML = (list.Page.RecordCount * list.Page.PageIndex).toString();
            element.IllegalDrop.date.innerHTML = dateFormat(date, 'yyyy年MM月dd日');

        }

        async refresh() {
            element.IllegalDrop.list.innerHTML = "";
            this.pageIndex = 1;

            const begin = new Date(this.filter.date.getTime());
            begin.setHours(0, 0, 0);
            const end = new Date(this.filter.date.getTime());
            end.setHours(23, 59, 59);
            let page = await this.getData(begin, end, this.pageIndex)
            console.log('page', page)

            this.view(this.filter.date, page.Data);
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
                            const begin = new Date(this.filter.date.getTime());
                            begin.setHours(0, 0, 0);
                            const end = new Date(this.filter.date.getTime());
                            end.setHours(23, 59, 59);
                            var data = await this.getData(begin, end, ++this.pageIndex)
                            console.log('data', data)
                            this.view(this.filter.date, data.Data);

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

        loadNavigation() {

            var navigation = document.getElementById("navigation");
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

                    let tab = document.getElementById(this.getAttribute("tab"));
                    tab.style.display = "block";
                });
            }
        }

        init() {

            //         var showDatePicker = document.getElementById("showDatePicker");

            // showDatePicker.addEventListener('click', function () {
            //     weui.datePicker({
            //         start: 2020,
            //         end: new Date().getFullYear(),
            //         onChange: function (result) {
            //             console.log(result);
            //             console.log(1);
            //         },
            //         onConfirm: function (result) {
            //             console.log(result);
            //             console.log(2);
            //         },
            //         title: '请选择日期'
            //     });
            // });

            const eventId = getQueryVariable('eventid');
            // if (eventId) {
            //     new HowellHttpClient.HttpClient().login2(() => {
            //         new PushEventDetail().init(eventId);
            //     });
            // }
            // else {

            this.loadNavigation();
            new HowellHttpClient.HttpClient().login((http: HowellAuthHttp) => {

                const user = new SessionUser();

                const record = new IllegalDropEvent({
                    division: new DivisionRequestService(http),
                    event: new EventRequestService(http),
                    medium: new MediumPicture()
                }, user);
                record.init();
                record.loadAside();
            });
            // }
        }
    }
}
new EventHistoryPage.Page().init();



