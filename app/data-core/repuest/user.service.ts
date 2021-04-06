import { plainToClass } from "class-transformer";
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
    async list(index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        let response = await this.requestService.get<Response<PagedList<User>>>(this.url.list() + query);
        response.Data.Data = plainToClass(User, response.Data.Data);
        return response.Data;
    }
    // 创建用户
    create(user: User) {
        return this.requestService.post<User, ResponseBase>(this.url.list(), user);
    }
    // 获取用户信息
    async get(userId: string) {
        let response = await this.requestService.get<Response<User>>(this.url.item(userId))
        return plainToClass(User, response.Data);
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
    async getRoleList(userId: string, index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        let response = await this.requestService.get<Response<PagedList<Role>>>(this.url.roles_list(userId) + query);
        response.Data.Data = plainToClass(Role, response.Data.Data);
        return response.Data;
    }
    // 获取用户下单个规则
    async getRole(userId: string, roleId: string) {
        let response = await this.requestService.get<Response<Role>>(this.url.roles_item(userId, roleId));
        return plainToClass(Role, response.Data);
    }


}