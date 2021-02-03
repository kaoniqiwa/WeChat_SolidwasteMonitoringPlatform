import { PagedList } from "../../../data-core/model/page";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageFullEventRecord } from "../../../data-core/model/waste-regulation/garbage-full-event-record";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceRole } from "../../../data-core/model/we-chat";

export interface OneDay {
    begin: Date;
    end: Date;
}

export interface Paged {
    index: number;
    size: number;
}


export interface StatisticNumber {
    id: string;
    name: string,
    illegalDropNumber: number;
    mixedIntoNumber: number;
    garbageFullNumber: number;
}

export interface IDataController {
    roles: ResourceRole[]
    getEventCount: (day: OneDay) => Promise<StatisticNumber>;
    getStatisticNumberList: (day: OneDay) => Promise<Array<StatisticNumber>>;
    getHistory: (day: OneDay) => Promise<Array<EventNumber>>;

}
export interface IGarbageStationController {
    getGarbageStationList(): Promise<Array<GarbageStation>>;
    getResourceRoleList: () => Promise<Array<ResourceRole>>;
    getDivision: (divisionId: string) => Promise<Division>;
    getCameraList: (garbageStationId: string, loadImage: (cameraId: string, url?: string) => void) => Promise<Array<Camera>>;
    getGarbageStationStatisticNumberListInToday: (sources: ResourceRole[]) => Promise<Array<StatisticNumber>>;
    getImageUrl: (id: string) => string | undefined;
}

export interface IEventHistory {
    getResourceRoleList: () => Promise<Array<ResourceRole>>;
    getEventList: (day: OneDay, page: Paged, type: EventType, ids?: string[]) => Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord> | undefined>;
}