import { PagedList } from '../../../../../data-core/model/page'
import { EventType } from '../../../../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../../../../data-core/model/waste-regulation/event-record'
import {
  IGarbageStation,
  IGarbageStationList,
  IGarbageStationStatistic,
  IImage,
  IResourceRoleList,
  IUserLabelController,
  IVodUrl,
  OneDay,
  Paged,
} from '../../IController'
import {
  CameraViewModel,
  CommitteesViewModel,
  CountyViewModel,
  IPictureController,
} from '../../ViewModels'

export interface IGarbageStationController
  extends IGarbageStation,
    IGarbageStationList,
    IResourceRoleList,
    IGarbageStationStatistic,
    IImage,
    IVodUrl {
  picture: IPictureController
  userLabel: IUserLabelController
  /**
   * 获取区划
   *
   * @param {string} divisionId 区划ID
   * @returns {Promise<CountyViewModel | CommitteesViewModel>}
   * @memberof IGarbageStationController
   */
  getDivision(
    divisionId: string
  ): Promise<CountyViewModel | CommitteesViewModel>
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
