    /**事件数量 */
    export interface EventNumber
    {
        /**事件类型 */
        EventType: EventType;
        /**当日事件数量 */
        DayNumber: number;
        /**当日时间段内事件数量(可选) */
        DeltaNumber: number | null;
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