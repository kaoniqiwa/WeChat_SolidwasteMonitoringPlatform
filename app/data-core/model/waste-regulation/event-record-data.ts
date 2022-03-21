import { Transform } from 'class-transformer'
import { Point } from '../point'
import { transformDate } from '../transformer'
import { CameraImageUrl } from './event-record'

export class EventDataBasic {}
/**
 *
 * StationId!: string;
 * StationName!: string;
 * DivisionId?: string;
 * DivisionName?: string;
 *
 */
export class EventData {
  StationId!: string
  StationName!: string
  DivisionId?: string
  DivisionName?: string
  /**	String	小区ID	O */
  CommunityId?: string
  /**	String	小区名称	O */
  CommunityName?: string
}

/**归一化坐标点 */
export interface EventDataObject {
  /**目标ID */
  Id: string
  /**目标所在的归一化多边形 */
  Polygon: Point[]
  /**置信度：0-100 */
  Confidence: number
}

/** 垃圾满溢事件 */
export class GarbageFullEventData extends EventData {
  /** 第一次满溢时间	M */
  FullTime!: Date
  /** 图片ID、图片地址列表	O */
  ImageUrls?: string[]

  /**
   *  图片ID、图片地址列表	O
   *
   * @type {CameraImageUrl[]}
   * @memberof GarbageFullEventData
   */
  CameraImageUrls?: CameraImageUrl[]
}

/**垃圾落地事件数据 */
export class IllegalDropEventData extends EventData {
  /**垃圾的目标(可选) */
  Objects?: EventDataObject[]
}

/**/ //  */
export class MixedIntoEventData extends EventData {
  /**垃圾的目标(可选) */
  Objects?: EventDataObject[]
  /**图片ID、图片地址列表(可选) */
  PersonImageUrls?: string[]
}

export class GarbageDropEventData extends EventData {
  /**
   *	网格单元ID	O
   *
   * @type {string}
   * @memberof GarbageFullEventData
   */
  GridCellId?: string
  /**
   *	网格单元名称	O
   *
   * @type {string}
   * @memberof GarbageFullEventData
   */
  GridCellName?: string
  /**
   *	落地时间	M
   *
   * @type {Date}
   * @memberof GarbageFullEventData
   */
  @Transform(transformDate)
  DropTime!: Date
  /**
   *	处置时间	O
   *
   * @type {Date}
   * @memberof GarbageFullEventData
   */
  @Transform(transformDate)
  HandleTime?: Date
  /**
   *	小包垃圾滞留是否已处置	M
   *
   * @type {boolean}
   * @memberof GarbageFullEventData
   */
  IsHandle!: boolean
  /**
   *	是否超时	M
   *
   * @type {boolean}
   * @memberof GarbageFullEventData
   */
  IsTimeout!: boolean
  /**
   *	垃圾滞留的图片ID、图片地址列表	O
   *
   * @type {CameraImageUrl[]}
   * @memberof GarbageFullEventData
   */
  DropImageUrls?: CameraImageUrl[]
  /**
   *	垃圾处置的图片ID、图片地址列表	O
   *
   * @type {CameraImageUrl[]}
   * @memberof GarbageFullEventData
   */
  HandleImageUrls?: CameraImageUrl[]
  /**
   *	超时未处置的图片ID、图片地址列表	O
   *
   * @type {CameraImageUrl[]}
   * @memberof GarbageFullEventData
   */
  TimeoutImageUrls?: CameraImageUrl[]
  /**	Boolean	处置人员是否已处置	O */
  Processed?: boolean
  /**	String	处置人员名称	O */
  ProcessorName?: string
  /**	String	处置人员ID	O */
  ProcessorId?: string
  /**	String	手机号码	O */
  ProcessorMobileNo?: string
  /**	DateTime	处置时间	O */
  @Transform(transformDate)
  ProcessTime?: Date
  /**	String	处置描述	O */
  ProcessDescription?: string

  /**	String	小区ID	O */
  CommunityId?: string
  /**	String	小区名称	O */
  CommunityName?: string
  /**	String	工单号	O */
  RecordNo?: string
}
