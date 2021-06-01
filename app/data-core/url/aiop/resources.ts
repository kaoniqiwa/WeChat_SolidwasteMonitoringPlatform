import { IUrl, BaseUrl } from "../IUrl";

export class Resource extends BaseUrl implements IUrl {
  create(): string {
    return this.gateway + 'Resources';
  }
  edit(id: string): string {
    return this.gateway + `Resources/${id}`;
  }
  del(id: string): string {
    return this.gateway + `Resources/${id}`;
  }
  get(id: string): string {
    return this.gateway + `Resources/${id}`;
  }
  list(): string {
    return this.gateway + 'Resources/List';
  }
}

export class MediumPicture extends BaseUrl {

  add() {
    return this.gateway + `Pictures`;
  }

  binary() {
    return this.gateway + 'Pictures/Binary';
  }

  picture() {
    return this.gateway + `Pictures`;
  }

  getData(id: string, serverId: string) {
    return this.gateway + `Pictures/${id}/Data?ServerId=${serverId}`;
  }

  getJPG(id: string, serverId: string) {
    return this.gateway + `Pictures/${id}.jpg?ServerId=${serverId}`;
  }


}




export class ResourceEncodeDevice extends BaseUrl implements IUrl {
  create(): string {
    return this.gateway + 'Resources/EncodeDevices';
  }
  edit(devId: string): string {
    return this.gateway + `Resources/EncodeDevices/${devId}`;
  }
  del(devId: string): string {
    return this.gateway + `Resources/EncodeDevices/${devId}`;
  }
  get(devId: string): string {
    return this.gateway + `Resources/EncodeDevices/${devId}`;
  }
  list(): string {
    return this.gateway + 'Resources/EncodeDevices/List';
  }

  protocol() {
    return this.gateway + 'Resources/EncodeDevices/Protocols';
  }

}

export class ResourceCamera extends BaseUrl implements IUrl {
  create(): string {
    return this.gateway + 'Resources/Cameras';
  }
  edit(id: string): string {
    return this.gateway + `Resources/Cameras/${id}`;
  }
  del(id: string): string {
    return this.gateway + `Resources/Cameras/${id}`;
  }
  get(id: string): string {
    return this.gateway + `Resources/Cameras/${id}`;
  }
  list(): string {
    return this.gateway + 'Resources/Cameras/List';
  }


}

export class ResourceCameraAIModel extends BaseUrl implements IUrl {
  create(cameraId: string, modelId: string): string {
    return this.gateway + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  edit(cameraId: string, modelId: string): string {
    return ``;
  }
  del(cameraId: string, modelId: string): string {
    return this.gateway + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  get(cameraId: string, modelId: string): string {
    return this.gateway + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  list(cameraId: string): string {
    return this.gateway + `Resources/Cameras/${cameraId}/AIModels`;
  }
  copy(cameraId: string) {
    return this.gateway + `Resources/Cameras/${cameraId}/AIModels/CopyTo`;
  }

}

export class Label extends BaseUrl implements IUrl {
  create(): string {
    return this.gateway + 'Resources/Labels';
  }
  edit(id: string): string {
    return this.gateway + `Resources/Labels/${id}`;
  }
  del(id: string): string {
    return this.gateway + `Resources/Labels/${id}`;
  }
  get(id: string): string {
    return this.gateway + `Resources/Labels/${id}`;
  }
  list(): string {
    return this.gateway + 'Resources/Labels/List';
  }

}

export class ResourceLabel extends BaseUrl implements IUrl {
  create(sourceId: string, labelId: string): string {
    return this.gateway + `Resources/${sourceId}/Labels/${labelId}`;
  }
  edit(id: string): string {
    return ``;
  }
  del(sourceId: string, labelId: string): string {
    return this.gateway + `Resources/${sourceId}/Labels/${labelId}`;
  }
  get(sourceId: string, labelId: string): string {
    return this.gateway + `Resources/${sourceId}/Labels/${labelId}`;
  }
  list(id: string): string {
    return this.gateway + `Resources/${id}/Labels`;
  }

}