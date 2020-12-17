import { SearchControl } from "./search";
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


declare var mui: any;

export namespace EventHistoryPage {
    export class EventDetail {
        constructor(muiView = true) {
            this.init(muiView);
        }
        init(muiView = true) {
            if (muiView)
                var viewApi = mui('.mui-view').view({
                    defaultPage: '#appList' //默认页面的选择器  
                });

            document.getElementById('back__btn').addEventListener('tap', () => {
                var oldBack = mui.back;
                mui.back = () => {
                    if (viewApi.canBack()) {
                        viewApi.back();
                    } else {
                        oldBack();
                    }
                };
                mui.back();
            })
        }

        fillDetail(item: IllegalDropEventRecord) {
            const police__type = document.getElementById('police__type'),
                camera__name = document.getElementById('camera__name'),
                station__name = document.getElementById('station__name'),
                rc__name = document.getElementById('rc__name'),
                police__time = document.getElementById('police__time'),
                detail_img = document.getElementById('detail_img');
            police__type.innerText = EventTypeEnum[item.EventType];
            camera__name.innerText = item.ResourceName;
            station__name.innerText = item.Data.StationName;
            rc__name.innerText = item.Data.DivisionName;
            police__time.innerText = dateFormat(new Date(item.EventTime), 'yyyy-MM-dd HH:mm:ss');

            detail_img?.setAttribute('src', new MediumPicture().getData(item.ImageUrl));
        }
    }

    export class PushEventDetail {
        httpClient: HowellHttpClient.HttpClient;
        eventService: EventRequestService;
        constructor() {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.eventService = new EventRequestService(this.httpClient.http);
        }


        async init(eventId: string) {

            const event = await this.eventService.single(eventId);
            const police__type = document.getElementById('police__type'),
                camera__name = document.getElementById('camera__name'),
                station__name = document.getElementById('station__name'),
                rc__name = document.getElementById('rc__name'),
                police__time = document.getElementById('police__time'),
                detail_img = document.getElementById('detail_img');
            police__type.innerText = EventTypeEnum[event.data.Data.EventType];
            camera__name.innerText = event.data.Data.ResourceName;
            station__name.innerText = event.data.Data.Data.StationName;
            rc__name.innerText = event.data.Data.Data.DivisionName;
            police__time.innerText = dateFormat(new Date(event.data.Data.EventTime), 'yyyy-MM-dd HH:mm:ss');

            detail_img.setAttribute('src', new MediumPicture().getData(event.data.Data.ImageUrl));

            document.getElementById('back__btn').addEventListener('tap', () => {
                document.getElementById('detail').removeAttribute('style');
                document.getElementById('appList').removeAttribute('style');

                const eventDetail = new EventHistoryPage.EventDetail();

                const event = new EventHistoryPage.IllegalDropEvent(eventDetail);

                setTimeout(() => {
                    const refresh = new EventHistoryPage.Refresh(event);
                    refresh.init();

                    const sw = new EventHistoryPage.SideWrapper(event);
                    sw.init();
                    sw.loadDivisionView();
                    sw.datePicker();

                }, 1000);
            });
            document.getElementById('appList').style.display = 'none';
            document.getElementById('detail').style.display = 'block';
        }
    }

    export class IllegalDropEvent {
        httpClient: HowellHttpClient.HttpClient;
        eventService: EventRequestService;
        search: SearchControl;
        pageIndex = 1;
        pageTotal = 0;
        totalRecordCount = 0;
        dataSource = new Array<IllegalDropEventRecord>();
        user: SessionUser;
        defaultDivisionId = '';
        constructor(private detail: EventDetail) {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.eventService = new EventRequestService(this.httpClient.http);
            this.search = new SearchControl();
            this.user = new SessionUser();

        }

        

