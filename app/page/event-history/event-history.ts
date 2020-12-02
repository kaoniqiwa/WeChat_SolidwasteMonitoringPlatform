import { SearchControl } from "./search";
import { MediumPicture } from "../../data-core/url/aiop/medium";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { SessionUser } from "../../common/session-user";
import { TheDayTime, TableAttribute, unique, dateFormat } from "../../common/tool";
import { DivisionTypeEnum } from "../../common/enum-helper";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { DivisionRequestDao } from "../../data-core/dao/division-request";

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
                mui.back =  () =>{
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
                police__time = document.getElementById('police__time');
            police__type.innerText = '乱扔垃圾报警';
            camera__name.innerText = item.ResourceName;
            station__name.innerText = item.Data.StationName;
            rc__name.innerText = item.Data.DivisionName;
            police__time.innerText = dateFormat(new Date(item.EventTime), 'yyyy-MM-dd HH:mm:ss');
        }
    }

    export class IllegalDropEvent {
        httpClient: HowellHttpClient.HttpClient;
        eventService: EventRequestService;
        search: SearchControl;
        pageIndex = 1;
        dataSource = new Array<IllegalDropEventRecord>();
        constructor(private detail: EventDetail) {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.eventService = new EventRequestService(this.httpClient.http);
            this.search = new SearchControl();
            this.search.divisionId = new SessionUser().division;
        }

        async init() {
            const data = await this.requestData(this.pageIndex),
                viewModel = this.convert(data),
                dom = document.getElementById('listPanel');
            var html = '', groupDom: HTMLElement;
            this.dataSource = [...this.dataSource ,...data];
            viewModel.map(x => {

                var listHtml = '';
                x.items.map(v => {

                    listHtml += `
                    <a href="#detail" data-tag="${v.id}" class="weui-media-box weui-media-box_appmsg box__item" >
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" style="border-radius: 6px;"
                            src="/api/howell/ver10/aiop_service/Medium/Pictures/5fc025480000002440001f16.jpg" alt="">
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
                if (groupDom)
                    groupDom.insertAdjacentHTML('afterend', listHtml);

                html += `<div class="weui-panel weui-panel_access fill-height" style=" overflow: auto;">
                <div class="weui-panel__hd">${x.title}</div> 
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
        }

        clearDom() {
            const dom = document.getElementById('listPanel');
            dom.innerHTML = '';
        }

        async requestData(pageIndex: number) {
            var responseData = await this.eventService.list(this.getRequsetParam(pageIndex, this.search));
            return responseData.Data.Data;

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
                new MediumPicture().getJPG(item.ImageUrl)
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
            else {
                if (s.BeginTime) param.BeginTime = s.BeginTime;
                if (s.EndTime) param.EndTime = s.EndTime;
                if (s.DivisionId) param.DivisionIds = [s.DivisionId];
                if (s.StationId) param.StationIds = [s.StationId];
            }
            return param;
        }
    }

    export class Refresh {
        init() {
            mui.init({
                pullRefresh: {
                    container: '#refreshContainer',
                    down: {
                        callback: () => {
                            const e = new EventHistoryPage.IllegalDropEvent();
                            e.clearDom();
                            e.init();
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        }
                    },
                    up: {
                        callback: () => {
                            new EventHistoryPage.IllegalDropEvent().init();
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
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

            document.getElementById('offCanvasShow').addEventListener('tap', function () {
                offCanvasWrapper.offCanvas('show');
            });
            document.getElementById('viewMark').addEventListener('tap', function () {
                offCanvasWrapper.offCanvas('close');
            });
            mui('#offCanvasSideScroll').scroll();

        }

        async loadDivisionView() {
            const request = new GarbageStationRequestDao.GarbageStationRequest()
                , user = new SessionUser()
                , divisionRequest = new DivisionRequestDao.DivisionRequest()
                , divisionResponse = await divisionRequest.getDivisions()

                , stationViewDom = document.getElementById('stationView'), selected = (id: string, add: boolean) => {
                    const tag = document.getElementsByName(id)[0];
                    var classNames = tag.getAttribute('class');
                    if (add) classNames += ' selected';
                    else classNames = classNames.replace('selected', '');
                    tag.setAttribute('class', classNames);
                };
            var html = '', isCommittees = false;
            if (divisionResponse && divisionResponse.Data) {
                const division = divisionResponse.Data.Data.find(x => x.Id == user.division);
                isCommittees = division.DivisionType == DivisionTypeEnum.Committees;
                if (division.DivisionType == DivisionTypeEnum.County) {
                    const committees = divisionResponse.Data.Data.filter(c => c.DivisionType == DivisionTypeEnum.Committees)
                        , addSelected = (i: number) => {
                            if (i == 0) return 'selected';
                        };

                    for (let i = 0; i < committees.length; i++) {
                        if (i == 0) this.event.search.stationId = committees[i].Id;
                        if (i % 2 == 0)
                            html += ` <li class="pull-left m-r-10 m-b-10 ${addSelected(i)}  " name="${committees[i].Id}">${committees[i].Name}</li>`;
                        else html += ` <li class="pull-left m-b-10  ${addSelected(i)}" name="${committees[i].Id}">${committees[i].Name}</li>`;

                    }
                    stationViewDom.insertAdjacentHTML('afterbegin', html);

                    committees.map(m => {

                        const gDom = document.getElementsByName(m.Id)[0];
                        gDom.addEventListener('tap', () => {
                            selected(this.event.search.stationId, false);
                            this.event.search.stationId = m.Id;
                            selected(m.Id, true);
                        });
                    });
                }

            }
            if (isCommittees) {
                const stationsResponse = await request.getGarbageStations(user.division);
                if (stationsResponse && stationsResponse.Data) {
                    for (let i = 0; i < stationsResponse.Data.Data.length; i++) {
                        const data = stationsResponse.Data.Data[i];
                        html += ` <li class="pull-left m-r-10 m-b-10 division-tag" name="${data.Id}">${data.Name}</li>`;
                    }
                    stationViewDom.insertAdjacentHTML('afterbegin', html);
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
                    "value": dateFormat(date, 'yyyy-MM-dd HH:ss')
                    , "beginYear": date.getFullYear(), "endYear": date.getFullYear() + 100
                });
                picker.show(function (rs) {
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
                    picker.dispose();
                });
            });
            beginDom.addEventListener('tap', () => {
                const date = new Date();
                var picker = new mui.DtPicker({
                    "value": dateFormat(date, 'yyyy-MM-dd HH:ss')
                    , "beginYear": date.getFullYear(), "endYear": date.getFullYear() + 100
                });
                picker.show(function (rs) {
                    beginDom.innerText = '';
                    beginDom.insertAdjacentText('afterbegin', rs.value.substring(2))
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
        constructor() {

            const searchBar = document.getElementById('searchBar')
                , searchInput = document.getElementById('searchInput');
            searchBar.addEventListener('click', () => {
                var className = searchBar.getAttribute('class');
                className += ' weui-search-bar_focusing';
                searchBar.setAttribute('class', className);
                searchInput.focus();
            });
            searchInput.addEventListener('input', (event: InputEvent) => {
                this.val += event.data;
                console.log(this.val);

            });
        }


    }
}

const eventDetail = new EventHistoryPage.EventDetail();
new EventHistoryPage.SearchBar();
const event = new EventHistoryPage.IllegalDropEvent(eventDetail);
event.init()
setTimeout(() => {

    new EventHistoryPage.Refresh().init();
    const sw = new EventHistoryPage.SideWrapper(event);
    sw.init();
    sw.loadDivisionView();
    sw.changeDayNum();
    sw.datePicker();

}, 500);

