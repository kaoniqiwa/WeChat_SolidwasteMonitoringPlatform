import { SaveModel } from '../model/save-model'
import {
  GarbageStation,
  GetGarbageStationsParams,
} from '../model/waste-regulation/garbage-station'
import {
  Camera,
  GetGarbageStationCamerasParams,
} from '../model/waste-regulation/camera'
import { GarbageVolume } from '../model/waste-regulation/garbage-volume'
import {
  TrashCan,
  GetGarbageStationTrashCansParams,
} from '../model/waste-regulation/trashCan'
import * as url from '../url/waste-regulation/garbage-station'
import { PagedList, PageTimeUnitParams } from '../model/page'
import { HowellResponse } from '../model/response'
import { HowellAuthHttp } from './howell-auth-http'
import { EventNumberStatistic } from '../model/waste-regulation/division-event-numbers'
import {
  GarbageStationGarbageCountStatistic,
  GarbageStationNumberStatistic,
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticGarbageCountsParams,
  GetGarbageStationStatisticNumbersParams,
  GetGarbageStationStatisticNumbersParamsV2,
} from '../model/waste-regulation/garbage-station-number-statistic'
import { GarbageStationType } from '../model/waste-regulation/garbage-station-type'
import { plainToClass } from 'class-transformer'

export class GarbageStationRequestService extends SaveModel {
  url: url.GarbageStations
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.GarbageStations()
  }
  async create(item: GarbageStation) {
    let response = await this.requestService.post<
      GarbageStation,
      HowellResponse<GarbageStation>
    >(this.url.create(), this.toModel(item, this.formMustField.garbageStation))
    let result = plainToClass(GarbageStation, response.Data)
    return result
  }

  async get(id: string) {
    let response = await this.requestService.get<
      HowellResponse<GarbageStation>
    >(this.url.get(id))
    let result = plainToClass(GarbageStation, response.Data)
    return result
  }

  async set(item: GarbageStation) {
    let response = await this.requestService.put<
      GarbageStation,
      HowellResponse<GarbageStation>
    >(
      this.url.edit(item.Id),
      this.toModel(item, this.formMustField.garbageStation)
    )
    let result = plainToClass(GarbageStation, response.Data)
    return result
  }

  async del(id: string) {
    let response = await this.requestService.delete<
      HowellResponse<GarbageStation>
    >(this.url.del(id))
    let result = plainToClass(GarbageStation, response.Data)
    return result
  }

  async list(item: GetGarbageStationsParams) {
    let response = await this.requestService.post<
      GetGarbageStationsParams,
      HowellResponse<PagedList<GarbageStation>>
    >(this.url.list(), item)
    response.Data.Data = plainToClass(GarbageStation, response.Data.Data)
    return response.Data
  }

  async volumesHistory(item: PageTimeUnitParams, id: string) {
    let response = await this.requestService.post<
      PageTimeUnitParams,
      HowellResponse<PagedList<GarbageVolume>>
    >(this.url.volumesHistory(id), item)
    response.Data.Data = plainToClass(GarbageVolume, response.Data.Data)
    return response.Data
  }

  async eventNumbersHistory(item: PageTimeUnitParams, id: string) {
    let response = await this.requestService.post<
      PageTimeUnitParams,
      HowellResponse<PagedList<EventNumberStatistic>>
    >(this.url.eventNumbersHistory(id), item)
    response.Data.Data = plainToClass(EventNumberStatistic, response.Data.Data)
    return response.Data
  }

  async statisticNumber(id: string) {
    let response = await this.requestService.get<
      HowellResponse<GarbageStationNumberStatistic>
    >(this.url.statisticNumber(id))
    let result = plainToClass(GarbageStationNumberStatistic, response.Data)
    return result
  }

  async statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
    let response = await this.requestService.post<
      GetGarbageStationStatisticNumbersParams,
      HowellResponse<PagedList<GarbageStationNumberStatistic>>
    >(this.url.statisticNumberList(), item)
    response.Data.Data = plainToClass(
      GarbageStationNumberStatistic,
      response.Data.Data
    )
    return response.Data
  }

  async statisticNumberHistoryList(
    params: GetGarbageStationStatisticNumbersParamsV2
  ) {
    let response = await this.requestService.post<
      GetGarbageStationStatisticNumbersParamsV2,
      HowellResponse<Array<GarbageStationNumberStatisticV2>>
    >(this.url.statisticNumberHistoryList(), params)
    return plainToClass(GarbageStationNumberStatisticV2, response.Data)
  }
  async statisticGarbageCountHistoryList(
    params: GetGarbageStationStatisticGarbageCountsParams
  ) {
    let response = await this.requestService.post<
      GetGarbageStationStatisticGarbageCountsParams,
      HowellResponse<Array<GarbageStationGarbageCountStatistic>>
    >(this.url.statisticGarbageCountHistoryList(), params)
    return plainToClass(GarbageStationGarbageCountStatistic, response.Data)
  }
}

