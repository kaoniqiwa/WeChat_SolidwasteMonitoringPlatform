import { IUrl, GarbageBaseUrl } from '../IUrl';

export class GarbageStations extends GarbageBaseUrl implements IUrl {
    garbagestations = 'garbage_management/';
    create(): string {
        return this.gateway + 'GarbageStations';
    }
    edit(id: string): string {
        return this.gateway + `GarbageStations/${id}`;
    }
    del(id: string): string {
        return this.gateway + `GarbageStations/${id}`;
    }
    get(id: string): string {
        return this.gateway + `GarbageStations/${id}`;
    }
    list(): string {
        return this.gateway + `GarbageStations/List`;
    }

    volumesHistory(id: string): string {
        return this.gateway + `GarbageStations/${id}/Volumes/History/List`;
    }

    eventNumbersHistory(id: string): string {
        return this.gateway + `GarbageStations/${id}/EventNumbers/History/List`;
    }

    statisticNumber(id: string): string {
        return this.gateway + `GarbageStations/${id}/Statistic/Number`;
    }

    statisticNumberList(): string {
        return this.gateway + `GarbageStations/Statistic/Number/List`;
    }
    statisticNumberHistoryList():string{
        return this.gateway + `GarbageStations/Statistic/Number/History/List`
    }
    statisticGarbageCountHistoryList():string{
        return this.gateway + `GarbageStations/Statistic/GarbageCount/History/List`;
    }
}

export class Camera extends GarbageBaseUrl implements IUrl {
    create(stationId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras`;
    }
    edit(stationId: string, cameraId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    del(stationId: string, cameraId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    get(stationId: string, cameraId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    list(): string {
        return this.gateway + `GarbageStations/Cameras/List`;
    }
}

export class CameraTrashCans extends GarbageBaseUrl implements IUrl {
    create(stationId: string, cameraId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`;
    }
    edit(stationId: string, cameraId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    del(stationId: string, cameraId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    get(stationId: string, cameraId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    list(stationId: string, cameraId: string): string {
        return this.gateway + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`;
    }
}

export class GarbageStationTrashCans extends GarbageBaseUrl implements IUrl {
    create(stationId: string): string {
        return this.gateway + `GarbageStations/${stationId}/TrashCans`;
    }
    edit(stationId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    del(stationId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    get(stationId: string, trashCansId: string): string {
        return this.gateway + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    postList(): string {
        return this.gateway + `GarbageStations/TrashCans/List`;
    }
    list(stationId: string): string {
        return this.gateway + `GarbageStations/${stationId}/TrashCans`;
    }
}

export class GarbageStationType  extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.gateway + 'GarbageStations/Types';
    }
    edit(id: string): string {
        return this.gateway + `GarbageStations/Types/${id}`;
    }
    del(id: string): string {
        return this.gateway + `GarbageStations/Types/${id}`;
    }
    get(id: string): string {
        return this.gateway + `GarbageStations/Types/${id}`;
    }
    list(){
        return this.gateway + 'GarbageStations/Types';
    }
}
