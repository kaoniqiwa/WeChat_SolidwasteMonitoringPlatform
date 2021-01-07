import { PagedList } from "../model/page";
import { ResponseBase, Response } from "../model/response";
import { SaveModel } from "../model/save-model";
import { Role, User } from "../model/user-stystem";
import * as url from "../url/user-url";
import { HowellAuthHttp } from "./howell-auth-http";

export class RoleRequestService extends SaveModel {
    url: url.Roles;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Roles();
    }

    private getQueryString(index: number = 1, size: number = 100) {
        return `?PageIndex=${index}&PageSize=${size}`;
    }


    list(index: number = 1, size: number = 100) {
        let query = this.getQueryString(index, size);
        return this.requestService.get<Response<PagedList<Role>>>(this.url.list() + query);
    }
    create(role: Role) {
        return this.requestService.post<Role, ResponseBase>(this.url.list(), role);
    }

    get(roleId: string) {
        return this.requestService.get<Response<Role>>(this.url.item(roleId))
    }
    update(role: Role) {
        return this.requestService.put<Role, ResponseBase>(this.url.item(role.Id), role);
    }
    delete(roleId: string) {
        return this.requestService.delete<ResponseBase>(this.url.item(roleId));
    }

    getUserList(roleId: string, index: number = 1, size: number = 100) {
        let query = this.getQueryString(index, size);
        return this.requestService.get<Response<PagedList<User>>>(this.url.user_list(roleId) + query);
    }

    getUser(roleId: string, userId: string) {
        return this.requestService.get<Response<Role>>(this.url.user_item(roleId, userId));
    }


}