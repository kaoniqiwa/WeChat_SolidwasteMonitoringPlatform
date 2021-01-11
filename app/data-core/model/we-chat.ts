// 性别
export enum GenderType
{
    // 男
    male = 1,
    // 女
    female = 2
}


export class WeChatUser {
    Id?: string;	//	用户ID
    OpenId?: string;	//	微信OpenID
    MobileNo?: string;	//	手机号码
    FirstName?: string;	//	名字
    LastName?: string;	//	姓
    Gender?: GenderType	//	性别
    Resources?: ResourceRole[]//	资源列表
    ServerId?: string;	//	服务器ID
    Note?: string;	//	描述信息
    CanCreateWeChatUser?: boolean;	//	是否可以分配微信子用户
}

export class ResourceRole {
    Id!: string;	//	资源ID
    Name?: string;	//	资源名称
    ResourceType!: ResourceRoleType;	//	资源类型，1-街道，2-居委，3-厢房
    RoleFlags!: number;	//	资源标签，权限级别
    AllSubResources!: boolean;//	开放全部的子节点资源
    Resources?: ResourceRole[]	// 子资源列表
}
// 资源类型，
// 1-街道，2-居委，3-厢房
export enum ResourceRoleType {
    // 1-街道，2-居委，3-厢房
    /**县、街道 */
    County = 1,
    /**	居委会 */
    Committees = 2,
    /**厢房 */
    GarbageStations = 3
}