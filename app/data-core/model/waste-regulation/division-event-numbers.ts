import { EventNumber, EventType } from './event-number'

/**事件数量统计 */
export class EventNumberStatistic {
  /**事件数量 */
  EventNumbers!: EventNumber[]
  /**开始时间 */
  BeginTime!: Date | string
  /**结束时间 */
  EndTime!: Date | string

  static Plus(a: EventNumberStatistic, b: EventNumberStatistic) {
    let result = new EventNumberStatistic()
    result.BeginTime = a.BeginTime
    result.EndTime = b.EndTime
    result.EventNumbers = new Array<EventNumber>()

    for (const key in EventType) {
      var keyToAny: any = key
      let type: EventType
      if (isNaN(keyToAny)) {
        var fruitAnyType: any = EventType[key]
        type = fruitAnyType
      }
      let aItem = a.EventNumbers.find((x) => x.EventType == type)
      let bItem = b.EventNumbers.find((x) => x.EventType == type)
      if (aItem && bItem) {
        result.EventNumbers.push(EventNumber.Plus(aItem, bItem))
      }
    }

    return result
  }
}
