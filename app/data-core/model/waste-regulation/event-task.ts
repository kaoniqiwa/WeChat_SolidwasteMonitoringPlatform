import { Transform, Type } from 'class-transformer'
import {
  IIntervalParams,
  IntervalParams,
  IPagedParams,
  PagedIntervalParams,
  PagedParams,
} from '../page'
import { transformDate } from '../transformer'
import { GisPoint } from './division'
import { CameraImageUrl } from './event-record'
import 'reflect-metadata'

export enum TaskType {
  /**
   * 垃圾滞留
   */
  retention = 1,
  /**
   * 垃圾满溢
   */
  full = 2,
}

/**
 * 任务状态
 */
export enum TaskStatus {
  /**
   * 待处置
   */
  handle = 1,
  /**
   * 处置中
   */
  handling = 2,
  /**
   * 处置完成
   */
  handed = 3,
  /**
   *  已撤销
   */
  cancel = 4,
}
export enum DestinationType {
  garbagestation = 1,
}

export class GetEventTasksParams extends PagedIntervalParams {
  /**	String[]	任务ID	O */
  Ids?: string[]
  /**	String	任务编号	O */
  TaskNo?: string
  /**	String	发布人员ID	O */
  PublisherId?: string
  /**	String	处置人员ID	O */
  ProcessorId?: string
  /**	String[]	居委ID列表	O */
  DivisionIds?: string[]
  /**	String[]	目的地ID	O */
  DestinationIds?: string[]
  /**	String	目的地名称，支持LIKE	O */
  DestinationName?: string
  /**	Int32	任务类型	O */
  TaskType?: TaskType
  /**	Int32	任务状态	O */
  TaskStatus?: TaskStatus
  /**	Boolean	是否撤销	O */
  IsCancel?: boolean
  /**	Boolean	是否接单	O */
  IsHandle?: boolean
  /**	Boolean	是否超时	O */
  IsTimeout?: boolean
  /**	Boolean	是否已完成	O */
  IsFinished?: boolean
  /**	Double	低于指定评分	O */
  LowerThanScore?: number
  /**	Double	高于指定评分	O */
  HigherThanScore?: number
}

export class GetAvailableEventTasksParams extends PagedIntervalParams {}

export class GetTaskProcessorsParams extends PagedParams {
  /**	String[]	ID列表	O */
  Ids?: string[]
  /**	String[]	区划ID，街道ID	O */
  DivisionIds?: string[]
  /**	String	目的地ID	O */
  DestinationId?: string
  /**	String	名称	O */
  Name?: string
  /**	String	手机号码	O */
  MobileNo?: string
}

export class GetProcessorSchemesParams extends PagedIntervalParams {
  /**	String[]	处置人员ID列表	O */
  ProcessorIds?: string[]
}

export class GetProcessorSchemeDailyParams {
  /**	DateTime	日期	M */
  Date!: Date
}

export class GetTaskDestinationsParams extends PagedParams {
  /**	String[]	目的地ID	O */
  Ids?: string[]
  /**	String	名称	O */
  Name?: string
  /**	Int32	类型	O */
  Type?: TaskType
}

export class GetEventTasksDailyParams extends PagedParams {
  /**	DateTime	日期	M */
  Date!: Date
  /**	String[]	目的地ID	O */
  DestinationIds?: string[]
  /**	String	目的地名称，支持LIKE	O */
  DestinationName?: string
  /**	Int32	任务类型	O */
  TaskType?: TaskType
  /**	Int32	任务状态	O */
  TaskStatus?: TaskStatus
  /**	Boolean	是否撤销	O */
  IsCancel?: boolean
  /**	Boolean	是否接单	O */
  IsHandle?: boolean
  /**	Boolean	是否超时	O */
  IsTimeout?: boolean
  /**	Boolean	是否完成	O */
  IsFinished?: boolean
}

