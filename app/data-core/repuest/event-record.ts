
import { PagedList } from "../model/page";
import { Response } from "../model/response";
import * as url from "../url/waste-regulation/event";

import { IllegalDropEventRecord } from "../model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "./howell-auth-http";
import { MixedIntoEventRecord } from "../model/waste-regulation/mixed-into-event-record";
import { GarbageFullEventRecord } from "../model/waste-regulation/garbage-full-event-record";
import { GetEventRecordsParams } from "../model/waste-regulation/event-record";
import { plainToClass } from "class-transformer";

export class EventRequestService {
    url: url.EventRecord;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.EventRecord();
    }

    async illegalDropList(item: GetEventRecordsParams) {
        let response = await this.requestService.post<GetEventRecordsParams, Response<PagedList<IllegalDropEventRecord>>>(this.url.illegalDrop(), item);
        response.Data.Data = plainToClass(IllegalDropEventRecord, response.Data.Data);
        return response.Data;
    }

    async illegalDropSingle(id: string) {
        let response = await this.requestService.get<Response<IllegalDropEventRecord>>(this.url.illegalDropSingle(id));
        return plainToClass(IllegalDropEventRecord, response.Data);
    }

    async mixedIntoList(item: GetEventRecordsParams) {
        let response = await this.requestService.post<GetEventRecordsParams, Response<PagedList<MixedIntoEventRecord>>>(this.url.mixedIntoList(), item);
        response.Data.Data = plainToClass(MixedIntoEventRecord, response.Data.Data);
        return response.Data;
    }

    async mixedIntoSingle(id: string) {
        let response = await this.requestService.get<Response<MixedIntoEventRecord>>(this.url.mixedIntoSingle(id));
        return plainToClass(MixedIntoEventRecord, response.Data);
    }
    async garbageFullList(item: GetEventRecordsParams) {
        let response = await this.requestService.post<GetEventRecordsParams, Response<PagedList<GarbageFullEventRecord>>>(this.url.garbageFullList(), item);
        response.Data.Data = plainToClass(GarbageFullEventRecord, response.Data.Data);
        return response.Data;
    }
    async garbageFullSingle(id: string) {
         let response = await this.requestService.get<Response<GarbageFullEventRecord>>(this.url.mixedIntoSingle(id));
         return plainToClass(GarbageFullEventRecord, response.Data);
    }



}




