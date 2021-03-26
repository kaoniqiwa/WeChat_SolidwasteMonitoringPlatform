import { Point } from "../point";
import { CameraImageUrl } from "./event-record";

export class EventDataBasic{

}

export class EventData {
    StationId!: string;
    StationName!: string;
    DivisionId?: string;
    DivisionName?: string;
}

/**归一化坐标点 */
export interface EventDataObject {
    /**目标ID */
    Id: string;
    /**目标所在的归一化多边形 */
    Polygon: Point[];
    /**置信度：0-100 */
    Confidence: number;
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
    CameraImageUrls?: CameraImageUrl[];
}


/**乱扔垃圾事件数据 */
export class IllegalDropEventData extends EventData {
    /**垃圾的目标(可选) */
    Objects?: EventDataObject[];
}


/**///  */
export class MixedIntoEventData extends EventData {
    /**垃圾的目标(可选) */
    Objects?: EventDataObject[];
    /**图片ID、图片地址列表(可选) */
    PersonImageUrls?: string[];

}


export class GarbageDropEventData extends EventData{

    /**
     *	网格单元ID	O
     *
     * @type {string}
     * @memberof GarbageFullEventData
     */
    GridCellId?:string;
    /**
     *	网格单元名称	O
     *
     * @type {string}
     * @memberof GarbageFullEventData
     */
    GridCellName?:string;
    /**
     *	落地时间	M
     *
     * @type {Date}
     * @memberof GarbageFullEventData
     */
    DropTime:Date;
    /**
     *	处置时间	O
     *
     * @type {Date}
     * @memberof GarbageFullEventData
     */
    HandleTime?:Date;
    /**
     *	小包垃圾落地是否已处置	M
     *
     * @type {boolean}
     * @memberof GarbageFullEventData
     */
    IsHandle:boolean;
    /**
     *	是否超时	M
     *
     * @type {boolean}
     * @memberof GarbageFullEventData
     */
    IsTimeout:boolean;
    /**
     *	垃圾落地的图片ID、图片地址列表	O
     *
     * @type {CameraImageUrl[]}
     * @memberof GarbageFullEventData
     */
    DropImageUrls?:CameraImageUrl[]
    /**
     *	垃圾处置的图片ID、图片地址列表	O
     *
     * @type {CameraImageUrl[]}
     * @memberof GarbageFullEventData
     */
    HandleImageUrls?:CameraImageUrl[]
    /**
     *	超时未处置的图片ID、图片地址列表	O
     *
     * @type {CameraImageUrl[]}
     * @memberof GarbageFullEventData
     */
    TimeoutImageUrls?:CameraImageUrl[]
}

