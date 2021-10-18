import { Transform } from 'class-transformer'
import { transformDate } from './transformer'

/** 性别 */
export enum GenderType {
  /** 未知 */
  unknow = 0,
  /** 男 */
  male = 1,
  /** 女 */
  female = 2,
}

export class WeChatUser {
  /**	用户ID */
  Id?: string
  /**	微信OpenID */
  OpenId?: string
  /**	手机号码 */
  MobileNo?: string
  /**	名字 */
  FirstName?: string
  /**	姓 */
  LastName?: string
  /**	性别 */
  Gender?: GenderType
  /**	资源列表 */
  Resources?: ResourceRole[]
  /**	服务器ID */
  ServerId?: string
  /**	描述信息 */
  Note?: string
  /**	是否可以分配微信子用户 */
  CanCreateWeChatUser?: boolean

  /**
   *	停止推送的事件类型	O	RW
   *
   * @type {number[]}
   * @memberof WeChatUser
   */
  OffEvents?: number[]
}

export class ResourceRole {
  /** 资源ID */
  Id!: string
  /**资源名称 */
  Name?: string
  /** 资源类型，1-街道，2-居委，3-厢房*/
  ResourceType!: ResourceType
  /** 资源标签，权限级别 */
  RoleFlags!: number
  /** 开放全部的子节点资源 */
  AllSubResources!: boolean
  /** 子资源列表 */
  Resources?: ResourceRole[]
}
/** 资源类型，
 1-街道，2-居委，3-厢房 */
export enum ResourceType {
  /** 1-街道，2-居委，3-厢房
    /** 县、街道 */
  County = 1,
  /**	居委会 */
  Committees = 2,
  /** 厢房 */
  GarbageStations = 3,
}

/** 垃圾房管理人员 */
export class Member {
  /**	String	成员ID	M */
  Id!: string
  /**	String	姓名	M */
  Name!: string
  /**	Int32	性别，1-男性，2-女性	O */
  Gender?: GenderType
  /**	String	手机号码	O */
  MobileNo?: string
  /**	String	描述信息	O */
  Note?: string
  /**	Int32	人员类型	M */
  MemberType!: Member
  /**	String	微信OpenId	O */
  WeChatOpenId?: string
  /**	String	所属区划ID	O */
  DivisionId?: string
  /**	String	所属网格ID 	O */
  GridCellId?: string
  /**	DateTime	创建时间	M */
  @Transform(transformDate)
  CreateTime!: Date
  /**	DateTime	更新事件	M */
  @Transform(transformDate)
  UpdateTime!: Date
}
