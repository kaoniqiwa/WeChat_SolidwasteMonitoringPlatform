
import { PagedList } from "../model/page";
import { Response } from "../model/response";
import * as url from "../url/waste-regulation/event";

import { IllegalDropEventRecord } from "../model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "./howell-auth-http";
import { MixedIntoEventRecord } from "../model/waste-regulation/mixed-into-event-record";
import { GarbageFullEventRecord } from "../model/waste-regulation/garbage-full-event-record";
import { GetEventRecordsParams } from "../model/waste-regulation/event-record";

export class EventRequestService {
    url: url.EventRecord;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.EventRecord();
    }

    illegalDropList(item: GetEventRecordsParams) {
        return this.requestService.post<GetEventRecordsParams, Response<PagedList<IllegalDropEventRecord>>>(this.url.illegalDrop(), item);
    }

    illegalDropSingle(id: string) {
        return this.requestService.get<Response<IllegalDropEventRecord>>(this.url.illegalDropSingle(id));
    }

    mixedIntoList(item: GetEventRecordsParams) {
        return this.requestService.post<GetEventRecordsParams, Response<PagedList<MixedIntoEventRecord>>>(this.url.mixedIntoList(), item);
    }

    mixedIntoSingle(id: string) {
        return this.requestService.get<Response<MixedIntoEventRecord>>(this.url.mixedIntoSingle(id));
    }
    garbageFullList(item: GetEventRecordsParams) {
        return this.requestService.post<GetEventRecordsParams, Response<PagedList<GarbageFullEventRecord>>>(this.url.garbageFullList(), item);
    }
    garbageFullSingle(id: string) {
         return this.requestService.get<Response<GarbageFullEventRecord>>(this.url.mixedIntoSingle(id));
    }



}




