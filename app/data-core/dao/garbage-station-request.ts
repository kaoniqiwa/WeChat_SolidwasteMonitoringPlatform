
import { GarbageStationRequestService } from "../repuest/garbage-station.service";
import { HowellHttpClient } from "../repuest/http-client";
import { GetGarbageStationStatisticNumbersParams } from "../model/waste-regulation/garbage-station-number-statistic";
import { GetGarbageStationsParams } from "../model/waste-regulation/garbage-station";


export namespace GarbageStationRequestDao {
    export class GarbageStationRequest {
        maxSize = 99999;
        garbageStationService: GarbageStationRequestService;
        httpClient: HowellHttpClient.HttpClient;
        constructor() {
            this.httpClient = new HowellHttpClient.HttpClient();
            this.garbageStationService = new GarbageStationRequestService(this.httpClient.http)
        }
        async getGarbageStations(divisionsId: string) {
            const param = new GetGarbageStationsParams();
            param.PageIndex = 1;
            param.PageSize = this.maxSize;
            param.DivisionId = divisionsId;
            return await this.garbageStationService.list(param)

        }

        postGarbageStationStatisticNumbers(divisionsIds: string[]) {
            const param = new GetGarbageStationStatisticNumbersParams();
            param.PageIndex = 1;
            param.PageSize = this.maxSize;
            param.Ids = divisionsIds;
            return this.garbageStationService.statisticNumberList(param);
        }
    }
}

