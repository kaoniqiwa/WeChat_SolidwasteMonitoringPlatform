import { PagedList } from '../model/page'
import { HowellResponse } from '../model/response'
import {
  GetDivisionsParams,
  GetGarbageStationsParams,
  GetServersParams,
  Server,
} from '../model/server'
import { Division } from '../model/waste-regulation/division'
import { GarbageStation } from '../model/waste-regulation/garbage-station'
import { ServersUrl } from '../url/waste-regulation/url-servers'
import { HowellAuthHttp } from './howell-auth-http'

export class ServerRequestService {
  constructor(private requestService: HowellAuthHttp) {}

  Create(server: Server) {
    return this.requestService.post<Server, HowellResponse<Server>>(
      ServersUrl.create(),
      server
    )
  }
  Put(server: Server) {
    return this.requestService.put<Server, HowellResponse<Server>>(
      ServersUrl.create(),
      server
    )
  }
  Get(serverId: string) {
    return this.requestService.get<HowellResponse<Server>>(
      ServersUrl.item(serverId)
    )
  }
  Delete(serverId: string) {
    return this.requestService.delete<HowellResponse<Server>>(
      ServersUrl.item(serverId)
    )
  }
  List(params: GetServersParams) {
    return this.requestService.post<
      GetServersParams,
      HowellResponse<PagedList<Server>>
    >(ServersUrl.list(), params)
  }
  Sync(serverId: string) {
    return this.requestService.post<HowellResponse<string>>(
      ServersUrl.sync(serverId)
    )
  }
  Divisions(serverId: string, params: GetDivisionsParams) {
    return this.requestService.post<
      GetDivisionsParams,
      HowellResponse<Division>
    >(ServersUrl.divisions(serverId), params)
  }
  GarbageStations(serverId: string, params: GetGarbageStationsParams) {
    return this.requestService.post<
      GetDivisionsParams,
      HowellResponse<GarbageStation>
    >(ServersUrl.garbageStations(serverId), params)
  }
  Pictures(serviceId: string, pictureId: string) {
    return ServersUrl.pictures(serviceId, pictureId)
  }
}
