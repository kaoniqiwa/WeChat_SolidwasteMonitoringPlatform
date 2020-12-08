import { SearchControl } from "./search";
import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { SessionUser } from "../../common/session-user";
import { TheDayTime, TableAttribute, unique, dateFormat, TheDay } from "../../common/tool";
import { DivisionTypeEnum } from "../../common/enum-helper";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { ResourceRoleType } from "../../common/enum-helper";
export namespace EventHistoryPage {
    export class EventDetail {
        constructor() {
            this.init();
        }
        init() {
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
            police__type.innerText = '乱扔垃圾报警';
            camera__name.innerText = item.ResourceName;
            station__name.innerText = item.Data.StationName;
            rc__name.innerText = item.Data.DivisionName;
            police__time.innerText = dateFormat(new Date(item.EventTime), 'yyyy-MM-dd HH:mm:ss');

            detail_img?.setAttribute('src', new MediumPicture().getData(item.ImageUrl));
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
        constructor(private detail: EventDetail) {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.eventService = new EventRequestService(this.httpClient.http);
            this.search = new SearchControl();
            this.user = new SessionUser();
          
        }

      async  defaultParam(){
            if (this.user.WUser && this.user.WUser.Resources && this.user.WUser.Resources.length) {                
                if (this.user.WUser.Resources[0].ResourceType == ResourceRoleType.GarbageStations)
                    this.search.stationId = this.user.WUser.Resources[0].Id;
                else {
                    const divisionRequest = new DivisionRequestDao.DivisionRequest()
                    ,divisionData= await divisionRequest.getDivisions();
                    const committees = divisionData.Data.Data.filter(c => c.DivisionType == DivisionTypeEnum.Committees);
                    this.search.divisionId = committees[0].Id;
                } 
            }
        }

        async init() {
            const data = await this.requestData(this.pageIndex),
                viewModel = this.convert(data.Data),
                dom = document.getElementById('listPanel');
            this.pageTotal = data.Page.PageCount;
            this.totalRecordCount = data.Page.TotalRecordCount;
            console.log(data.Page);

            var html = '', groupDom: HTMLElement;
            this.dataSource = [...this.dataSource, ...data.Data];

            viewModel.map(x => {

                var listHtml = '';
                x.items.map(v => {

                    listHtml += `
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
                const nodeList = document.getElementsByName(x.title);
                groupDom = nodeList && nodeList.length ? nodeList[0] : null;
                if (groupDom) {
                    groupDom.insertAdjacentHTML('afterend', listHtml);
                    document.getElementById(`${x.title}_page`).innerText = `${this.dataSource.length}/${this.totalRecordCount}`;
                }

                html += `<div class="weui-panel weui-panel_access fill-height" style=" overflow: auto;">
                <div class="weui-panel__hd">${x.title}                   
                    <label style="float: right;" id="${x.title}_page">${this.dataSource.length}/${this.totalRecordCount}</label></div> 
                <div class="weui-panel__bd" name="${x.title}">
                ${listHtml}
                </div>
                </div>`;
            });
            if (groupDom == null)
                dom.insertAdjacentHTML('afterbegin', html);
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

        destroy(is:boolean=true) {
            this.clearDom();
            this.dataSource = new Array();
            this.pageIndex = 1;
            this.pageTotal = 0;
            this.totalRecordCount = 0;
            if(is)mui('#refreshContainer').pullRefresh().refresh(true);
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
                new MediumPicture().getData(item.ImageUrl)
                , item.Data.DivisionName
                , [item.ResourceName, dateFormat(new Date(item.EventTime), 'HH:mm')]);
        }

        getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {

            const param = new GetEventRecordsParams(), day = TheDayTime(new Date());
            param.PageIndex = pageIndex;
            param.BeginTime = day.begin.toISOString();
            param.EndTime = day.end.toISOString();
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
            },d = ()=>{
                this.dropEvent.destroy(false)
                this.dropEvent.init();
               
            };
            mui.init({
                pullRefresh: {
                    container: '#refreshContainer',
                    down: {
                        callback: function(){
                            d();
                            this.endPulldownToRefresh(false);
                            this.refresh(true);
                            
                        }
                    },
                    up: {
                        auto: true,
                        callback: function () {
                            a((b) => {
                                console.log(b);
                             
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
            mui.init({
                swipeBack: false,
            });
            //侧滑容器父节点
            var offCanvasWrapper = mui('#offCanvasWrapper');
            const wrapperDom = document.getElementById('offCanvasWrapper')
                , sideDom = document.getElementById('offCanvasSide');

            document.getElementById('offCanvasShow').addEventListener('tap', () => {
                const className = wrapperDom.getAttribute('class');
                wrapperDom.setAttribute('class', className + ' mui-active');
                sideDom.style.visibility = 'visible';
                sideDom.style.transform = 'translate3d(0px, 0px, 0px)';
                // offCanvasWrapper.offCanvas('show');


            });
            document.getElementById('viewMark').addEventListener('tap', () => {
                const className = wrapperDom.getAttribute('class');
                wrapperDom.setAttribute('class', className.replace('mui-active', ''));
                sideDom.removeAttribute("style");
                // offCanvasWrapper.offCanvas('close');
            });
            mui('#offCanvasSideScroll').scroll();

            document.getElementById('searchBtn').addEventListener('tap', async() => {
                this.event.dataSource = new Array();
                this.event.destroy();
                this.event.init();   
              
            });

            const fillTime = (begin?: Date, end?: Date) => {
                const beginDom = document.getElementById('beginTime'), endDom = document.getElementById('endTime')
                    , day = TheDayTime(new Date());
                var b = '', e = '';
                if (begin && end) {
                    b = dateFormat(begin, 'yyyy-MM-dd HH:mm').substring(2);
                    e = dateFormat(end, 'yyyy-MM-dd HH:mm').substring(2);

                }
                else {
                    b = dateFormat(day.begin, 'yyyy-MM-dd HH:mm').substring(2);
                    e = dateFormat(day.end, 'yyyy-MM-dd HH:mm').substring(2);
                }
                beginDom.innerText = b;
                endDom.innerText = e;
                beginDom.setAttribute('data-time'b);
                endDom.setAttribute('data-time', e);
            }
            fillTime();
            document.getElementById('the_day').addEventListener('tap', () => {
                this.event.search.day = 0;
                const day = TheDay(0);
                fillTime(day.begin, day.end);
            });
            document.getElementById('the_yesterday').addEventListener('tap', () => {
                this.event.search.day = -1;
                const day = TheDay(-1);
                fillTime(day.begin, day.end);
            });
            document.getElementById('the_before_day').addEventListener('tap', () => {
                this.event.search.day = -2;
                const day = TheDay(-2);
                fillTime(day.begin, day.end);
            });

            document.getElementById('resetBtn').addEventListener('tap', () => {
                const childDoms = document.getElementById('stationView').children;
                for (let i = 0; i < childDoms.length; i++) {
                    const ele = childDoms[i];
                    const className = ele.getAttribute('class');
                    if (i == 0)
                        ele.setAttribute('class', className + ' selected');
                    else ele.setAttribute('class', className.replace('selected', ''));
                }
                this.clearDayType()
                fillTime();
            });
        }


        clearDayType() {
            ['the_day', 'the_yesterday', 'the_before_day'].map(x => {
                const dom = document.getElementById(x)
                    , className = dom.getAttribute('class');
                if (x == 'the_day') dom.setAttribute('class', className + ' selected');
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
                , stationViewDom = document.getElementById('stationView'), selected = (id: string, add: boolean) => {
                    const tag = document.getElementsByName(id)[0];
                    var classNames = tag.getAttribute('class');
                    if (add) classNames += ' selected';
                    else classNames = classNames.replace('selected', '');
                    tag.setAttribute('class', classNames);
                };
            var html = '';
            stationTextDom.innerHTML = '';
            if (this.event.user.WUser.Resources && this.event.user.WUser.Resources.length) {
                if (this.event.user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {
                    stationTextDom.innerHTML = '居委';
                    const committees = divisionResponse.Data.Data.filter(c => c.DivisionType == DivisionTypeEnum.Committees)
                        , addSelected = (i: number) => {
                            if (i == 0) return 'selected';
                        };

                    for (let i = 0; i < committees.length; i++) {
                        if (i == 0) {
                            // this.event.search.stationId = committees[i].Id;
                            this.event.search.divisionId = committees[i].Id;
                        }
                        if (i % 2 == 0)
                            html += ` <li class="pull-left m-r-10 m-b-10 ${addSelected(i)}  " name="${committees[i].Id}">${committees[i].Name}</li>`;
                        else html += ` <li class="pull-left m-b-10  ${addSelected(i)}" name="${committees[i].Id}">${committees[i].Name}</li>`;

                    }
                    stationViewDom.insertAdjacentHTML('afterbegin', html);

                    committees.map(m => {

                        const gDom = document.getElementsByName(m.Id)[0];
                        gDom.addEventListener('tap', () => {
                            selected(this.event.search.divisionId, false);
                            this.event.search.divisionId = m.Id;
                            selected(m.Id, true);
                        });
                    });
                }
                else if (this.event.user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
                    stationTextDom.innerHTML = '垃圾房';
                    const stationsResponse = await request.getGarbageStations(user.WUser.Resources[0].Id), addSelected = (i: number) => {
                        if (i == 0) return 'selected';
                    }
                    if (stationsResponse && stationsResponse.Data) {
                        for (let i = 0; i < stationsResponse.Data.Data.length; i++) {
                            const stations = stationsResponse.Data.Data[i];
                            if (i == 0)
                                this.event.search.stationId = stations.Id;
                            if (i % 2 == 0)
                                html += ` <li class="pull-left m-r-10 m-b-10 ${addSelected(i)}  " name="${stations.Id}">${stations.Name}</li>`;
                            else html += ` <li class="pull-left m-b-10  ${addSelected(i)}" name="${stations.Id}">${stations.Name}</li>`;
                        }
                        stationViewDom.insertAdjacentHTML('afterbegin', html);

                        stationsResponse.Data.Data.map(m => {

                            const gDom = document.getElementsByName(m.Id)[0];
                            gDom.addEventListener('tap', () => {
                                selected(this.event.search.stationId, false);
                                this.event.search.stationId = m.Id;
                                selected(m.Id, true);
                            });
                        });
                    }
                }

            }

        }

        changeDayNum() {
            const types = document.getElementsByClassName('time-type-box')
                , clearSelected = () => {
                    for (let i = 0; i < types.length; i++) {
                        var classNames = types[i].getAttribute('class');
                        classNames = classNames.replace('selected', '');
                        types[i].setAttribute('class', classNames);
                    }
                };
            for (let i = 0; i < types.length; i++) {
                types[i].addEventListener('tap', () => {
                    clearSelected();
                    var classNames = types[i].getAttribute('class');
                    classNames += ' selected';
                    types[i].setAttribute('class', classNames);
                });

            }
        }

        datePicker() {
            const beginDom = document.getElementById('beginTime'), endDom = document.getElementById('endTime')
                ;
            endDom.addEventListener('tap', () => {
                const date = new Date();
                var picker = new mui.DtPicker({
                    "value": endDom.getAttribute('data-time')
                    , "beginYear": date.getFullYear(), "endYear": date.getFullYear() + 100
                });
                picker.show((rs) => {
                    /*
                     * rs.value 拼合后的 value
                     * rs.text 拼合后的 text
                     * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                     * rs.m 月，用法同年
                     * rs.d 日，用法同年
                     * rs.h 时，用法同年
                     * rs.i 分（minutes 的第二个字母），用法同年
                     */
                    console.log('选择结果: ' + rs.text);
                    endDom.innerText = '';
                    endDom.insertAdjacentText('afterbegin', rs.value.substring(2));
                    this.event.search.formEndDate = new Date(rs.value);
                    this.clearDayType();
                    picker.dispose();
                });
            });
            beginDom.addEventListener('tap', () => {
                const date = new Date();
                var picker = new mui.DtPicker({
                    "value": beginDom.getAttribute('data-time')
                    , "beginYear": date.getFullYear(), "endYear": date.getFullYear() + 100
                });
                picker.show((rs) => {
                    beginDom.innerText = '';
                    beginDom.insertAdjacentText('afterbegin', rs.value.substring(2))
                    this.event.search.formBeginDate = new Date(rs.value);
                    this.clearDayType();
                    picker.dispose();
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

    export class SearchBar {

        val = '';
        constructor(private event: IllegalDropEvent) {

            const searchBar = document.getElementById('searchBar')
                , searchInput = document.getElementById('searchInput');
            searchBar.addEventListener('click', () => {
                var className = searchBar.getAttribute('class');
                className += ' weui-search-bar_focusing';
                searchBar.setAttribute('class', className);
                searchInput.focus();
            });
            searchInput.addEventListener('input', (event: InputEvent) => {
                this.event.search.text = searchInput.value;
            });
            searchInput.addEventListener('keypress', (event) => {

                if (event.code == "Enter" || event.code) {
                    this.event.destroy();
                    //this.refresh.d();
                    this.event.init();
                }
            });
        }


    }
}

new HowellHttpClient.HttpClient().login(() => {
    const eventDetail = new EventHistoryPage.EventDetail();

    const event = new EventHistoryPage.IllegalDropEvent(eventDetail);
       event.defaultParam()
  

    setTimeout(() => {
        const refresh = new EventHistoryPage.Refresh(event);
        refresh.init();
        new EventHistoryPage.SearchBar(event);
        const sw = new EventHistoryPage.SideWrapper(event);
        sw.init();
        sw.loadDivisionView();
        sw.changeDayNum();
        sw.datePicker();

    }, 1000);

});

