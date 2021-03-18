import { PagedList, TimeUnit } from "../../../data-core/model/page";
import { Response } from "../../../data-core/model/response";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { EventData, EventRecordData, GetEventRecordsParams } from "../../../data-core/model/waste-regulation/event-record";
import { CameraImageUrl, GarbageFullEventRecord } from "../../../data-core/model/waste-regulation/garbage-full-event-record";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic, GarbageStationNumberStatisticV2, GetGarbageStationStatisticNumbersParams } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { IllegalDropEventData, IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceRole } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { IDataController, IDetailsEvent, IEventHistory, IGarbageStationController, IGarbageStationNumberStatistic, OneDay, Paged, StatisticNumber } from "./IController";

export class DataController implements IDataController, IGarbageStationController, IEventHistory, IDetailsEvent, IGarbageStationNumberStatistic {

    static readonly defaultImageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKIAQAAAAAgULygAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAd2KE6QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQflAgIBCxpFwPH8AAAAcklEQVR42u3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+A28XAAEDwmj2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTAyVDAxOjExOjI2KzAwOjAwOo9+nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0wMlQwMToxMToyNiswMDowMEvSxiAAAAAASUVORK5CYII=";


    constructor(protected service: Service, roles: ResourceRole[]) {
        this.roles = roles;
    }



