/**事件数量 */
export class EventNumber {
  /**事件类型 */
  EventType!: EventType
  /**当日事件数量 */
  DayNumber!: number
  /**当日时间段内事件数量(可选) */
  DeltaNumber?: number

  static Plus(a: EventNumber, b: EventNumber) {
    let result = new EventNumber()
    result.EventType = a.EventType
    result.DayNumber = a.DayNumber + b.DayNumber
    if (a.DeltaNumber !== undefined && b.DeltaNumber !== undefined) {
      result.DeltaNumber = a.DeltaNumber + b.DeltaNumber
    }
    return result
  }
  constructor(EventType?: EventType, DayNumber?: number, DeltaNumber?: number) {
    this.EventType = EventType
    this.DayNumber = DayNumber
    this.DeltaNumber = DeltaNumber
  }
}

export enum EventType {
  /** 乱认垃圾事件 */
  IllegalDrop = 1,
  /** 混合投放事件 */
  MixedInto = 2,
  /** 垃圾容量事件 */
  GarbageVolume = 3,
  /** 垃圾满溢事件 */
  GarbageFull = 4,
  /** 小包垃圾滞留事件 */
  GarbageDrop = 5,
  /** 小包垃圾滞留超时事件 */
  GarbageDropTimeout = 6,
  /** 小包垃圾处置完成事件 */
  GarbageDropHandle = 7,
  /** 小包垃圾处置完成事件 */
  GarbageDropAll = 0,
}
