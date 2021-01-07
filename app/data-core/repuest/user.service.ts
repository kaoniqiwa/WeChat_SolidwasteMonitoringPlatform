import { PagedList } from "../model/page";
import { ResponseBase, Response } from "../model/response";
import { SaveModel } from "../model/save-model";
import { Role, User } from "../model/user-stystem";
import * as url from "../url/user-url";
import { HowellAuthHttp } from "./howell-auth-http";

// 用户信息服务
export class UserRequestService extends SaveModel {
    url: url.User;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.User();
    }

    // 获取用户信息列表
    list(index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        return this.requestService.get<Response<PagedList<User>>>(this.url.list() + query);
    }
    // 创建用户
    create(user: User) {
        return this.requestService.post<User, ResponseBase>(this.url.list(), user);
    }
    // 获取用户信息
    get(userId: string) {
        return this.requestService.get<Response<User>>(this.url.item(userId))
    }
    // 修改用户信息
    update(user: User) {
        return this.requestService.put<User, ResponseBase>(this.url.item(user.Id), user);
    }
    // 删除用户
    delete(userId: string) {
        return this.requestService.delete<ResponseBase>(this.url.item(userId));
    }
    // 获取用户下所有规则
    getRoleList(userId:string, index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        return this.requestService.get<Response<PagedList<Role>>>(this.url.roles_list(userId) + query);
    }
    // 获取用户下单个规则
    getRole(userId:string, roleId:string)
    {
        return this.requestService.get<Response<Role>>(this.url.roles_item(userId, roleId));
    }


}