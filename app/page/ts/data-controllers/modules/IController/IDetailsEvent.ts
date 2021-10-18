import { EventType } from '../../../../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../../../../data-core/model/waste-regulation/event-record'
import {
  GarbageDropProcessParamsViewModel,
  IImage,
  IVodUrl,
  OneDay,
} from '../../IController'
import { CameraViewModel, IPictureController } from '../../ViewModels'

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

  Process(
    eventId: string,
    userId: string,
    description: string
  ): Promise<GarbageDropEventRecord>
}
