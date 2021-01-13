/** 性别 */
export enum GenderType {
    /** 男 */
    male = 1,
    /** 女 */
    female = 2
}


export class WeChatUser {
    /**	用户ID */
    Id?: string;
    /**	微信OpenID */
    OpenId?: string;
    /**	手机号码 */
    MobileNo?: string;
    /**	名字 */
    FirstName?: string;
    /**	姓 */
    LastName?: string;
    /**	性别 */
    Gender?: GenderType;
    /**	资源列表 */
    Resources?: ResourceRole[];
    /**	服务器ID */
    ServerId?: string;
    /**	描述信息 */
    Note?: string;
    /**	是否可以分配微信子用户 */
    CanCreateWeChatUser?: boolean;
}

export class ResourceRole {
    /** 资源ID */
    Id!: string;
    /**资源名称 */
    Name?: string;
    /** 资源类型，1-街道，2-居委，3-厢房*/
    ResourceType!: ResourceType;
    /** 资源标签，权限级别 */
    RoleFlags!: number;
    /** 开放全部的子节点资源 */
    AllSubResources!: boolean;
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
    GarbageStations = 3
}