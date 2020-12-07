 
import { SaveModel } from '../model/save-model';
import { GarbageStation, GetGarbageStationsParams } from '../model/waste-regulation/garbage-station';
import { Camera, GetGarbageStationCamerasParams } from '../model/waste-regulation/camera';
import { GetGarbageStationVolumesParams, GarbageVolume } from '../model/waste-regulation/garbage-volume';
import { TrashCan, GetGarbageStationTrashCansParams } from '../model/waste-regulation/trashCan';
import * as url from '../url/waste-regulation/garbage-station';
import { PagedList } from '../model/page'; 
import { Response } from '../model/response';
import { HowellAuthHttp } from './howell-auth-http';
import { GetGarbageStationnEventNumbersParams, EventNumberStatistic } from '../model/waste-regulation/division-event-numbers';
import {
    GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams
} from '../model/waste-regulation/garbage-station-number-statistic';
import { GarbageStationType } from "../model/waste-regulation/garbage-station-type";

export class GarbageStationRequestService extends SaveModel {
    url: url.GarbageStations;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.GarbageStations();
    }
    create(item: GarbageStation) {
        return this.requestService.post<GarbageStation,
            Response<GarbageStation>>(this.url.create(), this.toModel(item, this.formMustField.garbageStation));
    }

    get(id: string) {
        return this.requestService.get<GarbageStation>(this.url.get(id));
    }

    set(item: GarbageStation) {
        return this.requestService.put<GarbageStation,
            Response<GarbageStation>>(this.url.edit(item.Id), this.toModel(item, this.formMustField.garbageStation));
    }

    del(id: string) {
        return this.requestService.delete<GarbageStation>(this.url.del(id));
    }

    list(item: GetGarbageStationsParams) {
        return this.requestService.post<GetGarbageStationsParams, Response<PagedList<GarbageStation>>>(this.url.list(), item);
    }

    volumesHistory(item: GetGarbageStationVolumesParams, divisionsId: string) {
        return this.requestService.post<GetGarbageStationVolumesParams,
            Response<PagedList<GarbageVolume>>>(this.url.volumesHistory(divisionsId), item);
    }

    eventNumbersHistory(item: GetGarbageStationnEventNumbersParams, divisionsId: string) {
        return this.requestService.post<GetGarbageStationnEventNumbersParams,
            Response<PagedList<EventNumberStatistic>>>(this.url.eventNumbersHistory(divisionsId), item);
    }

    statisticNumber(divisionsId: string) {
        return this.requestService.get<GarbageStationNumberStatistic>(this.url.statisticNumber(divisionsId));
    }

    statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
        return this.requestService.post<GetGarbageStationStatisticNumbersParams,
            Response<PagedList<GarbageStationNumberStatistic>>>(this.url.statisticNumberList(), item);
    }
}

 
export class CameraRequestService extends SaveModel {
    url: url.Camera;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Camera();
    }
    create(item: Camera) {
        return this.requestService.post<Camera, Response<Camera>>(this.url.create(item.GarbageStationId), item);
    }

    get(garbageStationId: string, cameraId: string) {
        return this.requestService.get<Camera>(this.url.get(garbageStationId, cameraId));
    }

    list(garbageStationId: string) {
        return this.requestService.get<Response<Camera[]>>(this.url.create(garbageStationId));
    }

    set(item: Camera) {
        return this.requestService.put<Camera, Response<Camera>>(this.url.edit(item.GarbageStationId, item.Id), item);
    }

    del(garbageStationId: string, cameraId: string) {
        return this.requestService.delete<Camera>(this.url.del(garbageStationId, cameraId));
    }

    postList(item: GetGarbageStationCamerasParams) {
        return this.requestService.post<GetGarbageStationCamerasParams, Response<PagedList<Camera>>>(this.url.list(), item);
    }
}

 
export class CameraTrashCanRequestService extends SaveModel {
    url: url.CameraTrashCans;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.CameraTrashCans();
    }
    create(item: TrashCan) {
        return this.requestService.post<TrashCan, Response<TrashCan>>(this.url.create(item.GarbageStationId, item.CameraId), item);
    }

    get(garbageStationId: string, cameraId: string, trashCanId: string) {
        return this.requestService.get<TrashCan>(this.url.get(garbageStationId, cameraId, trashCanId));
    }

    set(item: TrashCan) {
        return this.requestService.put<TrashCan, Response<TrashCan>>(this.url.edit(item.GarbageStationId, item.CameraId, item.Id), item);
    }

    del(garbageStationId: string, cameraId: string, trashCanId: string) {
        return this.requestService.delete<TrashCan>(this.url.del(garbageStationId, cameraId, trashCanId));
    }

    list(garbageStationId: string, cameraId: string) {
        return this.requestService.get<TrashCan[]>(this.url.list(garbageStationId, cameraId));
    }
}

 
export class GarbageStationTrashCanRequestService extends SaveModel {
    url: url.GarbageStationTrashCans;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.GarbageStationTrashCans();
    }
    create(item: TrashCan) {
        return this.requestService.post<TrashCan, Response<TrashCan>>(this.url.create(item.GarbageStationId), item);
    }

    get(garbageStationId: string, cameraId: string) {
        return this.requestService.get<TrashCan>(this.url.get(garbageStationId, cameraId));
    }

    set(item: TrashCan) {
        return this.requestService.put<TrashCan, Response<TrashCan>>(this.url.edit(item.GarbageStationId, item.Id), item);
    }

    del(garbageStationId: string, cameraId: string) {
        return this.requestService.delete<TrashCan>(this.url.del(garbageStationId, cameraId));
    }

    list(item: GetGarbageStationTrashCansParams) {
        return this.requestService.post<GetGarbageStationTrashCansParams, Response<PagedList<TrashCan>>>(this.url.postList(), item);
    }
}


 
export class GarbageStationTypeRequestService extends SaveModel {
    url: url.GarbageStationType;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.GarbageStationType();
    }
    create(item: GarbageStationType) {
        return this.requestService.post<GarbageStationType, Response<GarbageStationType>>(this.url.create(), this.toModel(item, this.formMustField.garbageStationType));
    }

    get(type: string) {
        return this.requestService.get<GarbageStationType>(this.url.get(type));
    }

    set(item: GarbageStationType) {
        return this.requestService.put<GarbageStationType, Response<GarbageStationType>>(this.url.edit(item.Type+''), this.toModel(item, this.formMustField.garbageStationType));
    }

    del(type:string) {
        return this.requestService.delete<GarbageStationType>(this.url.del(type));
    }

    list() {
        return this.requestService.get<GarbageStationType[]>(this.url.list());
    }
}
