
import { EventType } from "./event-number";

export enum EventResourceType {
    /** 监控点 */
    Camera = "Camera",
    /** 编码设备 */
    EncodeDevice = "EncodeDevice",
    /** 物联网传感器 */
    IoTSensor = "IoTSensor"
}


/**事件记录 */
export class EventRecord {
    EventId?: string;
    /**事件ID */
    Id!: string;
    /**事件时间 */
    EventTime!: Date | string;
    /**事件类型 */
    EventType!: EventType;
    /**事件描述信息(可选) */
    EventDescription?: string;
    /**资源ID(可选) */
    ResourceId?: string;
    /**
     * 资源类型(可选)：
     * Camera：监控点
     * EncodeDevice：编码设备
     * IoTSensor：物联网传感器
     */
    ResourceType?: EventResourceType;
    /**资源名称(可选) */
    ResourceName?: string;
    /**图片ID、图片地址(可选) */
    ImageUrl?: string;
    /**录像文件ID、录像地址(可选) */
    RecordUrl?: string;
    /**事件关键字(可选) */
    EventIndexes?: string[];


}

export class EventRecordData<T extends EventData> extends EventRecord
{
    Data!: T
}

export class EventData {
    StationId!:string;
    StationName!:string;
    DivisionId?:string;
    DivisionName?:string;
}


/**获取事件记录参数 */
export class GetEventRecordsParams {
    /**页码[1-n](可选) */
    PageIndex?: number | null;
    /**分页大小[1-100](可选) */
    PageSize?: number | null;
    /**开始时间 */
    BeginTime!: Date | string;
    /**结束时间 */
    EndTime!: Date | string;
    /**所属区划ID列表(可选) */
    DivisionIds?: string[];
    /**垃圾房ID列表(可选) */
    StationIds?: string[];
    /**资源ID列表(可选) */
    ResourceIds?: string[];
    /**区划名称(可选)，支持LIKE */
    DivisionName?: string;
    /**垃圾房名称(可选)，支持LIKE */
    StationName?: string;
    /**资源名称(可选)，支持LIKE */
    ResourceName?: string;
    /** 是否倒序时间排列 */
    Desc?: boolean;
}