export interface Page {
    PageIndex: number;
    PageSize: number;
    PageCount: number;
    RecordCount: number;
    TotalRecordCount: number;
}

export interface PagedList<T> {
    Page: Page;
    Data: T[];
}


export interface IPageParams {
    PageIndex?: number,
    PageSize?: number
}


/**统计时间单位:1-Hour，2-Day */
export enum TimeUnit {
    Hour = 1,
    Day = 2,
    Week = 3,
    Month = 4
}
export class StatisticTime {
    /**
     *	年	O
     *
     * @type {number}
     * @memberof StatisticTime
     */
    Year?: number;
    /**
     *
     *
     * @type {number}
     * @memberof StatisticTime
     */
    Month?: number;
    /**
     *	日	O
     *
     * @type {number}
     * @memberof StatisticTime
     */
    Day?: number;
    /**
     *	第几周	O
     *
     * @type {number}
     * @memberof StatisticTime
     */
    Week?: number;
}
export interface IIntervalParams {
    BeginTime: Date | string;
    EndTime: Date | string;
}
export class IntervalParams implements IIntervalParams {

    /**开始时间 */
    BeginTime!: Date | string;
    /**结束时间 */
    EndTime!: Date | string;
}
export interface ITimeUnitParams extends IIntervalParams {
    /**统计时间单位:1-Hour，2-Day */
    TimeUnit: TimeUnit;
}
export class TimeUnitParams extends IntervalParams implements ITimeUnitParams {
    /**统计时间单位:1-Hour，2-Day */
    TimeUnit: TimeUnit = TimeUnit.Day;
}
export class PageTimeUnitParams extends TimeUnitParams implements IPageParams {
    /**页码[1-n](可选) */
    PageIndex?: number;
    /**分页大小[1-100](可选) */
    PageSize?: number;
}