export class CameraRequestService extends SaveModel {
  url: url.Camera
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.Camera()
  }
  async create(item: Camera) {
    let response = await this.requestService.post<
      Camera,
      HowellResponse<Camera>
    >(this.url.create(item.GarbageStationId), item)
    return plainToClass(Camera, response.Data)
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService.get<HowellResponse<Camera>>(
      this.url.get(garbageStationId, cameraId)
    )
    return plainToClass(Camera, response.Data)
  }

  async list(garbageStationId: string) {
    let response = await this.requestService.get<HowellResponse<Camera[]>>(
      this.url.create(garbageStationId)
    )
    return plainToClass(Camera, response.Data)
  }

  async set(item: Camera) {
    let response = await this.requestService.put<
      Camera,
      HowellResponse<Camera>
    >(this.url.edit(item.GarbageStationId, item.Id), item)
    return plainToClass(Camera, response.Data)
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService.delete<HowellResponse<Camera>>(
      this.url.del(garbageStationId, cameraId)
    )
    return plainToClass(Camera, response.Data)
  }

  async postList(item: GetGarbageStationCamerasParams) {
    let response = await this.requestService.post<
      GetGarbageStationCamerasParams,
      HowellResponse<PagedList<Camera>>
    >(this.url.list(), item)
    response.Data.Data = plainToClass(Camera, response.Data.Data)
    return response.Data
  }
}

export class CameraTrashCanRequestService extends SaveModel {
  url: url.CameraTrashCans
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.CameraTrashCans()
  }
  async create(item: TrashCan) {
    if (!item.CameraId) {
      throw new Error('cameraId is undefined')
    }
    let response = await this.requestService.post<
      TrashCan,
      HowellResponse<TrashCan>
    >(this.url.create(item.GarbageStationId, item.CameraId), item)
    return plainToClass(TrashCan, response.Data)
  }

  async get(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService.get<HowellResponse<TrashCan>>(
      this.url.get(garbageStationId, cameraId, trashCanId)
    )
    return plainToClass(TrashCan, response.Data)
  }

  async set(item: TrashCan) {
    if (!item.CameraId) {
      throw new Error('cameraId is undefined')
    }
    let response = await this.requestService.put<
      TrashCan,
      HowellResponse<TrashCan>
    >(this.url.edit(item.GarbageStationId, item.CameraId, item.Id), item)
    return plainToClass(TrashCan, response.Data)
  }

  async del(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService.delete<HowellResponse<TrashCan>>(
      this.url.del(garbageStationId, cameraId, trashCanId)
    )
    return plainToClass(TrashCan, response.Data)
  }

  async list(garbageStationId: string, cameraId: string) {
    let response = await this.requestService.get<HowellResponse<TrashCan[]>>(
      this.url.list(garbageStationId, cameraId)
    )
    return plainToClass(TrashCan, response.Data)
  }
}

export class GarbageStationTrashCanRequestService extends SaveModel {
  url: url.GarbageStationTrashCans
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.GarbageStationTrashCans()
  }
  async create(item: TrashCan) {
    let response = await this.requestService.post<
      TrashCan,
      HowellResponse<TrashCan>
    >(this.url.create(item.GarbageStationId), item)
    return plainToClass(TrashCan, response.Data)
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService.get<HowellResponse<TrashCan>>(
      this.url.get(garbageStationId, cameraId)
    )
    return plainToClass(TrashCan, response.Data)
  }

  async set(item: TrashCan) {
    let response = await this.requestService.put<
      TrashCan,
      HowellResponse<TrashCan>
    >(this.url.edit(item.GarbageStationId, item.Id), item)
    return plainToClass(TrashCan, response.Data)
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService.delete<HowellResponse<TrashCan>>(
      this.url.del(garbageStationId, cameraId)
    )
    return plainToClass(TrashCan, response.Data)
  }

  async list(item: GetGarbageStationTrashCansParams) {
    let response = await this.requestService.post<
      GetGarbageStationTrashCansParams,
      HowellResponse<PagedList<TrashCan>>
    >(this.url.postList(), item)
    return plainToClass(TrashCan, response.Data)
  }
}

export class GarbageStationTypeRequestService extends SaveModel {
  url: url.GarbageStationType
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.GarbageStationType()
  }
  async create(item: GarbageStationType) {
    let response = await this.requestService.post<
      GarbageStationType,
      HowellResponse<GarbageStationType>
    >(
      this.url.create(),
      this.toModel(item, this.formMustField.garbageStationType)
    )
    return plainToClass(GarbageStationType, response.Data)
  }

  async get(type: string) {
    let response = await this.requestService.get<
      HowellResponse<GarbageStationType>
    >(this.url.get(type))
    return plainToClass(GarbageStationType, response.Data)
  }

  async set(item: GarbageStationType) {
    let response = await this.requestService.put<
      GarbageStationType,
      HowellResponse<GarbageStationType>
    >(
      this.url.edit(item.Type + ''),
      this.toModel(item, this.formMustField.garbageStationType)
    )
    return plainToClass(GarbageStationType, response.Data)
  }

  async del(type: string) {
    let response = await this.requestService.delete<
      HowellResponse<GarbageStationType>
    >(this.url.del(type))
    return plainToClass(GarbageStationType, response.Data)
  }

  async list() {
    let response = await this.requestService.get<
      HowellResponse<GarbageStationType[]>
    >(this.url.list())
    return plainToClass(GarbageStationType, response.Data)
  }
}
