
import { DivisionRequestService } from "../repuest/division.service";
import { GetDivisionsParams } from "../model/waste-regulation/division";
import { HowellHttpClient } from "../repuest/http-client";
import { GetDivisionEventNumbersParams, TimeUnit } from "../model/waste-regulation/division-event-numbers";
import { GetDivisionStatisticNumbersParams } from "../model/waste-regulation/division-number-statistic";

export namespace DivisionRequestDao {
        export class DivisionRequest {
                maxSize = 99999;
                divisionService: DivisionRequestService;
                httpClient: HowellHttpClient.HttpClient;
                constructor() {
                        this.httpClient = new HowellHttpClient.HttpClient();
                        this.divisionService = new DivisionRequestService(this.httpClient.http); 
                }

                getDivisions() {
                        const param = new GetDivisionsParams();
                        param.PageIndex = 1;
                        param.PageSize = this.maxSize;
                        return this.divisionService.list(param);
                }

                getDivisionStatisticNumber(divisionsId: string) {
                        return this.divisionService.statisticNumber(divisionsId);
                }

                getDivisionEventNumbers(divisionsId: string, timeUnit:TimeUnit = TimeUnit.Day, date:Date = new Date()) {
                        const param = new GetDivisionEventNumbersParams(), dayTime = this.TheDayTime(date);
                        param.TimeUnit = timeUnit;
                        param.BeginTime = dayTime.begin.toISOString();
                        param.EndTime = dayTime.end.toISOString();
                        param.PageIndex = 1;
                        param.PageSize = this.maxSize;
                        return this.divisionService.eventNumbersHistory(param, divisionsId)

                }

                postDivisionStatisticNumbers(divisionsIds: string[]) {
                        const param = new GetDivisionStatisticNumbersParams();
                        param.PageIndex = 1;
                        param.PageSize = this.maxSize;
                        param.Ids = divisionsIds;
                        return this.divisionService.statisticNumberList(param);
                }


                TheDayTime(date: Date) {
                        let y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
                        return {
                                begin: new Date(y, m, d, 0, 0, 0)
                                , end: new Date(y, m, d, 23, 59, 59)
                        }
                }
        }

        export enum TimeUnitEnum {
                Hour = 1,
                Day
        }
} 