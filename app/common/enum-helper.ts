export enum DivisionTypeEnum {
    None,
    Province,
    City,
    /**县、街道 */
    County,
    /**	居委会 */
    Committees,
    Village
}

export enum StationStateEnum {
    '正常' = 0,
    '满溢',
    '异常'
}