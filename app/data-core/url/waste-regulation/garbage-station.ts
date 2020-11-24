import { IUrl, GarbageBaseUrl } from '../IUrl';

export class GarbageStations extends GarbageBaseUrl implements IUrl {
    garbagestations = 'garbage_management/';
    create(): string {
        return this.aiop + 'GarbageStations';
    }
    edit(id: string): string {
        return this.aiop + `GarbageStations/${id}`;
    }
    del(id: string): string {
        return this.aiop + `GarbageStations/${id}`;
    }
    get(id: string): string {
        return this.aiop + `GarbageStations/${id}`;
    }
    list(): string {
        return this.aiop + `GarbageStations/List`;
    }

    volumesHistory(id: string): string {
        return this.aiop + `GarbageStations/${id}/Volumes/History/List`;
    }

    eventNumbersHistory(id: string): string {
        return this.aiop + `GarbageStations/${id}/EventNumbers/History/List`;
    }

    statisticNumber(id: string): string {
        return this.aiop + `GarbageStations/${id}/Statistic/Number`;
    }

    statisticNumberList(): string {
        return this.aiop + `GarbageStations/Statistic/Number/List`;
    }
}

export class Camera extends GarbageBaseUrl implements IUrl {
    create(stationId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras`;
    }
    edit(stationId: string, cameraId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    del(stationId: string, cameraId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    get(stationId: string, cameraId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}`;
    }
    list(): string {
        return this.aiop + `GarbageStations/Cameras/List`;
    }
}

export class CameraTrashCans extends GarbageBaseUrl implements IUrl {
    create(stationId: string, cameraId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`;
    }
    edit(stationId: string, cameraId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    del(stationId: string, cameraId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    get(stationId: string, cameraId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`;
    }
    list(stationId: string, cameraId: string): string {
        return this.aiop + `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`;
    }
}

export class GarbageStationTrashCans extends GarbageBaseUrl implements IUrl {
    create(stationId: string): string {
        return this.aiop + `GarbageStations/${stationId}/TrashCans`;
    }
    edit(stationId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    del(stationId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    get(stationId: string, trashCansId: string): string {
        return this.aiop + `GarbageStations/${stationId}/TrashCans/${trashCansId}`;
    }
    postList(): string {
        return this.aiop + `GarbageStations/TrashCans/List`;
    }
    list(stationId: string): string {
        return this.aiop + `GarbageStations/${stationId}/TrashCans`;
    }
}

export class GarbageStationType  extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'GarbageStations/Types';
    }
    edit(id: string): string {
        return this.aiop + `GarbageStations/Types/${id}`;
    }
    del(id: string): string {
        return this.aiop + `GarbageStations/Types/${id}`;
    }
    get(id: string): string {
        return this.aiop + `GarbageStations/Types/${id}`;
    }
    list(){
        return this.aiop + 'GarbageStations/Types';
    }
}