    isToday(date: Date) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dataDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return dataDate.getTime() - today.getTime() >= 0;
    }


    roles: ResourceRole[];

    getGarbageStationList!: () => Promise<GarbageStation[]>;
    getResourceRoleList!: () => Promise<ResourceRole[]>;
    getEventCount = async (day: OneDay) => {
        let result: StatisticNumber = {
            id: "",
            name: "",
            illegalDropNumber: 0,
            mixedIntoNumber: 0,
            garbageFullNumber: 0
        }
        let list = await this.getStatisticNumberList(day);
        list.forEach(x => {
            result.illegalDropNumber += x.illegalDropNumber;
            result.mixedIntoNumber += x.mixedIntoNumber;
            result.garbageFullNumber += x.garbageFullNumber;
        });
        return result;
    };
    getGarbageStationStatisticNumberListInToday!: (sources: ResourceRole[]) => Promise<Array<StatisticNumber>>
    getStatisticNumberList!: (day: OneDay) => Promise<StatisticNumber[]>;
    getHistory!: (day: OneDay) => Promise<EventNumber[]>;


    getDivision = async (divisionId: string) => {
        let promise = await this.service.division.get(divisionId);
        return promise;
    }
    getCameraList = async (garbageStationId: string, loadImage: (cameraId: string, url?: string) => void) => {
        let promise = await this.service.camera.list(garbageStationId);
        return promise.sort((a, b) => {
            return a.CameraUsage - b.CameraUsage || a.Name.localeCompare(b.Name);
        }).map(x => {
            if (x.ImageUrl) {
                (function (x, service) {
                    setTimeout(() => {
                        let url = service.medium.getData(x.ImageUrl!)
                        loadImage(x.Id, url);
                    }, 0);

                })(x, this.service)

            }
            else {
                setTimeout(() => {
                    loadImage(DataController.defaultImageUrl);
                }, 0);
            }
            return x;
        });
    }
    getImageUrl = (id: string) => {
        return this.service.medium.getData(id);
    }
    getGarbageStationEventCount = async (garbageStationIds: string[]) => {
        const promise = await this.service.garbageStation.statisticNumberList({ Ids: garbageStationIds });
        return promise.Data.map(x => {
            let result: StatisticNumber = {
                id: x.Id,
                name: x.Name,
                illegalDropNumber: 0,
                mixedIntoNumber: 0,
                garbageFullNumber: 0
            };
            if (x.TodayEventNumbers) {
                let illegalDropNumber = x.TodayEventNumbers.find(y => y.EventType == EventType.IllegalDrop);
                if (illegalDropNumber)
                    result.illegalDropNumber = illegalDropNumber.DayNumber;
                let mixedIntoNumber = x.TodayEventNumbers.find(y => y.EventType == EventType.MixedInto);
                if (mixedIntoNumber) {
                    result.mixedIntoNumber = mixedIntoNumber.DayNumber;
                }
                let garbageFullNumber = x.TodayEventNumbers.find(y => y.EventType == EventType.GarbageFull);
                if (garbageFullNumber) {
                    result.garbageFullNumber = garbageFullNumber.DayNumber;
                }
            }
            return result;
        });
    }

    getEventListParams(day: OneDay, page: Paged, type: EventType, ids?: string[]) {
        const params = new GetEventRecordsParams();
        params.BeginTime = day.begin.toISOString();
        params.EndTime = day.end.toISOString();
        params.PageSize = page.size;
        params.PageIndex = page.index;
        params.Desc = true;

        params.ResourceIds = this.roles.map(x => x.Id);

        if (ids) {
            params.ResourceIds = ids;
        }
        return params;
    }

    getEventList = async (day: OneDay, page: Paged, type: EventType, ids?: string[]) => {

        let params = this.getEventListParams(day, page, type, ids);

        let promise: PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord>

        switch (type) {
            case EventType.IllegalDrop:
                promise = await this.service.event.illegalDropList(params);
                break;
            case EventType.MixedInto:
                promise = await this.service.event.mixedIntoList(params);
                break;
            case EventType.GarbageFull:
                debugger;
                promise = await this.service.event.garbageFullList(params);
                let records = new Array<GarbageFullEventRecord>();
                promise.Data.forEach(record => {
                    if (record instanceof GarbageFullEventRecord) {
                        if (record.Data.CameraImageUrls) {
                            record.Data.CameraImageUrls = record.Data.CameraImageUrls.sort((a, b) => {
                                if (a.CameraName && b.CameraName)
                                    return a.CameraName.length - b.CameraName.length || a.CameraName.localeCompare(b.CameraName);
                                return 0;
                            });
                        }
                        records.push(record);
                    }
                })
                promise.Data = records;
                break;
            default:
                return undefined;
        }

        // promise.Data.forEach(x => {
        //     if (x.ImageUrl) {
        //         x.ImageUrl = this.service.medium.getData(x.ImageUrl) as string;
        //     }
        // });
        return promise;

    }

    async GetEventRecordById(type: EventType, eventId: string) {
        let response: IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord;
        switch (type) {
            case EventType.IllegalDrop:
                response = await this.service.event.illegalDropSingle(eventId);
                break;
            case EventType.GarbageFull:
                debugger;
                response = await this.service.event.garbageFullSingle(eventId);
                let record = (response as GarbageFullEventRecord);
                if (record.Data.CameraImageUrls) {
                    (response as GarbageFullEventRecord).Data.CameraImageUrls = record.Data.CameraImageUrls.sort((a, b) => {
                        if (a.CameraName && b.CameraName)
                            return a.CameraName.length - b.CameraName.length || a.CameraName.localeCompare(b.CameraName);
                        return 0;
                    });
                }
                break;
            case EventType.MixedInto:
                response = await this.service.event.mixedIntoSingle(eventId);
                break;
            default:
                return undefined;
        }
        return response;
    }


    GetEventRecord(type: EventType, eventId: string): Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>;
    GetEventRecord(type: EventType, index: number, day?: OneDay): Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>;
    async GetEventRecord(type: EventType, index: string | number, day?: OneDay) {
        if (typeof index === "string") {
            return await this.GetEventRecordById(type, index);
        }
        else if (typeof index === "number") {
            if (!day) {
                throw new Error("please choose one day");
            }
            let paged: Paged = { index: index, size: 1 };
            let result = await this.getEventList(day, paged, type);
            if (result) {
                return result.Data[0];
            }
        }
        else {
            throw new Error("can not read index or eventId");
        }
    }


    GetCamera(garbageStationId: string, cameraId: string): Promise<Camera> {
        return this.service.camera.get(garbageStationId, cameraId)
    }



    /**
     * 获取垃圾厢房数据统计
     *
     * @param {string[]} ids 垃圾厢房ID
     * @returns {Promise<GarbageStationNumberStatistic[]>}
     * @memberof DataController
     */
    async getGarbageStationNumberStatisticList(ids: string[]): Promise<GarbageStationNumberStatistic[]> {
        let params = new GetGarbageStationStatisticNumbersParams();
        params.Ids = ids;
        let response = await this.service.garbageStation.statisticNumberList(params);
        return response.Data;
    }

    /**
     * 获取垃圾厢房数据统计
     *
     * @param {string} id 垃圾厢房ID
     * @param {OneDay} day 日期
     * @returns {Promise<GarbageStationNumberStatisticV2[]>}
     * @memberof DataController
     */
    async getGarbageStationNumberStatistic(id: string, day: OneDay): Promise<GarbageStationNumberStatisticV2[]> {

         let response = this.service.garbageStation.statisticNumberHistoryList({
             BeginTime:day.begin.toJSON(),
             EndTime:day.end.toJSON(),
             GarbageStationIds:[id],
             TimeUnit:TimeUnit.Day
         })
         return response;
    }



}