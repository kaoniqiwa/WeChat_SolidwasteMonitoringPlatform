import { EventNumber } from '../../../../../data-core/model/waste-regulation/event-number'
import { ResourceRole } from '../../../../../data-core/model/we-chat'
import {
  IGarbageStationList,
  IGarbageStationStatistic,
  OneDay,
  StatisticNumber,
} from '../../IController'

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
