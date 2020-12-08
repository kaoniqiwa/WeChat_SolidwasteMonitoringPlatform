import { EventNumber } from "../../data-core/model/waste-regulation/event-number";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { AppEChart } from "../../common/echart-line";
import { DivisionTypeEnum, ResourceRoleType } from "../../common/enum-helper";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
namespace GarbageCondition {


        async function getDivisionType(divisionId = '310109011000') {
                const divisions = await getDivisions();
                var divisionsType: DivisionTypeEnum;
                for (const x of divisions) {
                        if (x.Id == divisionId)
                                divisionsType = x.DivisionType;
                }
                return divisionsType;
        }

        async function getDivisions() {
                const request = new DivisionRequestDao.DivisionRequest()
                        , responseDivisions = await request.getDivisions();
                return responseDivisions.Data.Data;
        }


        export class IllegalDropHistory {
                async getData() {
                        const model = new IllegalDropEventData()
                                , request = new DivisionRequestDao.DivisionRequest()
                                , user = new SessionUser();
                        model.datas = new Array();
                        if (user.WUser.Resources && user.WUser.Resources.length) {
                                const data = await request.getDivisionEventNumbers(user.WUser.Resources[0].Id, DivisionRequestDao.TimeUnitEnum.Hour);
                                for (var x of data.Data.Data) {
                                        for (const y of x.EventNumbers)
                                                if (y.EventType == EventTypeEnum.IllegalDrop)
                                                        model.datas.push(y);
                                }
                                return model;
                        }
                }

                Convert(input: IllegalDropEventData): AppEChart.LineOption {
                        const lc = this.joinPart(new AppEChart.LineOption());
                        var enters1 = new Array<EventNumber>();
                        for (let i = 0; i < input.datas.length; i++) {
                                enters1.push(input.datas[i]);
                        }
                        lc.seriesData = new Array();
                        for (const x of enters1)
                                lc.seriesData.push(x.DeltaNumber);
                        return lc;
                }

                async init() {

                        const datas = await this.getData(),
                                chartOptions = this.Convert(datas);
                        new AppEChart.EChartLine().init(document.getElementById('chart'), chartOptions);
                }

                private joinPart(t1: AppEChart.LineOption) {
                        t1.xAxisData = [];
                        for (let i = 1; i <= 12; i++) {
                                if (i < 10)
                                        t1.xAxisData.push('0' + i + ':00');
                                else
                                        t1.xAxisData.push(i + ':00');
                        }
                        for (let i = 13; i <= 24; i++) {
                                if (i == 24)
                                        t1.xAxisData.push('23' + ':59');
                                else
                                        t1.xAxisData.push(i + ':00');
                        }
                        return t1;
                }


        }

