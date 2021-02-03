import { EventData, EventRecordData } from "./event-record";
import { EventDataObject } from "./event-data-object";
/**乱扔垃圾事件记录 */
    export class IllegalDropEventRecord extends EventRecordData<IllegalDropEventData>
    {
    }

    /**乱扔垃圾事件数据 */
    export class IllegalDropEventData extends EventData
    {
        /**垃圾房ID */
        StationId!: string;
        /**垃圾房名称 */
        StationName!: string;
        /**区划ID(可选) */
        DivisionId?: string;
        /**区划名称(可选) */
        DivisionName?: string;
        /**垃圾的目标(可选) */
        Objects?: EventDataObject[];
    }

