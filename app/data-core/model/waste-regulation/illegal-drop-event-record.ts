import { EventRecord } from "./event-record";
import { EventDataObject } from "./event-data-object";
/**乱扔垃圾事件记录 */
    export interface IllegalDropEventRecord extends EventRecord
    {
        /**事件数据 */
        Data: IllegalDropEventData;
    }

    /**乱扔垃圾事件数据 */
    export interface IllegalDropEventData
    {
        /**垃圾房ID */
        StationId: string;
        /**垃圾房名称 */
        StationName: string;
        /**区划ID(可选) */
        DivisionId: string;
        /**区划名称(可选) */
        DivisionName: string;
        /**垃圾的目标(可选) */
        Objects: EventDataObject[];
    }

     /**获取事件记录参数 */
    export class GetEventRecordsParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;
        /**所属区划ID列表(可选) */
        DivisionIds: string[];
        /**垃圾房ID列表(可选) */
        StationIds: string[];
        /**资源ID列表(可选) */
        ResourceIds: string[];
        /**区划名称(可选)，支持LIKE */
        DivisionName: string;
        /**垃圾房名称(可选)，支持LIKE */
        StationName: string;
        /**资源名称(可选)，支持LIKE */
        ResourceName: string;

    }
