import { MediumPicture } from "../url/aiop/medium";
import { Mediume } from "../url/medium";
import { DivisionRequestService } from "./division.service";
import { CameraRequestService, GarbageStationRequestService } from "./garbage-station.service";
import { HowellAuthHttp } from "./howell-auth-http";
import { RoleRequestService } from "./role-service";
import { WeChatRequestService } from "./we-chat.service";

export class Service {

    constructor(private requestService: HowellAuthHttp) {

    }


    private _user?: WeChatRequestService;
    /** 用户信息服务 */
    get user(): WeChatRequestService {
        if (!this._user) {
            this._user = new WeChatRequestService(this.requestService);
        }
        return this._user;
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

    private _media?: Mediume;
    /** 媒体服务 */
    get media(): Mediume {
        if (!this._media) {
            this._media = new Mediume();
        }
        return this._media;
    }

}