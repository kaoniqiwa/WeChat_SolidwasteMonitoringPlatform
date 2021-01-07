import { HowellAuthHttp } from "./howell-auth-http";
import { RoleRequestService } from "./role-service";
import { UserRequestService } from "./user.service";

export class Client {

    constructor(private requestService: HowellAuthHttp) {

    }


    private _user?: UserRequestService;
    get User(): UserRequestService {
        if (!this._user) {
            this._user = new UserRequestService(this.requestService);
        }
        return this._user;
    }
    private _role?: RoleRequestService;
    get Role(): RoleRequestService {
        if (!this._role) {
            this._role = new RoleRequestService(this.requestService);
        }
        return this._role;
    }   

}