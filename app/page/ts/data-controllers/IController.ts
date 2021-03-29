import { PagedList } from "../../../data-core/model/page";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageDropEventRecord, GarbageFullEventRecord, IllegalDropEventRecord, MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/event-record";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationGarbageCountStatistic, GarbageStationNumberStatistic, GarbageStationNumberStatisticV2 } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";

import { ResourceRole } from "../../../data-core/model/we-chat";

/**
 * 一天
 *
 * @export
 * @interface OneDay
 */
export interface OneDay {
    /**
     * 开始时间
     *
     * @type {Date}
     * @memberof OneDay
     */
    begin: Date;
    /**
     * 结束时间
     *
     * @type {Date}
     * @memberof OneDay
     */
    end: Date;
}

/**
 * 分页
 *
 * @export
 * @interface Paged
 */
export interface Paged {
    /**
     * 第几页
     *
     * @type {number}
     * @memberof Paged
     */
    index: number;
    /**
     * 单页面数量
     *
     * @type {number}
     * @memberof Paged
     */
    size: number;
    count?: number;
}


/**
 * 数据统计
 *
 * @export
 * @interface StatisticNumber
 */
export interface StatisticNumber {
    /**
     * 资源点ID
     *
     * @type {string}
     * @memberof StatisticNumber
     */
    id: string;
    /**
     * 资源点名称
     *
     * @type {string}
     * @memberof StatisticNumber
     */
    name: string,
    /**
     * 乱扔垃圾数量
     *
     * @type {number}
     * @memberof StatisticNumber
     */
    illegalDropNumber: number;
    /**
     * 混合投放数量
     *
     * @type {number}
     * @memberof StatisticNumber
     */
    mixedIntoNumber: number;
    /**
     * 垃圾满意数量
     *
     * @type {number}
     * @memberof StatisticNumber
     */
    garbageFullNumber: number;
}

export interface IDataController {
    roles: ResourceRole[]
    /**
     * 获取事件统计
     *
     * @param {OneDay} day
     * @returns {Promise<StatisticNumber>}
     * @memberof IDataController
     */
    getEventCount(day: OneDay): Promise<StatisticNumber>;

    /**
     * 获取统计数据详细列表
     *
     * @param {OneDay} day
     * @returns {Promise<Array<StatisticNumber>>}
     * @memberof IDataController
     */
    getStatisticNumberList(day: OneDay): Promise<Array<StatisticNumber>>;
    /**
     * 获取历史记录
     *
     * @param {OneDay} day
     * @returns {Promise<Array<EventNumber>>}
     * @memberof IDataController
     */
    getHistory(day: OneDay): Promise<Array<EventNumber> | {
        'IllegalDrop': Array<EventNumber>,
        'MixedInto': Array<EventNumber>,        
    }>;
/**
     * 获取垃圾厢房列表
     *
     * @returns {Promise<Array<GarbageStation>>}
     * @memberof IGarbageStationController
     */
 getGarbageStationList(): Promise<Array<GarbageStation>>;

 /**
  * 获取垃圾厢房数据统计
  *
  * @param {string[]} ids 垃圾厢房ID
  * @returns {Promise<Array<GarbageStationNumberStatistic>>}
  * @memberof IGarbageStationNumberStatistic
  */
 getGarbageStationNumberStatisticList(ids: string[]): Promise<Array<GarbageStationNumberStatistic>>

 /**
  * 获取垃圾厢房数据统计
  *
  * @param {string} id 垃圾厢房ID
  * @param {Date} date 日期
  * @returns {Promise<Array<GarbageStationGarbageCountStatistic>>} 
  * @memberof IGarbageStationNumberStatistic
  */
  getGarbageStationNumberStatistic(id: string, date: Date): Promise<Array<GarbageStationGarbageCountStatistic>>
}
export interface IGarbageStationController {
    /**
     * 获取垃圾厢房列表
     *
     * @returns {Promise<Array<GarbageStation>>}
     * @memberof IGarbageStationController
     */
    getGarbageStationList(): Promise<Array<GarbageStation>>;

    /**
     * 获取区划列表
     *
     * @returns {Promise<Array<ResourceRole>>}
     * @memberof IGarbageStationController
     */
    getResourceRoleList(): Promise<Array<ResourceRole>>;

