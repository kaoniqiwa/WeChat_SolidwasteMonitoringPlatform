import { EventData, EventRecordData } from "./event-record";
import { EventDataObject } from "./event-data-object";
/**混合投放事件记录 */
    export class MixedIntoEventRecord extends EventRecordData<MixedIntoEventData>
    {
    }
    /**///  */
    export class MixedIntoEventData extends EventData
    {
        /**垃圾的目标(可选) */
        Objects?: EventDataObject[];
        /**图片ID、图片地址列表(可选) */
        PersonImageUrls?: string[];

    }