        async init() {

            const data = await this.requestData(this.pageIndex),
                viewModel = this.convert(data.Data),
                dom = document.getElementById('listPanel')
                , pcDom = document.getElementById('page_count');
            this.pageTotal = data.Page.PageCount;
            this.totalRecordCount = data.Page.TotalRecordCount;
            console.log(data.Page);

            var html = '';
            this.dataSource = [...this.dataSource, ...data.Data];
          
            viewModel.map(x => {
                // var listHtml = '';
                x.items.map(v => {
                    html += `
                    <a href="#detail" data-tag="${v.id}" class="weui-media-box weui-media-box_appmsg box__item" >
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" style="border-radius: 6px;"
                            src="${v.imgSrc}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${v.topDesc}</h4>
                            <label class="weui-media-box__desc pull-left" style="width: 80%;">${v.bottomDesc[0]}</label>
                            <label class="weui-media-box__desc pull-right" style="width: 20%;">${v.bottomDesc[1]}</label>                          
                        </div>
                    </a>  `; 
                }); 
            });
            const beginDom = document.getElementById('beginTime');
            var time = ''; 
            time = beginDom.innerText;
            if(time=='')
               time=  dateFormat(new Date(),'yyyy年MM月dd日')
            
            pcDom.innerHTML = `
            ${time}
            <label style="float: right;">${this.dataSource.length}/${this.totalRecordCount}
            </label>
            `;
         
            dom.insertAdjacentHTML('beforeend', html);
            const itemDoms = document.getElementsByClassName('box__item');
            for (let i = 0; i < itemDoms.length; i++) {
                itemDoms[i].addEventListener('tap', (event: CustomEvent) => {
                    const findItem = this.dataSource.find(x => x.EventId == event.currentTarget.dataset.tag);
                    this.detail.fillDetail(findItem);
                });
            }
            this.pageIndex += 1;
            return (data.Page.RecordCount == data.Page.TotalRecordCount) || data.Page.RecordCount == 0;
        }

        clearDom() {
            const dom = document.getElementById('listPanel');
            dom.innerHTML = '';
        }

        destroy(is: boolean = true) {
            this.clearDom();
            this.dataSource = new Array();
            this.pageIndex = 1;
            this.pageTotal = 0;
            this.totalRecordCount = 0;
          
            if (is) mui('#refreshContainer').pullRefresh().refresh(true);
        }

        async requestData(pageIndex: number) {
            var responseData = await this.eventService.list(this.getRequsetParam(pageIndex, this.search));
            return responseData.Data;

        }

        convert(input: IllegalDropEventRecord[]) {
            const listDataSource = new Array<ListImage>()
                , recordMap = new IllegalDropEventsRecord();
            var times = new Array<string>();
            recordMap.items = new Map();

            input.map(x => {
                times.push(dateFormat(new Date(x.EventTime), 'yyyy-MM-dd'));
            });
            times = unique(times);
            times.map(x => {
                recordMap.items.set(x, new Array<IllegalDropEventRecord>())
            });
            input.map(x => {
                const t = dateFormat(new Date(x.EventTime), 'yyyy-MM-dd');
                var records = recordMap.items.get(t);
                records.push(x);
                recordMap.items.set(t, records);
            });

            times.map(x => {
                const list = recordMap.items.get(x)
                    , m = new ListImage();
                listDataSource.push(m);
                m.items = new Array();
                m.title = x;
                list.map(c => {

                    m.items.push(this.toTableModel(c));
                });
            });
            return listDataSource;
        }

        toTableModel(item: IllegalDropEventRecord) {

            return new ListImageDesc(
                item.EventId,
                new MediumPicture().getData(item.ImageUrl, this.user.WUser.ServerId)
                , item.Data.DivisionName
                , [item.ResourceName, dateFormat(new Date(item.EventTime), 'HH:mm')]);
        }

        getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {

            const param = new GetEventRecordsParams(), day = TheDayTime(new Date());
            param.PageIndex = pageIndex;
            param.BeginTime = day.begin.toISOString();
            param.EndTime = day.end.toISOString();
            param.Desc=true;
            if (pageSize) param.PageSize = pageSize;
            else param.PageSize = new TableAttribute().pageSize;
            const s = search.toSearchParam();
            if (s.SearchText && search.other == false) {
                param.StationName = s.SearchText;
            }
            if (s.BeginTime) param.BeginTime = s.BeginTime;
            if (s.EndTime) param.EndTime = s.EndTime;
            if (s.DivisionId) param.DivisionIds = [s.DivisionId];
            if (s.StationId) param.StationIds = [s.StationId];
            //    alert(JSON.stringify(param)); 
            console.log(param);

            return param;
        }
    }

    export class Refresh {
        constructor(private dropEvent: IllegalDropEvent) {

        }
        init() {
            var a = async (f: (v: boolean) => void) => {
                var b = await this.dropEvent.init();
                f(b);
            }, d = () => {
                this.dropEvent.destroy(false)
                this.dropEvent.init();

            };
            mui.init({
                pullRefresh: {
                    container: '#refreshContainer',
                    down: {
                        callback: function () {
                            d();
                            this.endPulldownToRefresh(false);
                            this.refresh(true);

                        }
                    },
                    up: {
                        // contentnomore:'',
                        auto: true,
                        callback: function () {

                            a((b) => { 
                                this.endPullupToRefresh(b);
                            });
                        }
                    }
                }
            });

        }
    }

