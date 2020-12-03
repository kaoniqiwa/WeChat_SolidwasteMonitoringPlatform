export class WeChatUser {
    Id: string;	//	用户ID
    OpenId: string;	//	微信OpenID
    MobileNo: string;	//	手机号码
    FirstName: string;	//	名字
    LastName: string;	//	姓
    Gender: number	//	性别
    Resources: ResourceRole[]//	资源列表
    ServerId: string;	//	服务器ID
    Note: string;	//	描述信息
    CanCreateWeChatUser: boolean;	//	是否可以分配微信子用户
}

export class ResourceRole {
    Id: string;	//	资源ID
    Name: string;	//	资源名称
    ResourceType: number;	//	资源类型，1-街道，2-居委，3-厢房
    RoleFlags: number;	//	资源标签，权限级别
    AllSubResources: boolean;//	开放全部的子节点资源
    Resources: ResourceRole[]	//
}