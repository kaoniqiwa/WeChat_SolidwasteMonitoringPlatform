 
import { PagedList } from "../model/page";
import { Response } from "../model/response";   
import * as url from "../url/waste-regulation/event";
import { GetEventRecordsParams } from "../model/waste-regulation/illegal-drop-event-record";
import { IllegalDropEventRecord } from "../model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttp } from "./howell-auth-http";
 
export class EventRequestService{
    url: url.EventRecord;
    constructor(private requestService: HowellAuthHttp) {      
        this.url = new url.EventRecord();
    }    
 
    list(item:GetEventRecordsParams){
        return this.requestService.post<GetEventRecordsParams, Response<PagedList<IllegalDropEventRecord>>>(this.url.illegalDrop(), item);
    }
}