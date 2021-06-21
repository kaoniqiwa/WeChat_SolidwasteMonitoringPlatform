import { PagedList } from '../../../data-core/model/page'
import { UserLabel, UserLabelType } from '../../../data-core/model/user-stystem'
import { Division } from '../../../data-core/model/waste-regulation/division'
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
   * 乱丢垃圾数量
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
   * 垃圾落地数量
   *
   * @type {number}
   * @memberof StatisticNumber
   */
  garbageDropNumber: number
}

export interface IVodUrl {
  getVodUrl(cameraId: string, begin: Date, end: Date): Promise<VideoUrl>
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
  getUserLabel(
    garbageStationId: string,
    labelType: UserLabelType
  ): Promise<UserLabel>
  createUserLabel(label: UserLabel): void
  updateUserLabel(label: UserLabel): void
  removeUserLabel(id: string): void
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

export interface IDataController
  extends IGarbageStationList,
    IGarbageStationStatistic {
  roles: ResourceRole[]
  /**
   * 获取事件统计
   *
   * @param {OneDay} day
   * @returns {Promise<StatisticNumber>}
   * @memberof IDataController
   */
  getEventCount(day: OneDay): Promise<StatisticNumber>

  /**
   * 获取统计数据详细列表
   *
   * @param {OneDay} day
   * @returns {Promise<Array<StatisticNumber>>}
   * @memberof IDataController
   */
  getStatisticNumberList(day: OneDay): Promise<Array<StatisticNumber>>
  /**
   * 获取历史记录
   *
   * @param {OneDay} day
   * @returns {Promise<Array<EventNumber>>}
   * @memberof IDataController
   */
  getHistory(day: OneDay): Promise<
    | Array<EventNumber>
    | {
        IllegalDrop: Array<EventNumber>
        MixedInto: Array<EventNumber>
      }
  >
}
export interface IGarbageStationController
  extends IGarbageStation,
    IGarbageStationList,
    IResourceRoleList,
    IGarbageStationStatistic,
    IImage,
    IVodUrl {
  picture: IPictureController
  /**
   * 获取区划
   *
   * @param {string} divisionId 区划ID
   * @returns {Promise<Division>}
   * @memberof IGarbageStationController
   */
  getDivision(divisionId: string): Promise<Division>
  /**
   * 获取摄像机列表
   *
   * @param {string} garbageStationId 垃圾厢房ID
   * @param {(cameraId: string, url?: string) => void} loadImage 加载图片，备注：为了加快数据读取，把加载图片事件放到页面
   * @returns {Promise<Array<CameraViewModel>>}
   * @memberof IGarbageStationController
   */
  getCameraList(
    garbageStationId: string,
    loadImage: (cameraId: string, url?: string) => void
  ): Promise<Array<CameraViewModel>>
  /**
   * 获取厢房事件列表
   *
   * @param {string} garbageStationId
   * @param {EventType} type
   * @param {OneDay} day
   * @return {*}  {(Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord> | undefined>)}
   * @memberof IGarbageStationController
   */
  GetEventRecordByGarbageStation(
    garbageStationId: string,
    paged: Paged,
    type: EventType | undefined,
    day: OneDay
  ): Promise<
    | PagedList<
        | IllegalDropEventRecord
        | MixedIntoEventRecord
        | GarbageFullEventRecord
        | GarbageDropEventRecord
      >
    | undefined
  >
}

export interface IEventHistory extends IResourceRoleList, IImage, IVodUrl {
  /**
   * 获取事件列表
   *
   * @param {OneDay} day 哪一天
   * @param {Paged} page 分页
   * @param {EventType} type 事件类型
   * @param {string[]} [ids]
   * @returns {(Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord> | undefined>)}
   * @memberof IEventHistory
   */
  getEventList(
    day: OneDay,
    page: Paged,
    type: EventType,
    ids?: string[]
  ): Promise<
    | PagedList<
        | IllegalDropEventRecord
        | MixedIntoEventRecord
        | GarbageFullEventRecord
        | GarbageDropEventRecord
      >
    | undefined
  >
}
export interface IDetailsEvent extends IImage, IVodUrl {
  picture: IPictureController

  /**
   * 获取事件记录
   *
   * @param {EventType} type 事件类型
   * @param {string} eventId 事件ID
   * @returns {(Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>)}
   * @memberof IDetailsEvent
   */
  GetEventRecord(
    type: EventType,
    eventId: string
  ): Promise<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | undefined
  >

  /**
   * 获取事件记录
   *
   * @param {EventType} type 事件类型
   * @param {number} index 索引
   * @returns {(Promise<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | undefined>)}
   * @memberof IDetailsEvent
   */
  GetEventRecord(
    type: EventType,
    index: number,
    day: OneDay,
    sourceIds?: string[]
  ): Promise<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | undefined
  >

  /**
   * 获取摄像机信息
   *
   * @param {string} garbageStationId
   * @param {string} cameraId
   * @returns {Promise<CameraViewModel>}
   * @memberof IDetailsEvent
   */
  GetCamera(
    garbageStationId: string,
    cameraId: string
  ): Promise<CameraViewModel>
}

export interface IGarbageStationNumberStatistic
  extends IGarbageStationList,
    IGarbageStationStatistic {}

export interface IGarbageDrop extends IResourceRoleList, IImage, IVodUrl {
  /**
   * 获取事件列表
   *
   * @param {OneDay} day 哪一天
   * @param {Paged} page 分页
   * @param {EventType} type 事件类型
   * @param {string[]} [ids]
   * @returns {(Promise<PagedList<GarbageDropEventRecord> | undefined>)}
   * @memberof IGarbageDrop
   */
  getGarbageDropEventList(
    day: OneDay,
    page: Paged,
    type?: EventType,
    ids?: string[]
  ): Promise<PagedList<GarbageDropEventRecord> | undefined>
}

export interface IUserPushManager {
  GetUser(id: string): Promise<WeChatUser>
  SetUser(user: WeChatUser): void
}
