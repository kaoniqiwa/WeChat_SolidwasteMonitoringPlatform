import { EventData, EventRecordData } from "./event-record";
import { EventDataObject } from "./event-data-object";
/**乱扔垃圾事件记录 */
    export class IllegalDropEventRecord extends EventRecordData<IllegalDropEventData>
    {
    }

    /**乱扔垃圾事件数据 */
    export class IllegalDropEventData extends EventData
    {
        /**垃圾的目标(可选) */
        Objects?: EventDataObject[];
    }

