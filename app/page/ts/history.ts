import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { SessionUser } from "../../common/session-user";
import { TheDayTime, TableAttribute, unique, dateFormat, TheDay } from "../../common/tool";
import { DivisionTypeEnum, EventTypeEnum } from "../../common/enum-helper";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { ResourceRoleType } from "../../common/enum-helper";
import { getQueryVariable } from "../../common/tool";
import { FilterAside } from "../component/aside";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { PagedList } from "../../data-core/model/page";

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
            this.element = document.getElementById('template');
            this.img = this.element.getElementsByTagName('img')[0];
            this.title = this.element.getElementsByClassName('title')[0] as HTMLDivElement;
            this.footer = this.element.getElementsByClassName('footer-title')[0] as HTMLDivElement;
            this.remark = this.element.getElementsByClassName('remark')[0] as HTMLDivElement;
        }
    }


    export class IllegalDropEvent {        

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
            medium: MediumPicture
        }, private user: SessionUser) {

            this.filter = {
                date: new Date()
            }
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

            template.img.src = this.service.medium.getData(record.ImageUrl);
            template.title.innerHTML = record.Data.DivisionName;
            template.footer.innerHTML = record.ResourceName;
            template.remark.innerHTML = dateFormat(new Date(record.EventTime), 'HH:mm:ss');


            let item = document.createElement("div");
            item.id = record.EventId;
            item.innerHTML = template.element.innerHTML;
            item.getElementsByTagName("img")[0].addEventListener("error", function () {
                this.src = "./img/black.png"
            });
            item.addEventListener("click", () => {
                if (window.parent.pageJump)
                    window.parent.pageJump("./event-details.html?openid="+ this.user.WUser.OpenId +"&eventid="+record.EventId);
            });
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
                    event: new EventRequestService(http),
                    medium: new MediumPicture()
                }, user);
                record.init();
            });
            // }
        }
    }
}
new EventHistoryPage.Page().init();



