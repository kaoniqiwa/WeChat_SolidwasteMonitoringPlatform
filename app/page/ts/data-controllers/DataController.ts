import { PagedList } from "../../../data-core/model/page";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceRole } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { IDataController, IEventHistory, IGarbageStationController, IllegalDropItem, OneDay, Page, StatisticNumber } from "./IController";

export class DataController implements IDataController, IGarbageStationController , IEventHistory {
    constructor(protected service: Service, roles: ResourceRole[]) {
        this.roles = roles;
    }

    roles: ResourceRole[];

    getGarbageStationList!: () => Promise<GarbageStation[]>;
    getResourceRoleList!: () => Promise<ResourceRole[]>;
    getEventCount!: (day: OneDay) => Promise<StatisticNumber>;
    getIllegalDropList!: (day: OneDay) => Promise<IllegalDropItem[]>;
    getHistory!: (day: OneDay) => Promise<EventNumber[]>;


    getDivision = async (divisionId: string) => {
        let promise = await this.service.division.get(divisionId);
        return promise.data.Data;
    }
    getCameraList = async (garbageStationId: string) => {
        let promise = await this.service.camera.list(garbageStationId);
        return promise.data.Data.sort((a, b) => {
            return a.CameraUsage - b.CameraUsage || a.Name.localeCompare(b.Name);
        }).map(x => {
            if (x.ImageUrl) {
                x.ImageUrl = this.service.medium.getData(x.ImageUrl)!;
            }
            else {
                x.ImageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
            }
            return x;
        });
    }

    getGarbageStationEventCount = async (garbageStationIds: string[]) => {
        const promise = await this.service.garbageStation.statisticNumberList({ Ids: garbageStationIds });
        return promise.Data.Data.map(x => {
            let result = {
                id: x.Id,
                illegalDropNumber: 0,
                hybridPushNumber: 0
            };

            let illegalDropNumber = x.TodayEventNumbers.find(y => y.EventType == EventType.IllegalDrop);
            if (illegalDropNumber)
                result.illegalDropNumber = illegalDropNumber.DayNumber;
            let hybridPushNumber = x.TodayEventNumbers.find(y => y.EventType == EventType.MixedInto);
            if (hybridPushNumber) {
                result.hybridPushNumber = hybridPushNumber.DayNumber;
            }
            return result;
        });
    }

    getEventList = async (day: OneDay, page: Page, type: EventType, ...ids: string[]) => {
        const params = new GetEventRecordsParams();
            params.BeginTime = day.begin;
            params.EndTime = day.end;
            params.PageSize = page.size;
            params.PageIndex = page.index;
            params.Desc = true;
            
            params.ResourceIds = this.roles.map(x=>x.Id);


            let promise = await this.service.event.list(params);
            promise.Data.Data.forEach(x=>{
                x.RecordUrl = this.service.medium.getData(x.ImageUrl) as string;
            });
            return promise.Data;
    }

}