        export class IllegalDropOrder {
                async getData() {
                        const request = new DivisionRequestDao.DivisionRequest()
                                , garbageStationRequest = new GarbageStationRequestDao.GarbageStationRequest()
                                , divisions = await getDivisions()
                                , user = new SessionUser();

                        const model = new IllegalDropOrderInfo();
                        model.items = new Array();
                        if (user.WUser.Resources && user.WUser.Resources.length) {
                                if (user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {
                                        const divisionsIds = new Array();
                                        divisions.filter(x => x.DivisionType == DivisionTypeEnum.Committees).map(x => divisionsIds.push(x.Id));
                                        const responseStatistic = await request.postDivisionStatisticNumbers(divisionsIds);
                                        for (const x of responseStatistic.Data.Data) {
                                                const info = new IllegalDropInfo();
                                                model.items.push(info);
                                                info.division = x.Name;
                                                info.dropNum = 0;
                                                for (const v of x.TodayEventNumbers)
                                                        if (v.EventType == EventTypeEnum.IllegalDrop)
                                                                info.dropNum += v.DayNumber;
                                        }
                                }
                                else if (user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
                                        const responseStations = await garbageStationRequest.getGarbageStations(user.WUser.Resources[0].Id)
                                                , stationIds = new Array<string>();


                                        for (const x of responseStations.Data.Data)
                                                stationIds.push(x.Id);
                                        if (stationIds.length) {
                                                const responseStatistic = await garbageStationRequest.postGarbageStationStatisticNumbers(stationIds);
                                                for (const x of responseStatistic.Data.Data) {
                                                        const info = new IllegalDropInfo();
                                                        model.items.push(info);
                                                        info.division = x.Name;
                                                        info.dropNum = 0;
                                                        for (const v of x.TodayEventNumbers)
                                                                if (v.EventType == EventTypeEnum.IllegalDrop)
                                                                        info.dropNum += v.DayNumber;
                                                }
                                        }
                                }
                                return model;
                        }

                       

                }

                Convert(input: IllegalDropOrderInfo): OrderTable {
                        const viewModel = new OrderTable()

                        viewModel.table = new Array();

                        const sort = input.items.sort((a, b) => {
                                return b.dropNum - a.dropNum
                        });
                        for (const x of sort.slice(0, 5)) {
                                viewModel.table.push({
                                        name: x.division,
                                        subName: x.dropNum + '',
                                        subNameAfter: '起'
                                });
                        }

                        const len = viewModel.table.length;
                        for (let i = 0; i < 5 - len; i++) {
                                viewModel.table.push({
                                        name: '-',
                                        subName: '0',
                                        subNameAfter: '起'
                                });

                        }
                        return viewModel;
                }

                async init() {
                        const datas = await this.getData(),
                                viewModel = this.Convert(datas)
                                , dom = document.getElementById('top5')
                                , bgColor = ['red-bg', 'red-bg', 'red-bg', 'orange-bg', 'orange-bg'];

                        var html = '';
                        dom.innerHTML = '';
                        for (let i = 0; i < viewModel.table.length; i++) {
                                const t = viewModel.table[i];
                                if (i == viewModel.table.length - 1) {
                                        html += ` <div class="fill-width top5-list-wrap m-b-10">
                                        <div class="pull-left number-item text-center m-r-10  ${bgColor[i]}">
                                            <label class="white-text ">${i + 1}</label>
                                        </div>
                                        <div class="pull-left card-box-title black-text">${t.name}</div>
                                        <div class="pull-right card-box-title sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
                                    </div> `;
                                }
                                else html += ` <div class="fill-width top5-list-wrap =">
                              <div class="pull-left number-item text-center m-r-10  ${bgColor[i]}">
                                  <label class="white-text ">${i + 1}</label>
                              </div>
                              <div class="pull-left card-box-title black-text">${t.name}</div>
                              <div class="pull-right card-box-title sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
                          </div> `;

                        }
                        dom.insertAdjacentHTML('afterbegin', html);

                }
        }


