import { PagedList } from "../model/page";
import { ResponseBase, Response } from "../model/response";
import { SaveModel } from "../model/save-model";
import { Role, User } from "../model/user-stystem";
import * as url from "../url/user-url";
import { HowellAuthHttp } from "./howell-auth-http";

export class UserRequestService extends SaveModel {
    url: url.User;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.User();
    }

    list(index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        return this.requestService.get<Response<PagedList<User>>>(this.url.list() + query);
    }
    create(user: User) {
        return this.requestService.post<User, ResponseBase>(this.url.list(), user);
    }

    get(userId: string) {
        return this.requestService.get<Response<User>>(this.url.item(userId))
    }
    update(user: User) {
        return this.requestService.put<User, ResponseBase>(this.url.item(user.Id), user);
    }
    delete(userId: string) {
        return this.requestService.delete<ResponseBase>(this.url.item(userId));
    }

    getRoleList(userId:string, index: number = 1, size: number = 100) {
        let query = `?PageIndex=${index}&PageSize=${size}`;
        return this.requestService.get<Response<PagedList<Role>>>(this.url.roles_list(userId) + query);
    }

    getRole(userId:string, roleId:string)
    {
        return this.requestService.get<Response<Role>>(this.url.roles_item(userId, roleId));
    }


}