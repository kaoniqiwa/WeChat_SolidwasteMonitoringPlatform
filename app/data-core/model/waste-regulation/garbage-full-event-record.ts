import { EventData, EventRecordData } from "./event-record";

/** 垃圾满溢事件 */
export class GarbageFullEventRecord extends EventRecordData<GarbageFullEventData> {
    
}
/** 垃圾满溢事件 */
export class GarbageFullEventData  extends EventData {
    /** 垃圾房ID	M */
    StationId	!: string;
    /** 垃圾房名称	M */
    StationName	!: string;
    /** 区划ID	O */
    DivisionId?: string;
    /** 区划名称	O */
    DivisionName?: string;
    /** 第一次满溢时间	M */
    FullTime	!: Date;
    /** 图片ID、图片地址列表	O */
    ImageUrls?: string[]
}