        export class DivisionGarbageSpecification {
                async getData() {
                        const request = new DivisionRequestDao.DivisionRequest()
                                , garbageStationRequest = new GarbageStationRequestDao.GarbageStationRequest()
                                , user = new SessionUser()
                                , divisions = await getDivisions()
                                , model = new Specification();

                        model.illegalDropNumber = 0;
                        if (user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {
                                const divisionIds = new Array<string>();
                                divisions.filter(x => x.ParentId == user.WUser.Resources[0].Id).map(y => {
                                        divisionIds.push(y.Id);
                                });
                                const responseData = await request.postDivisionStatisticNumbers(divisionIds);
                                for (const x of responseData.Data.Data) {
                                        for (const v of x.TodayEventNumbers)
                                                if (v.EventType == EventTypeEnum.IllegalDrop)
                                                        model.illegalDropNumber += v.DayNumber;
                                                else if (v.EventType == EventTypeEnum.MixedInto)
                                                        model.hybridPushNumber += v.DayNumber;
                                }
                        }
                        else if (user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
                                const responseStations = await garbageStationRequest.getGarbageStations(user.WUser.Resources[0].Id)
                                        , stationIds = new Array<string>();


                                for (const x of responseStations.Data.Data)
                                        stationIds.push(x.Id);
                                if (stationIds.length) {
                                        const responseData = await garbageStationRequest.postGarbageStationStatisticNumbers(stationIds);
                                        for (const x of responseData.Data.Data) {
                                                for (const v of x.TodayEventNumbers)
                                                        if (v.EventType == EventTypeEnum.IllegalDrop)
                                                                model.illegalDropNumber += v.DayNumber;
                                                        else if (v.EventType == EventTypeEnum.MixedInto)
                                                                model.hybridPushNumber += v.DayNumber;
                                        }
                                }
                        }
                        // if (divisionType == DivisionTypeEnum.Committees) {


                        // }
                        // else if (divisionType == DivisionTypeEnum.County) {

                        // }
                        // else if (divisionType == void 0) {
                        //         const responseData = await request.postDivisionStatisticNumbers([divisionId]);
                        //         for (const x of responseData.Data.Data) {
                        //                 for (const v of x.TodayEventNumbers)
                        //                         if (v.EventType == EventTypeEnum.IllegalDrop)
                        //                                 model.illegalDropNumber += v.DayNumber;
                        //                         else if (v.EventType == EventTypeEnum.MixedInto)
                        //                                 model.hybridPushNumber += v.DayNumber;
                        //         }
                        // }
                        return model;
                }

                Convert(input: Specification): number[] {
                        return [input.illegalDropNumber, 0];
                }

                async init() {
                        const datas = await this.getData(),
                                viewModel = this.Convert(datas)
                                , dom = document.getElementById('illegalDrop')
                                , dom2 = document.getElementById('hybridPush');
                        if (viewModel && viewModel.length) {
                                var html = '', html2 = '';
                                dom.innerHTML = '';
                                dom2.innerHTML = '';
                                html += `  <h4 class="card-box-desc sky-blue-text" > ${viewModel[0]}<label
                        class="card-box-desc-unit gray-text"> 起</label></h4>`;
                                dom.insertAdjacentHTML('afterbegin', html);
                                html2 += `  <h4 class="card-box-desc sky-blue-text" > ${viewModel[1]}<label
                                class="card-box-desc-unit gray-text"> 起</label></h4>`;
                                dom2.insertAdjacentHTML('afterbegin', html2);
                        }
                }
        }

        export class Refresh {

                init() {
                        mui.init({
                                pullRefresh: {
                                        container: '#refreshContainer',
                                        down: {
                                                callback: () => {
                                                        new GarbageCondition.IllegalDropHistory().init();
                                                        new GarbageCondition
                                                                .IllegalDropOrder().init();
                                                        new GarbageCondition.DivisionGarbageSpecification().init();
                                                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                                }
                                        }
                                }
                        });

                }
        }

        class IllegalDropEventData {
                datas: EventNumber[];
        }

        class IllegalDropOrderInfo {
                items: IllegalDropInfo[];
        }

        export class Specification {
                /**投放点 */
                garbagePushNumber: number;
                /**垃圾桶 */
                garbageBarrelNumber: number;
                /**满溢 */
                fullPushNumber: number;
                /**乱扔行为 */
                illegalDropNumber: number;
                /**混合行为 */
                hybridPushNumber: number;
        }


        class IllegalDropInfo {
                division: string;
                dropNum: number;
                unit: string;
        }
        export class OrderTable {
                table: {
                        name: string;
                        subName: string;
                        subNameAfter: string;
                }[]
        }


        enum EventTypeEnum {
                IllegalDrop = 1,
                MixedInto,
                GarbageVolume,
                GarbageFull
        }



}

new HowellHttpClient.HttpClient().login(() => {
        new GarbageCondition.IllegalDropHistory().init();
        new GarbageCondition.Refresh().init();

        new GarbageCondition.IllegalDropOrder().init();
        new GarbageCondition.DivisionGarbageSpecification().init();
})