export class GetEventTaskSchemeParams {
  /**	DateTime	日期	M */
  Date!: Date
}

export class GetTaskDestinationSchemesParams extends PagedIntervalParams {
  /**	String[]	目的地ID	O */
  DestinationIds?: string[]
  /**	String	名称	O */
  DestinationName?: string
  /**	String[]	区划ID	O */
  DivisionIds?: string[]
}

/** 发布任务 */
export class EventTask {
  /**	String	任务ID	M */
  Id!: string
  /**	String	任务编号	M */
  TaskNo!: string
  /**	String	任务名称	M */
  Name!: string
  /**	String	区划ID，居委级别	O */
  DivisionId?: string
  /**	String	目的地ID	M */
  DestinationId!: string
  /**	String	目的地名称	M */
  DestinationName!: string
  /**	String	目的地地址	M */
  DestinationAddress!: string
  /**	Int32	任务状态，1-待处置，2-处置中，3-处置完成，4-已撤销。	M */
  TaskStatus!: TaskStatus
  /**	DateTime	任务发布时间	M */
  @Transform(transformDate)
  CreateTime!: Date
  /**	DateTime	预计完成时间	M */
  @Transform(transformDate)
  EstimatedTime!: Date
  /**
   *  Int32	任务类型：
   *    1-垃圾滞留
   *    2-垃圾桶满溢	M
   * */
  TaskType!: TaskType

  /**	Boolean	是否已撤销	M */
  IsCancel!: boolean
  /**	String	撤销原因	O */
  CancelReason?: string
  /**	Boolean	是否已接单	M */
  IsHandle!: boolean

  /**	Boolean	是否超出预计时间	M */
  IsTimeout!: boolean
  /**	DateTime	接单时间	O */
  @Transform(transformDate)
  HandleTime?: Date
  /**	Boolean	是否已完成	M */
  IsFinished!: boolean
  /**	DateTime	处置完成时间	O */
  @Transform(transformDate)
  FinishTime?: Date
  /**	String	处置描述	O */
  FinishDescription?: string
  /**	Double	花费时间，单位：分钟	O */
  TakeTime?: number
  /**	TaskScore	评价	O */
  Score?: TaskScore
  /**	String	任务发布用户ID	M */
  PublisherId!: string
  /**	String	任务发布用户名称	M */
  PublisherName!: string
  /**	String	任务处理用户ID	O */
  ProcessorId?: string
  /**	String	任务处理用户名称	O */
  ProcessorName?: string
  /**	CameraImageUrl[]	任务现场图片ID、图片地址列表	O */
  @Type(() => CameraImageUrl)
  SceneImageUrls?: CameraImageUrl[]
  /**	CameraImageUrl[]	处置完成后的现场照片ID	O */
  @Type(() => CameraImageUrl)
  ProcessedImageUrls?: CameraImageUrl[]
}

