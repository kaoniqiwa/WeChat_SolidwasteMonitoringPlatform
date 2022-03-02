export enum DivisionTypeEnum {
  None,
  Province,
  City,
  /**县、街道 */
  County,
  /**	居委会 */
  Committees,
  Village,
}

export enum StationStateEnum {
  '正常' = 0,
  '满溢',
  '异常',
}

export enum ResourceRoleType {
  // 1-街道，2-居委，3-厢房
  /**县、街道 */
  County = 1,
  /**	居委会 */
  Committees,
  /**厢房 */
  GarbageStations,
}

// export enum  EventTypeEnum{
//     '垃圾落地事件'=1,
// '混合投放事件',
// '垃圾容量事件',
// '垃圾满溢事件'
// }
