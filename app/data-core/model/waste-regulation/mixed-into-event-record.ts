import { EventRecord } from "./event-record";
import { EventDataObject } from "./event-data-object";
/**混合投放事件记录 */
    export interface MixedIntoEventRecord extends EventRecord
    {
        /**事件数据 */
        Data: MixedIntoEventData;
    }
    /**///  */
    export interface MixedIntoEventData
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
        /**图片ID、图片地址列表(可选) */
        PersonImageUrls: string[];

    }