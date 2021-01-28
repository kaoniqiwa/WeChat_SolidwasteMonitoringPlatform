import { PagedList } from "../../../data-core/model/page";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceRole } from "../../../data-core/model/we-chat";

export interface OneDay {
    begin: Date;
    end: Date;
}

export interface Page{
    index:number;
    size:number;
}

export interface IllegalDropItem {
    id: string;
    name: string;
    count: number;
}

export interface StatisticNumber {
    id:string;
    illegalDropNumber: number;
    hybridPushNumber: number;
}

export interface IDataController {
    roles: ResourceRole[]
    getEventCount: (day: OneDay) => Promise<StatisticNumber>;
    getIllegalDropList: (day: OneDay) => Promise<Array<IllegalDropItem>>;
    getHistory: (day: OneDay) => Promise<Array<EventNumber>>;

}
export interface IGarbageStationController {
    getGarbageStationList(): Promise<Array<GarbageStation>>;
    getResourceRoleList: () => Promise<Array<ResourceRole>>;
    getDivision: (divisionId: string) => Promise<Division>;
    getCameraList: (garbageStationId: string) => Promise<Array<Camera>>;
    getGarbageStationEventCount: (garbageStationIds: string[]) => Promise<Array<StatisticNumber>>
}

export interface IEventHistory {
    getResourceRoleList: () => Promise<Array<ResourceRole>>;
    getEventList:(day:OneDay, page:Page, type:EventType, ...ids:string[])=>Promise<PagedList<IllegalDropEventRecord|MixedIntoEventRecord>>;    
}