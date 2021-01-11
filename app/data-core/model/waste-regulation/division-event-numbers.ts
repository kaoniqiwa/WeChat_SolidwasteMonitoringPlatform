import { IIntervalParams, IntervalParams, IPageParams, ITimeUnitParams, PageTimeUnitParams, TimeUnitParams } from "../page";
import { EventNumber } from "./event-number";

/**事件数量统计 */
export interface EventNumberStatistic {
    /**事件数量 */
    EventNumbers: EventNumber[];
    /**开始时间 */
    BeginTime: Date | string;
    /**结束时间 */
    EndTime: Date | string;

}

