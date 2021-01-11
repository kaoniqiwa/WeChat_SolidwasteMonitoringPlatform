import { ResourceRole } from "./we-chat"

export class User {
    /** 唯一标识符	M	R	*/
    Id!: string
    /** 用户名	M	RW	*/
    Username!: string
    /** 密码	O	W	*/
    Password?: string
    /** 密码HASH值	O	W*/
    PasswordHash?: string
    /** 密码SALT值	O	W	*/
    PasswordSalt?: string
    /** 名字	O	RW	*/
    FirstName?: string
    /** 姓	O	RW	*/
    LastName?: string
    /** 性别	O	RW*/
    Gender?: number;
    /** 手机号码	O	RW	*/
    MobileNo?: string
    /** 邮箱	O	RW	*/
    Email?: string
    /** 描述信息	O	RW	*/
    Note?: string
    /** 过期时间	M	RW	*/
    ExpiredTime!: Date
    /** 创建时间	M	R	*/
    CreateTime!: Date
    /** 更新时间	M	R	*/
    UpdateTime!: Date
    /** 0-正常	M	R	*/
    State!: number;
    /** 用户角色列表	M	R	*/
    Role!: Role[];
    /** 微信OpenID	O	RW	*/
    OpenId?: string;
    /** 资源列表	O	RW	*/
    Resources?: ResourceRole[];
    /** 服务器ID	O	R	*/
    ServerId?: string
    /** 是否可以分配微信子用户	O	R	*/
    CanCreateWeChatUser?: boolean;
    /** 创建者	O	R	*/
    CreatorId?: string;

}
/** 隐私数据显示	M	RW	
    3- 不显示|部分显示，1-显示
    隐私数据包括：姓名，证件号，车牌号等。		*/
export enum PrivacyData {
    /** 不显示|部分显示 */
    invisibility = 3,
    /** 显示*/
    visibility = 1
}
/** 许可 */
export enum Available {
    /** 允许 */
    enabled = 1,
    /** 禁止 */
    disabled = 0
}

export class Role {
    /** 唯一标识符	M	R		*/
    Id!: string;
    /** 角色名称	M	RW		*/
    Name!: string;
    /** 创建时间	M	R		*/
    CreateTime!: Date;
    /** 更新时间	M	R		*/
    UpdateTime!: Date;
    /** 隐私数据显示	M	RW	
     * 3- 不显示|部分显示，1-显示
     * 隐私数据包括：姓名，证件号，车牌号等。		*/
    PrivacyData!: PrivacyData;
    /** 
     * 用户数据操作权限	M	RW	
     *   0-不允许，1-允许				
     */
    UserData!: Available;
    /** 静态数据操作权限	M	RW
    * 0- 不允许，1-允许
    * 包括：小区所有的静态信息 
    */
    StaticData!: Available;
    /** 照片显示	M	RW
     * 0-不显示，1-显示 
    */
    PictureData!: Available;
    /** 资源列表	O	RW*/
    Resources?: ResourceRole[];
    /** 服务器ID	O	RW*/
    ServerId?: string;


}