/** 发布任务评分 */
export class TaskScore {
  /**	Double	总体评价，1-5	M */
  TotalScore!: number
  /**	Double	处置速度评价，1-5	M */
  SpeedScore!: number
  /**	Double	处理效果评价，1-5	M */
  QualityScore!: number
}
/** 发布任务人员信息 */
export class TaskPublisher {
  /**	String	任务发布用户ID	M */
  Id!: string
  /**	String	微信ID	O */
  OpenId?: string
  /**	String	所属街道ID	O */
  DivisionId?: string
  /**	String	手机号码	O */
  MobileNo?: string
  /**	String	名字	O */
  FirstName?: string
  /**	String	姓	O */
  LastName?: string
  /**	DateTime	创建时间	M */
  @Transform(transformDate)
  CreateTime!: Date
  /**	DateTime	更新时间	M */
  @Transform(transformDate)
  UpdateTime!: Date
}
/** 处理任务人员信息 */
export class TaskProcessor {
  /**	String	任务处理用户ID	M */
  Id!: string
  /**	String	微信ID	O */
  OpenId?: string
  /**	String	所属街道ID	O */
  DivisionId?: string
  /**	String	手机号码	O */
  MobileNo?: string
  /**	String	名字	O */
  FirstName?: string
  /**	String	姓	O */
  LastName?: string
  /**	TaskScore	平均评分	O */
  Score?: TaskScore
  /**	Double	平均花费时间，单位：分钟	O */
  AvgTakeTime?: number
  /**	Int32	总处理任务数量	M */
  TotalTaskCount!: number
  /**	Int32	总完成任务数量	M */
  CompleteTaskCount!: number
  /**	Int32	未处置任务数量	M */
  TimeoutTaskCount!: number
  /**	Int32	本月处理任务数量	M */
  MonthlyTaskCount!: number
  /**	String[]	任务处理权限范围，垃圾投放项目中，此项数值为必填	O */
  DestinationIds?: string[]
  /**	DateTime	创建时间	M */
  @Transform(transformDate)
  CreateTime!: Date
  /**	DateTime	更新事件	M */
  @Transform(transformDate)
  UpdateTime!: Date
}
/** 处理任务人员信息记录 */
export class ProcessorScheme {
  /**	String	记录ID	M */
  Id!: string
  /**	String	任务处理用户ID	M */
  ProcessorId!: string
  /**	String	名字	O */
  FirstName?: string
  /**	String	姓	O */
  LastName?: string
  /**	Int32	总处理任务数量	M */
  TotalTaskCount!: number
  /**	Int32	总完成任务数量	M */
  CompleteTaskCount!: number
  /**	Int32	未处置任务数量	M */
  TimeoutTaskCount!: number
  /**	TaskScore	评价评分	O */
  Score?: TaskScore
  /**	Double	平均花费时间，单位：分钟	O */
  AvgTakeTime?: number
  /**	DateTime	日期	M */
  @Transform(transformDate)
  Date!: Date
}

/** 目的地 */
export class Destination {
  /**	String	ID	M */
  Id!: string
  /**	String	名字	M */
  Name!: string
  /**	String	地址	M */
  Address!: string
  /**	Int32	目的地类型，1-垃圾投放点	O */
  Type?: DestinationType
  /**	GisPoint	GIS点位	O */
  @Type(() => GisPoint)
  GisPoint?: GisPoint
  /**	DateTime	创建时间	M */
  @Transform(transformDate)
  CreateTime!: Date
  /**	DateTime	更新时间	M */
  @Transform(transformDate)
  UpdateTime!: Date
}
/** 任务缩略图 */
export class EventTaskScheme {
  /**	Int32	总处理任务数量	M */
  TotalTaskCount!: number
  /**	Int32	完成任务数量	M */
  CompleteTaskCount!: number
  /**	Int32	未完成任务数量	M */
  TimeoutTaskCount!: number
  /**
   * Int32	管理的任务处置人员数量，
   * 如果本身是任务处置人员，则为1	M
   */
  ProcessorCount!: number

  /**	DateTime	日期	M */
  @Transform(transformDate)
  Date!: Date
}

/** 任务缩略图 */
export class EventTaskDestinationScheme {
  /**	String	ID	M */
  Id!: string
  /**	Int32	总处理任务数量	M */
  TotalTaskCount!: number
  /**	Int32	完成任务数量	M */
  CompleteTaskCount!: number
  /**	Int32	未完成任务数量	M */
  TimeoutTaskCount!: number
  /**
   * 	Int32	管理的任务处置人员数量，
   *  如果本身是任务处置人员，则为1	M
   */
  ProcessorCount!: number

  /**	DateTime	日期	M */
  @Transform(transformDate)
  Date!: Date
  /**	String	目的地ID	M */
  DestinationId!: string
  /**	String	目的地名称	M */
  DestinationName!: string
  /**	String	区划ID	O */
  DivisionId?: string
  /**	String	区划名称	O */
  DivisionName?: string
}