    export class SideWrapper {
        constructor(private event: IllegalDropEvent) {

        }
        init() {
            const fillTime = (begin?: Date, end?: Date) => {
                const beginDom = document.getElementById('beginTime')
                    , day = TheDayTime(new Date());
                var b = '', e = '';
                if (begin)
                    b = dateFormat(begin, 'yyyy年MM月dd日');
                else
                    b = dateFormat(day.begin, 'yyyy年MM月dd日');

                beginDom.innerText = b;
                beginDom.setAttribute('data-time', b);
            }

            new FilterAside({
                parentId: 'offCanvasWrapper',
                triggerId: 'offCanvasShow',
                inner: `<div class="weui-media-box weui-media-box_text">
                <div class="title">时间</div>
                <div style="height:32px">
                    <div class="  time-box " id="beginTime">

                    </div>                  
                </div>
                <div style="width: auto;height:32px" class="m-t-10">
                    <div id="the_day"
                        class="pull-left text-center sky-blue-text m-r-10 time-type-box selected">
                        今日</div>
                    <div id="the_yesterday"
                        class="pull-left text-center sky-blue-text m-r-10 time-type-box">
                        昨天</div>
                    <div id="the_before_day"
                        class="pull-left text-center sky-blue-text time-type-box">
                        前天</div>
                </div>
            </div>
            <div class="title" id="stationText">
                            居委
                        </div>
                        <div class="content divisions"  id="offCanvasSideScroll">
                            <ul class="" id="division_list"></ul>
                        </div>
                `,
                loaded: () => {
                    fillTime();
                    const dayDom = document.getElementById('the_day'),
                        yesterDayDom = document.getElementById('the_yesterday'),
                        beforeDayDom = document.getElementById('the_before_day'),
                        dayDomSelect = (dom: Element, select: boolean) => {
                            var classNames = dom.getAttribute('class');
                            if (select) classNames += ' selected';
                            else classNames = classNames.replace('selected', '').replace('selected', '');
                            dom.setAttribute('class', classNames);
                        };
                    dayDom.addEventListener('tap', () => {
                        this.event.search.day = 0;
                        const day = TheDay(0);
                        fillTime(day.begin, day.end);
                        dayDomSelect(dayDom, true);
                        dayDomSelect(yesterDayDom, false);
                        dayDomSelect(beforeDayDom, false);
                    });
                    yesterDayDom.addEventListener('tap', () => {
                        this.event.search.day = -1;
                        const day = TheDay(-1);
                        fillTime(day.begin, day.end);
                        dayDomSelect(dayDom, false);
                        dayDomSelect(yesterDayDom, true);
                        dayDomSelect(beforeDayDom, false);
                    });
                    beforeDayDom.addEventListener('tap', () => {
                        this.event.search.day = -2;
                        const day = TheDay(-2);
                        fillTime(day.begin, day.end);
                        dayDomSelect(dayDom, false);
                        dayDomSelect(yesterDayDom, false);
                        dayDomSelect(beforeDayDom, true);
                    });
                },
                ok: () => {
                    this.event.dataSource = new Array();
                    this.event.destroy();
                    this.event.init();
                },
                reset: () => {
                    this.clearSearchList();
                    this.event.search.divisionId = this.event.defaultDivisionId;
                    this.clearDayType()
                    fillTime();
                }

            });

            mui('#offCanvasSideScroll').scroll();
            mui('#offCanvasWrapper').scroll();

        }

        clearDefaultItem() {
            const l = document.getElementById('All__Item');
            const className = l.getAttribute('class');
            l.setAttribute('class', className.replace('selected', '').replace('selected', ''));
        }
        clearSearchList() {
            const childDoms = document.getElementById('division_list').children;
            for (let i = 0; i < childDoms.length; i++) {
                const ele = childDoms[i];
                const className = ele.children[0].getAttribute('class');
                if (i == 0)
                    ele.children[0].setAttribute('class', className + ' selected');
                else ele.children[0].setAttribute('class', className.replace('selected', '').replace('selected', ''));
            }
        }

