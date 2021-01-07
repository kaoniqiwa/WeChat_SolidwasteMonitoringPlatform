import { PagedList } from "../model/page";
import { ResponseBase, Response } from "../model/response";
import { SaveModel } from "../model/save-model";
import { Role, User } from "../model/user-stystem";
import * as url from "../url/user-url";
import { HowellAuthHttp } from "./howell-auth-http";

// 角色信息服务
export class RoleRequestService extends SaveModel {
    url: url.Roles;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Roles();
    }

    private getQueryString(index: number = 1, size: number = 100) {
        return `?PageIndex=${index}&PageSize=${size}`;
    }

    // 获取所有角色信息
    list(index: number = 1, size: number = 100) {
        let query = this.getQueryString(index, size);
        return this.requestService.get<Response<PagedList<Role>>>(this.url.list() + query);
    }
    // 创建角色信息
    create(role: Role) {
        return this.requestService.post<Role, ResponseBase>(this.url.list(), role);
    }
    // 获取单个角色信息
    get(roleId: string) {
        return this.requestService.get<Response<Role>>(this.url.item(roleId))
    }
    // 修改角色信息
    update(role: Role) {
        return this.requestService.put<Role, ResponseBase>(this.url.item(role.Id), role);
    }
    // 删除角色信息
    delete(roleId: string) {
        return this.requestService.delete<ResponseBase>(this.url.item(roleId));
    }
    // 获取符合角色信息的所有用户
    getUserList(roleId: string, index: number = 1, size: number = 100) {
        let query = this.getQueryString(index, size);
        return this.requestService.get<Response<PagedList<User>>>(this.url.user_list(roleId) + query);
    }
    // 获取角色信息的单个用户
    getUser(roleId: string, userId: string) {
        return this.requestService.get<Response<Role>>(this.url.user_item(roleId, userId));
    }


}