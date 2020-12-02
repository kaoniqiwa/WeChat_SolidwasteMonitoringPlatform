import { TableAttribute } from "../../common/tool";
import { GarbageStation, GetGarbageStationsParams } from "../../data-core/model/waste-regulation/garbage-station";
import { SearchControl } from "./search";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { GarbageStationRequestService } from "../../data-core/repuest/garbage-station.service";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { StationStateEnum } from "../../common/enum-helper";
import { Division } from "../../data-core/model/waste-regulation/division";
import { MediumPicture } from "../../data-core/url/aiop/medium";
import { SessionUser } from "../../common/session-user";
namespace GarbageStationsPage {
    async function getDivisions() {
        const request = new DivisionRequestDao.DivisionRequest()
            , responseDivisions = await request.getDivisions();
        return responseDivisions.Data.Data;
    }
    export class GarbageStations {
        httpClient: HowellHttpClient.HttpClient;
        stationService: GarbageStationRequestService;
        search: SearchControl;
        pageIndex = 1;
        dataSource = new Array<GarbageStation>();
        constructor() {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.stationService = new GarbageStationRequestService(this.httpClient.http);
            this.search = new SearchControl();
            this.search.divisionId = new SessionUser().division;
        }

        async init() {
            const data = await this.requestData(this.pageIndex),
                statistics = new Statistics(),

                dom = document.getElementById('listPanel');
            statistics.divisions = await getDivisions();
            statistics.garbageStations = data; 
            var html = '';
            this.dataSource = [...this.dataSource, ...data];
        }

        async requestData(pageIndex: number) {
            var responseData = await this.stationService.list(this.getRequsetParam(pageIndex, this.search));
            return responseData.Data.Data;

        }

        convert(input: Statistics) {
            const items = new Array<TableField>();
            for (const item of input.garbageStations) {
                items.push(this.toTableModel(item, input.divisions));
            }
            return items;
        }

        toTableModel(item: GarbageStation, divisions: Division[]) {
            const tableField = new TableField(), pic = new MediumPicture();
            tableField.id = item.Id;
            tableField.name = item.Name;
            tableField.imgSrc = new Array<string>();
            if (item.Cameras) {
                item.Cameras.map(c => {
                    tableField.imgSrc.push(pic.getJPG(c.ImageUrl));
                })
            }
            tableField.state = StationStateEnum[item.StationState];
            const division = divisions.find(x => x.Id == item.DivisionId);
            tableField.division = division ? division.Name : '-';
            return tableField;
        }

        getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {
            const param = new GetGarbageStationsParams();
            param.PageIndex = pageIndex;
            param.DryFull = true;
            if (pageSize) param.PageSize = pageSize;
            else param.PageSize = new TableAttribute().pageSize;
            const s = search.toSearchParam();

            if (s.DivisionId)
                param.DivisionId = s.DivisionId;
            if (s.SearchText) param.Name = s.SearchText;
            return param;
        }
    }

    export class Statistics {
        divisions: Division[];
        garbageStations: GarbageStation[];
    }

    export class TableField {
        id: string;
        name: string;
        imgSrc: string[];
        state: string;
        division: string;
    }


}