import { Transform } from 'class-transformer'
import { transformDate } from '../transformer'
import { EventType } from './event-number'
import {
  EventData,
  GarbageDropEventData,
  GarbageFullEventData,
  IllegalDropEventData,
  MixedIntoEventData,
} from './event-record-data'

export enum EventResourceType {
  /** 监控点 */
  Camera = 'Camera',
  /** 编码设备 */
  EncodeDevice = 'EncodeDevice',
  /** 物联网传感器 */
  IoTSensor = 'IoTSensor',
}

export class IEventRecord {}

/**事件记录 */
export class EventRecord implements IEventRecord {
  EventId?: string
  /**事件ID */
  Id!: string

  /**事件时间 */
  @Transform(transformDate)
  EventTime?: Date

  /**事件类型 */
  EventType!: EventType
  /**事件描述信息(可选) */
  EventDescription?: string
  /**资源ID(可选) */
  ResourceId?: string
  /**
   * 资源类型(可选)：
   * Camera：监控点
   * EncodeDevice：编码设备
   * IoTSensor：物联网传感器
   */
  ResourceType?: EventResourceType
  /**资源名称(可选) */
  ResourceName?: string
  /**图片ID、图片地址(可选) */
  ImageUrl?: string
  /**录像文件ID、录像地址(可选) */
  RecordUrl?: string
  /**事件关键字(可选) */
  EventIndexes?: string[]
}

export class EventRecordData<T extends EventData> extends EventRecord {
  Data!: T
}

/** 垃圾满溢事件 */
export class GarbageFullEventRecord extends EventRecordData<GarbageFullEventData> {}

/**
 * 摄像机照片地址
 *
 * @export
 * @class CameraImageUrl
 */
export class CameraImageUrl {
  /**
   *	摄像机ID	M
   *
   * @type {string}
   * @memberof CameraImageUrl
   */
  CameraId!: string
  /**
   *	摄像机名称	M
   *
   * @type {string}
   * @memberof CameraImageUrl
   */
  CameraName!: string
  /**
   *	照片地址	M
   *
   * @type {string}
   * @memberof CameraImageUrl
   */
  ImageUrl!: string
}

/**乱丢垃圾事件记录 */
export class IllegalDropEventRecord extends EventRecordData<IllegalDropEventData> {}

/**混合投放事件记录 */
export class MixedIntoEventRecord extends EventRecordData<MixedIntoEventData> {}

export class GarbageDropEventRecord extends EventRecordData<GarbageDropEventData> {}
