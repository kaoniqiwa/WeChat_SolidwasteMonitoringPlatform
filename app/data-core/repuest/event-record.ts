
import { PagedList } from "../model/page";
import { Response } from "../model/response";
import * as url from "../url/waste-regulation/event";
import { HowellAuthHttp } from "./howell-auth-http";
import { GarbageDropEventRecord, GarbageFullEventRecord, IllegalDropEventRecord, MixedIntoEventRecord } from "../model/waste-regulation/event-record";
import { plainToClass } from "class-transformer";
import { GetEventRecordsParams, GetGarbageDropEventRecordsParams } from "../model/waste-regulation/event-record-params";

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

        let response = await this.requestService.get<Response<GarbageFullEventRecord>>(this.url.garbageFullSingle(id));

        return plainToClass(GarbageFullEventRecord, response.Data);
    }

    async garbageDropList(item: GetGarbageDropEventRecordsParams) {
        let response = await this.requestService.post<GetGarbageDropEventRecordsParams, Response<PagedList<GarbageDropEventRecord>>>(this.url.garbageDropList(), item);
        response.Data.Data = plainToClass(GarbageDropEventRecord, response.Data.Data);
        return response.Data;
    }
    async garbageDropSingle(id: string) {
        let response = await this.requestService.get<Response<GarbageDropEventRecord>>(this.url.garbageDropSingle(id));

        return plainToClass(GarbageDropEventRecord, response.Data);
    }


}




