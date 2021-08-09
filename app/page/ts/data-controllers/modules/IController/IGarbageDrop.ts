import { PagedList } from '../../../../../data-core/model/page'
import { EventType } from '../../../../../data-core/model/waste-regulation/event-number'
import { GarbageDropEventRecord } from '../../../../../data-core/model/waste-regulation/event-record'
import {
  IImage,
  IResourceRoleList,
  IVodUrl,
  OneDay,
  Paged,
} from '../../IController'

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
