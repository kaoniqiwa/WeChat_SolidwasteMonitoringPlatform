import { EventNumberStatistic } from "./division-event-numbers";

    /**事件数量 */
    export class EventNumber
    {
        /**事件类型 */
        EventType!: EventType;
        /**当日事件数量 */
        DayNumber!: number;
        /**当日时间段内事件数量(可选) */
        DeltaNumber?: number;

        static Plus(a:EventNumber, b:EventNumber){
            let result = new EventNumber();
            result.EventType = a.EventType;
            result.DayNumber = a.DayNumber+b.DayNumber;
            if(a.DeltaNumber !== undefined && b.DeltaNumber !== undefined)
            {
                result.DeltaNumber = a.DeltaNumber + b.DeltaNumber;
            }
            return result;
        }
    }

    export enum EventType {
        /** 乱认垃圾事件 */
        IllegalDrop = 1,
        /** 混合投放事件 */
        MixedInto = 2,
        /** 垃圾容量事件 */
        GarbageVolume = 3,
        /** 垃圾满溢事件 */
        GarbageFull = 4
}

// let EventType = {
        //     '1': '乱扔垃圾事件',
        //     '2': '混合投放事件',
        //     '3': '垃圾容量事件',
        //     '4': '垃圾满溢事件'
        // };