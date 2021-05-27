export interface IUrl {
    create(...param: string[]): string;
    edit(...param: string[]): string;
    del(...param: string[]): string;
    get(...param: string[]): string;
    list(...param: string[]): string;
}

export class BaseUrl {     
    user ='/howell/ver10/data_service/user_system/';
    /**
     *  网管地址
     *
     * @memberof BaseUrl
     */
    gateway='/api/howell/ver10/aiop_service/garbage_gateway/';
    static gateway='/api/howell/ver10/aiop_service/garbage_gateway/';
    /**
     *  短信地址
     *
     * @memberof BaseUrl
     */
    wechat='/api/WechatIndex/'; 
}
export class GarbageBaseUrl extends BaseUrl {
    /**
     * 服务器访问地址
     *
     * @memberof GarbageBaseUrl
     */
    aiop = '/api/howell/ver10/aiop_service/garbage_management/';

    static aiop = '/api/howell/ver10/aiop_service/garbage_management/';
}
