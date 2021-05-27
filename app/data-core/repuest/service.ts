import { DivisionRequestService } from "./division.service";
import { CameraRequestService, GarbageStationRequestService } from "./garbage-station.service";
import { HowellAuthHttp } from "./howell-auth-http";
import { EventRequestService } from "./event-record";
import { RoleRequestService } from "./role-service";
import { UserRequestService } from "./user.service";
import { WeChatRequestService } from "./we-chat.service";
import { SRServersRequestService } from "./sr-service";
import { ServerRequestService } from "./servers.service";
import { SessionUser } from "../../common/session-user";

export class Service {
    session:SessionUser;
    constructor(private requestService: HowellAuthHttp) {
        this.session = new SessionUser();
    }

    private _user?: UserRequestService;
    get user(): UserRequestService {
        if (!this._user) {
            this._user = new UserRequestService(this.requestService);
        }
        return this._user;
    }

    private _wechat?: WeChatRequestService;
    /** 用户信息服务 */
    get wechat(): WeChatRequestService {
        if (!this._wechat) {
            this._wechat = new WeChatRequestService(this.requestService);
        }
        return this._wechat;
    }
    /** 角色信息服务 */
    private _role?: RoleRequestService;
    get role(): RoleRequestService {
        if (!this._role) {
            this._role = new RoleRequestService(this.requestService);
        }
        return this._role;
    }


    private _garbageStation?: GarbageStationRequestService;
    /** 垃圾厢房服务 */
    get garbageStation() {
        if (!this._garbageStation) {
            this._garbageStation = new GarbageStationRequestService(this.requestService);
        }
        return this._garbageStation;
    }
    // 
    private _division?: DivisionRequestService;
    /** 区划信息服务 */
    get division() {
        if (!this._division) {
            this._division = new DivisionRequestService(this.requestService);
        }
        return this._division;
    }

    private _camera?: CameraRequestService;
    /** 摄像机信息服务 */
    get camera() {
        if (!this._camera) {
            this._camera = new CameraRequestService(this.requestService);
        }
        return this._camera;
    }
    private _event?: EventRequestService;
    get event(): EventRequestService {
        if (!this._event) {
            this._event = new EventRequestService(this.requestService);
        }
        return this._event;
    }

    private _sr?:SRServersRequestService;
    get sr():SRServersRequestService{
        if(!this._sr)
        {
            this._sr = new SRServersRequestService(this.requestService);
        }
        return this._sr;
    }

    private _server?: ServerRequestService;
    get server(): ServerRequestService {
        if (!this._server) {
            this._server = new ServerRequestService(this.requestService);
        }
        return this._server;
    }

    
    
    picture(id:string)  {
        return this.server.Pictures(this.session.WUser.ServerId!, id)
    }

}