        clearDayType(all=true) {
            ['the_day', 'the_yesterday', 'the_before_day'].map(x => {
                const dom = document.getElementById(x)
                    , className = dom.getAttribute('class');
                if (x == 'the_day'&&all) dom.setAttribute('class', className + ' selected');
                else
                    dom.setAttribute('class', className.replace('selected', ''))
            });
        }
        async loadDivisionView() {
            const request = new GarbageStationRequestDao.GarbageStationRequest()
                , user = new SessionUser()
                , divisionRequest = new DivisionRequestDao.DivisionRequest()
                , divisionResponse = await divisionRequest.getDivisions()
                , stationTextDom = document.getElementById('stationText')
                , stationViewDom = document.getElementById('division_list'), selected = (id: string, add: boolean) => {
                    if (id) { 
                        const tag = document.getElementsByName(id)[0];
                        var classNames = tag.getAttribute('class');
                        if (add) classNames += ' selected';
                        else classNames = classNames.replace('selected', '').replace('selected', '');
                        tag.setAttribute('class', classNames);
                    }

                };
            var html = '';
            stationTextDom.innerHTML = '';

            if (this.event.user.WUser.Resources && this.event.user.WUser.Resources.length) {
                if (this.event.user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {
                    stationTextDom.innerHTML = '居委';
                    const committees = divisionResponse.Data.Data.filter(c => c.DivisionType == DivisionTypeEnum.Committees);
                    html += `<li><button type="button" name="All__Item" id="All__Item" class="mui-btn mui-btn-division selected">全部</button></li>`;
                    for (let i = 0; i < committees.length; i++) {
                        html += `<li><button type="button" name="${committees[i].Id}" id="${committees[i].Id}" class="mui-btn mui-btn-division">${committees[i].Name}</button></li>`;
                    }
                    stationViewDom.insertAdjacentHTML('afterbegin', html);

                    committees.map(m => {

                        const gDom = document.getElementsByName(m.Id)[0];
                        gDom.addEventListener('click', () => {
                            selected(this.event.search.divisionId, false);
                            this.event.search.divisionId = m.Id;
                            selected(m.Id, true);
                            this.clearDefaultItem();
                        });
                    });
                }
                else if (this.event.user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
                    stationTextDom.innerHTML = '投放点';
                    const stationsResponse = await request.getGarbageStations(user.WUser.Resources[0].Id);
                    if (stationsResponse && stationsResponse.Data) {
                        html += `<li><button type="button" name="All__Item" id="All__Item" class="mui-btn mui-btn-division selected">全部</button></li>`;
                        for (let i = 0; i < stationsResponse.Data.Data.length; i++) {
                            const stations = stationsResponse.Data.Data[i];
                            html += `<li><button type="button" id="${stations.Id}"  name="${stations.Id}" class="mui-btn mui-btn-division">${stations.Name}</button></li>`;

                        }
                        stationViewDom.insertAdjacentHTML('afterbegin', html);

                        stationsResponse.Data.Data.map(m => {

                            const gDom = document.getElementsByName(m.Id)[0];
                            gDom.addEventListener('click', () => {
                                selected(this.event.search.stationId, false);
                                this.event.search.stationId = m.Id;
                                selected(m.Id, true);
                                this.clearDefaultItem();
                            });
                        });
                    }
                }
                const l = document.getElementById('All__Item');
                l.addEventListener('click', () => {
                    this.event.search.divisionId = '';
                    this.clearSearchList();
                });
            }

        }

        datePicker() {
            const beginDom = document.getElementById('beginTime');

            beginDom.addEventListener('tap', () => {
                const date = new Date();
                weui.datePicker({
                    start: date.getFullYear(),
                    end: date.getFullYear() + 100,
                    onConfirm: (rs: { label: string, value: string }[]) => {
                        beginDom.innerText = '';
                        beginDom.insertAdjacentText('afterbegin', rs[0].label + rs[1].label + rs[2].label);
                    

                        const day = TheDayTime(new Date(`${rs[0].value}-${rs[1].value}-${rs[2].value}`));
                        this.event.search.formBeginDate = day.begin;
                        this.event.search.formEndDate = day.end;
                        this.clearDayType(false);
                    },
                    title: '选择日期'
                });
            });

        }
    }

    export class IllegalDropEventsRecord {
        items: Map<string, IllegalDropEventRecord[]>;
    }

    export class ListImageDesc {
        imgSrc: string;
        topDesc: string;
        bottomDesc: string[];
        id: string;
        constructor(
            id: string,
            imgSrc: string,
            topDesc: string,
            bottomDesc: string[]) {
            this.id = id;
            this.imgSrc = imgSrc;
            this.topDesc = topDesc;
            this.bottomDesc = bottomDesc;
        }
    }

    export class ListImage {
        title: string;
        items: ListImageDesc[];
    }




    export class Page {


        init() {
            const eventId = getQueryVariable('eventid');
            if (eventId) {
                new HowellHttpClient.HttpClient().login2(() => {
                    new PushEventDetail().init(eventId);
                });
            }
            else {

                new HowellHttpClient.HttpClient().login(() => {
                    
                    const eventDetail = new EventHistoryPage.EventDetail();

                    const event = new EventHistoryPage.IllegalDropEvent(eventDetail);
 
                    setTimeout(() => {
                        const refresh = new EventHistoryPage.Refresh(event);
                        refresh.init();

                        const sw = new EventHistoryPage.SideWrapper(event);
                        sw.init();
                        sw.loadDivisionView();
                        sw.datePicker();

                    }, 1000);

                });
            }
        }
    }
}
new EventHistoryPage.Page().init();


