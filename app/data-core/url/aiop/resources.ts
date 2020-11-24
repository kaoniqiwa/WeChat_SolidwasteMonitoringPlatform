import { IUrl, BaseUrl } from "../IUrl";

export class Resource extends BaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'Resources';
    }
    edit(id: string): string {
        return this.aiop + `Resources/${id}`;
    }
    del(id: string): string {
        return this.aiop + `Resources/${id}`;
    }
    get(id: string): string {
        return this.aiop + `Resources/${id}`;
    }
    list(): string {
        return this.aiop + 'Resources/List';
    }

}

export class MediumPicture extends BaseUrl{

    add() {
        return this.aiop + `Medium/Pictures`;
    }

    binary() {
        return this.aiop + 'Medium/Pictures/Binary';
    }


    getData(id: string) {
        return this.aiop + `Medium/Pictures/${id}/Data`;
    }

    getJPG(id: string) {
        return this.aiop + `Medium/Pictures/${id}.jpg`;
    }


}




export class ResourceEncodeDevice extends BaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'Resources/EncodeDevices';
    }
    edit(devId: string): string {
        return this.aiop + `Resources/EncodeDevices/${devId}`;
    }
    del(devId: string): string {
        return this.aiop + `Resources/EncodeDevices/${devId}`;
    }
    get(devId: string): string {
        return this.aiop + `Resources/EncodeDevices/${devId}`;
    }
    list(): string {
        return this.aiop + 'Resources/EncodeDevices/List';
    }

    protocol() {
        return this.aiop + 'Resources/EncodeDevices/Protocols';
    }

}

export class ResourceCamera extends BaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'Resources/Cameras';
    }
    edit(id: string): string {
        return this.aiop + `Resources/Cameras/${id}`;
    }
    del(id: string): string {
        return this.aiop + `Resources/Cameras/${id}`;
    }
    get(id: string): string {
        return this.aiop + `Resources/Cameras/${id}`;
    }
    list(): string {
        return this.aiop + 'Resources/Cameras/List';
    }


}

export class ResourceCameraAIModel extends BaseUrl implements IUrl {
    create(cameraId: string, modelId: string): string {
        return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    edit(cameraId: string, modelId: string): string {
        return ``;
    }
    del(cameraId: string, modelId: string): string {
        return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    get(cameraId: string, modelId: string): string {
        return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    list(cameraId: string): string {
        return this.aiop + `Resources/Cameras/${cameraId}/AIModels`;
    }
    copy(cameraId: string) {
        return this.aiop + `Resources/Cameras/${cameraId}/AIModels/CopyTo`;
    }

}

export class Label extends BaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'Resources/Labels';
    }
    edit(id: string): string {
        return this.aiop + `Resources/Labels/${id}`;
    }
    del(id: string): string {
        return this.aiop + `Resources/Labels/${id}`;
    }
    get(id: string): string {
        return this.aiop + `Resources/Labels/${id}`;
    }
    list(): string {
        return this.aiop + 'Resources/Labels/List';
    }

}

export class ResourceLabel extends BaseUrl implements IUrl {
    create(sourceId: string, labelId: string): string {
        return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
    }
    edit(id: string): string {
        return ``;
    }
    del(sourceId: string, labelId: string): string {
        return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
    }
    get(sourceId: string, labelId: string): string {
        return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
    }
    list(id: string): string {
        return this.aiop + `Resources/${id}/Labels`;
    }

}