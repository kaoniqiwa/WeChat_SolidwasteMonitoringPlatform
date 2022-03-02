/**获取事件记录参数 */
export class GetEventRecordsParams {
  /**页码[1-n](可选) */
  PageIndex?: number | null
  /**分页大小[1-100](可选) */
  PageSize?: number | null
  /**开始时间 */
  BeginTime!: Date | string
  /**结束时间 */
  EndTime!: Date | string
  /**所属区划ID列表(可选) */
  DivisionIds?: string[]
  /**垃圾房ID列表(可选) */
  StationIds?: string[]
  /**资源ID列表(可选) */
  ResourceIds?: string[]
  /**区划名称(可选)，支持LIKE */
  DivisionName?: string
  /**垃圾房名称(可选)，支持LIKE */
  StationName?: string
  /**资源名称(可选)，支持LIKE */
  ResourceName?: string
  /** 是否倒序时间排列 */
  Desc?: boolean
}

export interface GetGarbageDropEventRecordsParams
  extends GetEventRecordsParams {
  /**
   *	所属网格ID列表	O
   *
   * @type {string[]}
   * @memberof GetGarbageDropEventRecordsParams
   */
  GridCellIds?: string[]
  /**
   *	网格名称，支持LIKE	O
   *
   * @type {string}
   * @memberof GetGarbageDropEventRecordsParams
   */
  GridCellName?: string
  /**
   *	是否已处置	O
   *
   * @type {boolean}
   * @memberof GetGarbageDropEventRecordsParams
   */
  IsHandle?: boolean
  /**
   *	是否已超时	O
   *
   * @type {boolean}
   * @memberof GetGarbageDropEventRecordsParams
   */
  IsTimeout?: boolean
  /**	String[]	所属小区ID列表	O */
  CommunityIds?: string[]
  /**	String	小区名称，支持LIKE	O */
  CommunityName?: string
  /**	String	工单号，支持LIKE	O */
  RecordNo?: string
}

export interface GarbageDropProcessParams {
  /**	String	处置人员名称	M */
  ProcessorName: string
  /**	String	处置人员ID	M */
  ProcessorId: string
  /**	String	手机号码	M */
  ProcessorMobileNo: string
  /**	String	处置描述	O */
  ProcessDescription?: string
}
