    /**事件数量 */
    export interface EventNumber
    {
        /**事件类型 */
        EventType: number;
        /**当日事件数量 */
        DayNumber: number;
        /**当日时间段内事件数量(可选) */
        DeltaNumber: number | null;
    }