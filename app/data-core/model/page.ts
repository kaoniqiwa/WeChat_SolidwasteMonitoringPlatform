import { Transform } from 'class-transformer'
import { transformDate } from './transformer'

export interface Page {
  PageIndex: number
  PageSize: number
  PageCount: number
  RecordCount: number
  TotalRecordCount: number
}

export interface PagedList<T> {
  Page: Page
  Data: T[]
}

export interface IPagedParams {
  PageIndex?: number
  PageSize?: number
}

/**统计时间单位:1-Hour，2-Day */
export enum TimeUnit {
  Hour = 1,
  Day = 2,
  Week = 3,
  Month = 4,
}
export class StatisticTime {
  /**
   *	年	O
   *
   * @type {number}
   * @memberof StatisticTime
   */
  Year?: number
  /**
   *
   *
   * @type {number}
   * @memberof StatisticTime
   */
  Month?: number
  /**
   *	日	O
   *
   * @type {number}
   * @memberof StatisticTime
   */
  Day?: number
  /**
   *	第几周	O
   *
   * @type {number}
   * @memberof StatisticTime
   */
  Week?: number
}
export interface IIntervalParams {
  BeginTime: Date
  EndTime: Date
}
export class IntervalParams implements IIntervalParams {
  /**开始时间 */
  @Transform(transformDate)
  BeginTime!: Date

  /**结束时间 */
  @Transform(transformDate)
  EndTime!: Date
}
export class PagedParams implements IPagedParams {
  /**页码[1-n](可选) */
  PageIndex?: number
  /**分页大小[1-100](可选) */
  PageSize?: number
}
export class PagedIntervalParams
  extends IntervalParams
  implements IPagedParams
{
  /**页码[1-n](可选) */
  PageIndex?: number
  /**分页大小[1-100](可选) */
  PageSize?: number
}
export interface ITimeUnitParams extends IIntervalParams {
  /**统计时间单位:1-Hour，2-Day */
  TimeUnit: TimeUnit
}
export class TimeUnitParams extends IntervalParams implements ITimeUnitParams {
  /**统计时间单位:1-Hour，2-Day */
  TimeUnit: TimeUnit = TimeUnit.Day
}
export class PageTimeUnitParams extends TimeUnitParams implements IPagedParams {
  /**页码[1-n](可选) */
  PageIndex?: number
  /**分页大小[1-100](可选) */
  PageSize?: number
}
