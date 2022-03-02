import { PagedList } from '../../../data-core/model/page'
import { UserLabel, UserLabelType } from '../../../data-core/model/user-stystem'
import {
  EventNumber,
  EventType,
} from '../../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../../data-core/model/waste-regulation/event-record'
import {
  GarbageStationGarbageCountStatistic,
  GarbageStationNumberStatisticV2,
} from '../../../data-core/model/waste-regulation/garbage-station-number-statistic'
import { VideoUrl } from '../../../data-core/model/waste-regulation/video-model'
import { ResourceRole, WeChatUser } from '../../../data-core/model/we-chat'
import {
  CameraViewModel,
  CommitteesViewModel,
  CountyViewModel,
  GarbageStationViewModel,
  IPictureController,
} from './ViewModels'

export interface GarbageCountsParams {
  IsTimeout: boolean
  IsHandle: boolean
}

/**
 * 一天
 *
 * @export
 * @interface OneDay
 */
export interface OneDay {
  /**
   * 开始时间
   *
   * @type {Date}
   * @memberof OneDay
   */
  begin: Date
  /**
   * 结束时间
   *
   * @type {Date}
   * @memberof OneDay
   */
  end: Date
}

/**
 * 分页
 *
 * @export
 * @interface Paged
 */
export interface Paged {
  /**
   * 第几页
   *
   * @type {number}
   * @memberof Paged
   */
  index: number
  /**
   * 单页面数量
   *
   * @type {number}
   * @memberof Paged
   */
  size: number
  count?: number
}

/**
 * 数据统计
 *
 * @export
 * @interface StatisticNumber
 */
export interface StatisticNumber {
  /**
   * 资源点ID
   *
   * @type {string}
   * @memberof StatisticNumber
   */
  id: string
  /**
   * 资源点名称
   *
   * @type {string}
   * @memberof StatisticNumber
   */
  name: string
  /**
   * 垃圾落地数量
   *
   * @type {number}
   * @memberof StatisticNumber
   */
  illegalDropNumber: number
  /**
   * 混合投放数量
   *
   * @type {number}
   * @memberof StatisticNumber
   */
  mixedIntoNumber: number
  /**
   * 垃圾满溢数量
   *
   * @type {number}
   * @memberof StatisticNumber
   */
  garbageFullNumber: number
  /**
   * 垃圾滞留数量
   *
   * @type {number}
   * @memberof StatisticNumber
   */
  garbageDropNumber: number
}

export interface GarbageDropProcessParamsViewModel {
  /** String 事件ID */
  EventId: string
  /**	String	处置人员名称	M */
  ProcessorName: string
  /**	String	处置人员ID	M */
  ProcessorId: string
  /**	String	手机号码	M */
  ProcessorMobileNo: string
  /**	String	处置描述	O */
  ProcessDescription?: string
}

export interface IVodUrl {
  getVodUrl(cameraId: string, begin: Date, end: Date): Promise<VideoUrl>
}
export interface ILiveUrl {
  getLiveUrl(cameraId: string): Promise<VideoUrl>
}
export interface IImage {
  getImageUrl(id: string): string | undefined
  getImageUrl(id: string[]): Array<string | undefined> | undefined
  /**
   * 获取图片URL
   *
   * @param {string} id 图片ID
   * @returns {(string | string[] | undefined)}
   * @memberof IImage
   */
  getImageUrl(
    id: string | string[]
  ): string | Array<string | undefined> | undefined
}
export interface IUserLabelController {
  list(labelIds?: string[]): Promise<UserLabel[]>
  get(garbageStationId: string, labelType: UserLabelType): Promise<UserLabel>
  create(
    garbageStationId: string,
    name: string,
    number: string
  ): Promise<boolean>
  update(
    garbageStationId: string,
    name?: string,
    number?: string
  ): Promise<boolean>
  remove(id: string): Promise<boolean>
}
export interface IResourceRoleList {
  getResourceRoleList(): Promise<Array<ResourceRole>>
}
export interface IGarbageStationList {
  /**
   * 获取垃圾厢房列表
   *
   * @returns {Promise<Array<GarbageStationModel>>}
   * @memberof IGarbageStationList
   */
  getGarbageStationList(): Promise<Array<GarbageStationViewModel>>
}
export interface IGarbageStation {
  getGarbageStation(id: string): Promise<GarbageStationViewModel>
}
export interface IGarbageStationStatistic {
  /**
   * 获取垃圾厢房当天的统计数据
   *
   * @param {ResourceRole[]} sources 垃圾厢房信息
   * @returns {Promise<Array<StatisticNumber>>}
   * @memberof IGarbageStationStatistic
   */
  getGarbageStationStatisticNumberListInToday(
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>>
  /**
   * 获取垃圾厢房数据统计
   *
   * @param {string[]} ids 垃圾厢房ID
   * @param {OneDay} day 日期
   * @returns {Promise<Array<GarbageStationNumberStatisticV2>>}
   * @memberof IGarbageStationStatistic
   */
  getGarbageStationNumberStatisticList(
    ids: string[],
    day: OneDay
  ): Promise<Array<GarbageStationNumberStatisticV2>>

  /**
   * 获取垃圾厢房数据统计
   *
   * @param {string} id 垃圾厢房ID
   * @param {Date} date 日期
   * @returns {Promise<Array<GarbageStationGarbageCountStatistic>>}
   * @memberof IGarbageStationStatistic
   */
  getGarbageStationNumberStatistic(
    id: string,
    date: Date
  ): Promise<Array<GarbageStationGarbageCountStatistic>>
}

export interface IUserController {}
