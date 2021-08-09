import { IIntervalParams, IPagedParams, StatisticTime, TimeUnit } from '../page'
import { EventNumber } from './event-number'
/**垃圾房数量统计 */
export class GarbageStationNumberStatistic {
  /**
   *	垃圾房ID	M
   *
   * @type {string}
   * @memberof GarbageStationNumberStatistic
   */
  Id!: string
  /**
   *	垃圾房名称	M
   *
   * @type {string}
   * @memberof GarbageStationNumberStatistic
   */
  Name!: string
  /**
   *	摄像机数量	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  CameraNumber!: number
  /**
   *	离线摄像机数量	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  OfflineCameraNumber!: number
  /**
   *	垃圾桶数量	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  TrashCanNumber!: number
  /**
   *	干垃圾满溢垃圾桶数量	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  DryTrashCanNumber!: number
  /**
   *	湿垃圾满溢垃圾桶数量	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  WetTrashCanNumber!: number
  /**
   *	干垃圾满溢	O
   *
   * @type {boolean}
   * @memberof GarbageStationNumberStatistic
   */
  DryFull?: boolean
  /**
   *	湿垃圾满溢	O
   *
   * @type {boolean}
   * @memberof GarbageStationNumberStatistic
   */
  WetFull?: boolean
  /**
   *	当日事件数量	O
   *
   * @type {EventNumber[]}
   * @memberof GarbageStationNumberStatistic
   */
  TodayEventNumbers?: EventNumber[]
  /**
   *	当天总数量，单位：L	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  DayVolume!: number
  /**
   *	当天干垃圾容量，单位：L	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  DayDryVolume!: number
  /**
   *	当天湿垃圾容量，单位：L	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  DayWetVolume!: number
  /**
   *	垃圾房状态	M
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  StationState!: number
  /**
   *	评级	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  Garde?: number
  /**
   *	满溢时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  FullDuration?: number
  /**
   *	当前垃圾堆数量	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  GarbageCount?: number
  /**
   *	当前垃圾堆滞留时间	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  CurrentGarbageTime?: number
  /**
   *	当日垃圾滞留比值      有垃圾时长/没有垃圾的时长	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  GarbageRatio?: number
  /**
   *	当日垃圾堆平均滞留时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  AvgGarbageTime?: number
  /**
   *	当日垃圾堆最大滞留时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  MaxGarbageTime?: number
  /**
   *	当日最大滞留堆数量	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  MaxGarbageCount?: number
  /**
   *	有垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  GarbageDuration?: number
  /**
   *	无垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatistic
   */
  CleanDuration?: number
  GarbageDropStationNumber?: number
}

/**获取垃圾房数量参数 */
export class GetGarbageStationStatisticNumbersParams implements IPagedParams {
  /**页码[1-n](可选) */
  PageIndex?: number
  /**分页大小[1-100](可选) */
  PageSize?: number
  /**区划ID(可选) */
  Ids?: string[]
  /**区划名称(可选)，支持LIKE */
  Name?: string
}

export interface GetGarbageStationStatisticNumbersParamsV2
  extends IIntervalParams {
  /**
   * 垃圾房ID列表	M
   *
   * @type {string[]}
   * @memberof GetGarbageStationStatisticNumbersParamsV2
   */
  GarbageStationIds: string[]

  /**
   * 统计时间单位：2 - Day, 3 - Week, 4 - Month	M
   *
   * @type {TimeUnit}
   * @memberof GetGarbageStationStatisticNumbersParamsV2
   */
  TimeUnit: TimeUnit

  /**
   * 升序排列的属性名称	O
   *
   * @type {string[]}
   * @memberof GetGarbageStationStatisticNumbersParamsV2
   */
  Asc?: string[]

  /**
   * 降序排列的属性名称	O
   *
   * @type {string[]}
   * @memberof GetGarbageStationStatisticNumbersParamsV2
   */
  Desc?: string[]
}

export class GarbageStationNumberStatisticV2 {
  /**
   *	垃圾房ID	M
   *
   * @type {string}
   * @memberof GarbageStationNumberStatisticV2
   */
  Id!: string
  /**
   *	垃圾房名称	M
   *
   * @type {string}
   * @memberof GarbageStationNumberStatisticV2
   */
  Name!: string
  /**
   *	统计时间对象	M
   *
   * @type {StatisticTime}
   * @memberof GarbageStationNumberStatisticV2
   */
  Time!: StatisticTime
  /**
   *	当日事件数量	O
   *
   * @type {EventNumber[]}
   * @memberof GarbageStationNumberStatisticV2
   */
  EventNumbers?: EventNumber[]
  /**
   *	总数量，单位：L	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  Volume?: number
  /**
   *	干垃圾容量，单位：L	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  DryVolume?: number
  /**
   *	湿垃圾容量，单位：L	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  WetVolume?: number
  /**
   *	评级	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  Garde?: number
  /**
   *	满溢时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  FullDuration?: number

  /**
   *	垃圾滞留比值有垃圾时长/没有垃圾的时长	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  GarbageRatio?: number
  /**
   *	垃圾堆平均滞留时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  AvgGarbageTime?: number
  /**
   *	垃圾堆最大滞留时间，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  MaxGarbageTime?: number
  /**
   *	当日最大滞留堆数量	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  MaxGarbageCount?: number
  /**
   *	有垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  GarbageDuration?: number
  /**
   *	无垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationNumberStatisticV2
   */
  CleanDuration?: number
}

export interface GetGarbageStationStatisticGarbageCountsParams {
  /**
   *	日期	M
   *
   * @type {Date}
   * @memberof GetGarbageStationStatisticGarbageCountsParams
   */
  Date: string
  /**
   *	垃圾房ID列表	M
   *
   * @type {string[]}
   * @memberof GetGarbageStationStatisticGarbageCountsParams
   */
  GarbageStationIds: string[]
}
/**
 *垃圾房的垃圾堆数量统计信息
 *
 * @export
 * @class GarbageStationGarbageCountStatistic
 */
export class GarbageStationGarbageCountStatistic {
  /**
   *	垃圾房ID	M
   *
   * @type {string}
   * @memberof GarbageStationGarbageCountStatistic
   */
  Id!: string
  /**
   *	垃圾房名称	M
   *
   * @type {string}
   * @memberof GarbageStationGarbageCountStatistic
   */
  Name!: string
  /**
   *	开始时间	M
   *
   * @type {Date}
   * @memberof GarbageStationGarbageCountStatistic
   */
  BeginTime!: Date
  /**
   *	结束时间	M
   *
   * @type {Date}
   * @memberof GarbageStationGarbageCountStatistic
   */
  EndTime!: Date
  /**
   *	垃圾堆数量	M
   *
   * @type {number}
   * @memberof GarbageStationGarbageCountStatistic
   */
  GarbageCount!: number
  /**
   *	有垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationGarbageCountStatistic
   */
  GarbageDuration?: number
  /**
   *	无垃圾时长，单位：分钟	O
   *
   * @type {number}
   * @memberof GarbageStationGarbageCountStatistic
   */
  CleanDuration?: number
}
