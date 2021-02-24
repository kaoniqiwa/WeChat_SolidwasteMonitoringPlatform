import { EventData, EventRecordData } from "./event-record";

/** 垃圾满溢事件 */
export class GarbageFullEventRecord extends EventRecordData<GarbageFullEventData> {

}
/** 垃圾满溢事件 */
export class GarbageFullEventData extends EventData {
    
    /** 第一次满溢时间	M */
    FullTime	!: Date;
    /** 图片ID、图片地址列表	O */
    ImageUrls?: string[];

    /**
     *  图片ID、图片地址列表	O
     *
     * @type {CameraImageUrl[]}
     * @memberof GarbageFullEventData
     */
    CameraImageUrls?:CameraImageUrl[];
}
/**
 * 摄像机照片地址
 *
 * @export
 * @class CameraImageUrl
 */
export class CameraImageUrl {
    /**
     *	摄像机ID	M
     *
     * @type {string}
     * @memberof CameraImageUrl
     */
    CameraId!: string
    /**
     *	摄像机名称	M
     *
     * @type {string}
     * @memberof CameraImageUrl
     */
    CameraName!: string
    /**
     *	照片地址	M
     *
     * @type {string}
     * @memberof CameraImageUrl
     */
    ImageUrl!: string
}