    /**
     * 获取区划
     *
     * @param {string} divisionId 区划ID
     * @returns {Promise<Division>}
     * @memberof IGarbageStationController
     */
    getDivision(divisionId: string): Promise<Division>;
    /**
     * 获取摄像机列表
     *
     * @param {string} garbageStationId 垃圾厢房ID
     * @param {(cameraId: string, url?: string) => void} loadImage 加载图片，备注：为了加快数据读取，把加载图片事件放到页面
     * @returns {Promise<Array<Camera>>}
     * @memberof IGarbageStationController
     */
    getCameraList(garbageStationId: string, loadImage: (cameraId: string, url?: string) => void): Promise<Array<Camera>>;
    /**
     * 获取垃圾厢房当天的统计数据
     *
     * @param {ResourceRole[]} sources 垃圾厢房信息
     * @returns {Promise<Array<StatisticNumber>>}
     * @memberof IGarbageStationController
     */
    getGarbageStationStatisticNumberListInToday(sources: ResourceRole[]): Promise<Array<StatisticNumber>>;
    /**
     * 获取图片URL
     *
     * @param {string} id 图片ID
     * @returns {(string | undefined)}
     * @memberof IGarbageStationController
     */
    getImageUrl(id: string): string | undefined;
}

export interface IEventHistory {
    /**
     * 获取资源列表
     *
     * @returns {Promise<Array<ResourceRole>>}
     * @memberof IEventHistory
     */
    getResourceRoleList(): Promise<Array<ResourceRole>>;
    /**
     * 获取事件列表
     *
     * @param {OneDay} day 哪一天
     * @param {Paged} page 分页
     * @param {EventType} type 事件类型
     * @param {string[]} [ids] 
     * @returns {(Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord> | undefined>)}
     * @memberof IEventHistory
     */
    getEventList(day: OneDay, page: Paged, type: EventType, ids?: string[]): Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord|GarbageDropEventRecord> | undefined>;
    /**
     * 获取图片URL
     *
     * @param {string} id 图片ID
     * @returns {(string | undefined)}
     * @memberof IGarbageStationController
     */
    getImageUrl(id: string): string | undefined;
}
export interface IDetailsEvent {


    /**
     * 获取事件记录
     *
     * @param {EventType} type 事件类型
     * @param {string} eventId 事件ID
     * @returns {(Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>)}
     * @memberof IDetailsEvent
     */
    GetEventRecord(type: EventType, eventId: string): Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>;

    /**
     * 获取事件记录
     *
     * @param {EventType} type 事件类型
     * @param {number} index 索引
     * @returns {(Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>)}
     * @memberof IDetailsEvent
     */
    GetEventRecord(type: EventType, index: number, day: OneDay): Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>;
    /**
         * 获取图片URL
         *
         * @param {string} id 图片ID
         * @returns {(string | undefined)}
         * @memberof IGarbageStationController
         */
    getImageUrl(id: string): string | undefined;

    /**
     * 获取摄像机信息
     *
     * @param {string} garbageStationId
     * @param {string} cameraId
     * @returns {Promise<Camera>}
     * @memberof IDetailsEvent
     */
    GetCamera(garbageStationId: string, cameraId: string): Promise<Camera>;
}

export interface IGarbageStationNumberStatistic {
    /**
     * 获取垃圾厢房列表
     *
     * @returns {Promise<Array<GarbageStation>>}
     * @memberof IGarbageStationController
     */
    getGarbageStationList(): Promise<Array<GarbageStation>>;

    /**
     * 获取垃圾厢房数据统计
     *
     * @param {string[]} ids 垃圾厢房ID
     * @returns {Promise<Array<GarbageStationNumberStatistic>>}
     * @memberof IGarbageStationNumberStatistic
     */
    getGarbageStationNumberStatisticList(ids: string[]): Promise<Array<GarbageStationNumberStatistic>>

    /**
     * 获取垃圾厢房数据统计
     *
     * @param {string} id 垃圾厢房ID
     * @param {Date} date 日期
     * @returns {Promise<Array<GarbageStationGarbageCountStatistic>>} 
     * @memberof IGarbageStationNumberStatistic
     */
     getGarbageStationNumberStatistic(id: string, date: Date): Promise<Array<GarbageStationGarbageCountStatistic>>
}

export interface IGarbageDrop{
/**
     * 获取资源列表
     *
     * @returns {Promise<Array<ResourceRole>>}
     * @memberof IGarbageDrop
     */
 getResourceRoleList(): Promise<Array<ResourceRole>>;
 /**
  * 获取事件列表
  *
  * @param {OneDay} day 哪一天
  * @param {Paged} page 分页
  * @param {EventType} type 事件类型
  * @param {string[]} [ids] 
  * @returns {(Promise<PagedList<GarbageDropEventRecord> | undefined>)}
  * @memberof IGarbageDrop
  */
 getGarbageDropEventList(day: OneDay, page: Paged, type: EventType, ids?: string[]): Promise<PagedList<GarbageDropEventRecord> | undefined>;
 /**
  * 获取图片URL
  *
  * @param {string} id 图片ID
  * @returns {(string | undefined)}
  * @memberof IGarbageDrop
  */
 getImageUrl(id: string): string | undefined;
}