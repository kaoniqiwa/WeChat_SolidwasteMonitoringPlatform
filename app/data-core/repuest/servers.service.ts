import { PagedList } from "../model/page";
import { Response } from "../model/response";
import { GetDivisionsParams, GetGarbageStationsParams, GetServersParams, Server } from "../model/server";
import { Division } from "../model/waste-regulation/division";
import { GarbageStation } from "../model/waste-regulation/garbage-station";
import { ServersUrl } from "../url/waste-regulation/url-servers";
import { HowellAuthHttp } from "./howell-auth-http";

export class ServerRequestService {

    constructor(private requestService: HowellAuthHttp) { 
        
    }

    Create(server: Server) {
        return this.requestService.post<Server, Response<Server>>(ServersUrl.create(), server);
    }
    Put(server: Server) {
        return this.requestService.put<Server, Response<Server>>(ServersUrl.create(), server);
    }
    Get(serverId: string) {
        return this.requestService.get<Response<Server>>(ServersUrl.item(serverId));
    }
    Delete(serverId: string) {
        return this.requestService.delete<Response<Server>>(ServersUrl.item(serverId));
    }
    List(params: GetServersParams) {
        return this.requestService.post<GetServersParams, Response<PagedList<Server>>>(ServersUrl.list(), params);
    }
    Sync(serverId: string) {
        return this.requestService.post<Response<string>>(ServersUrl.sync(serverId));
    }
    Divisions(serverId: string, params: GetDivisionsParams) {
        return this.requestService.post<GetDivisionsParams, Response<Division>>(ServersUrl.divisions(serverId), params);
    }
    GarbageStations(serverId: string, params: GetGarbageStationsParams) {
        return this.requestService.post<GetDivisionsParams, Response<GarbageStation>>(ServersUrl.garbageStations(serverId), params);
    }
    Pictures(serviceId: string, pictureId: string) {
        return ServersUrl.pictures(serviceId, pictureId);
    }
}