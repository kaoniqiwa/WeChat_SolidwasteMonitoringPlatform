 
import { Resource as ResourceModel } from '../model/aiop/resource';
import { EncodeDevice as EncodeDeviceModel } from '../model/aiop/encode-device';
import { ResourceLabel as ResourceLabelModel } from '../model/aiop/resource-label';
import { GetEncodeDevicesParams, GetCamerasParams } from '../model/aiop/encode-devices-params';
import { Protocol } from '../model/aiop/protocol';
import { Camera as CameraModel } from '../model/aiop/camera';
import { CameraAIModel } from '../model/aiop/camera-ai-model';
import * as url from '../url/aiop/resources';
import { PagedList } from '../model/page';
import { Response } from '../model/Response';
import { GetResourcesParams } from '../model/aiop/resources-params';
import { GetResourceLabelsParams } from '../model/aiop/resource-labels-params';
import { SaveModel } from '../model/save-model';
import { BatchCopyRequest } from '../model/aiop/ai-models-params';
import { BatchResult } from '../model/batch';
import { HowellAuthHttp } from './howell-auth-http';
import { SRService } from '../url/aiop/sr-server';
import { GetPreviewUrlParams, GetVodUrlParams, VideoUrl } from '../model/aiop/video-url';
import { SessionUser } from '../../common/session-user';
 
export class ResourceRequestService extends SaveModel {
    url: url.Resource;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Resource();
    }
    create(item: ResourceModel) {

        return this.requestService.post<ResourceModel, ResourceModel>(this.url.create(), this.toModel(item, this.formMustField.resource));
    }

    get(id: string) {
        return this.requestService.get<ResourceModel>(this.url.get(id));
    }

    set(item: ResourceModel) {
        return this.requestService.put<ResourceModel,
            ResourceModel>(this.url.edit(item.Id), this.toModel(item, this.formMustField.resource));
    }

    del(id: string) {
        return this.requestService.delete<ResourceModel>(this.url.del(id));
    }

    list(item: GetResourcesParams) {
        return this.requestService.post<GetResourcesParams, Response<PagedList<ResourceModel>>>(this.url.list(), item);
    }
}

 
export class EncodeDeviceRequestService extends SaveModel {
    url: url.ResourceEncodeDevice;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.ResourceEncodeDevice();
    }
    create(item: EncodeDeviceModel) {

        return this.requestService.post<EncodeDeviceModel,
            Response<EncodeDeviceModel>>(this.url.create(), this.toModel(item, this.formMustField.encodeDevice));
    }

    get(id: string) {
        return this.requestService.get<EncodeDeviceModel>(this.url.get(id));
    }

    set(item: EncodeDeviceModel) {
        return this.requestService.put<EncodeDeviceModel,
            Response<EncodeDeviceModel>>(this.url.edit(item.Id), this.toModel(item, this.formMustField.encodeDevice));
    }

    del(id: string) {
        return this.requestService.delete<EncodeDeviceModel>(this.url.del(id));
    }

    list(item: GetEncodeDevicesParams) {
        return this.requestService.post<GetEncodeDevicesParams, Response<PagedList<EncodeDeviceModel>>>(this.url.list(), item);
    }

    protocol() {
        return this.requestService.get<Protocol[]>(this.url.protocol());
    }
}
 
export class CameraRequestService extends SaveModel {
    url: url.ResourceCamera;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.ResourceCamera();
    }
    create(item: CameraModel) {
        return this.requestService.post<CameraModel,
            Response<CameraModel>>(this.url.create(), this.toModel(item, this.formMustField.camera));
    }

    get(id: string) {
        return this.requestService.get<CameraModel>(this.url.get(id));
    }

    set(item: CameraModel) {
        return this.requestService.put<CameraModel,
            Response<CameraModel>>(this.url.edit(item.Id), this.toModel(item, this.formMustField.camera));
    }

    del(id: string) {
        return this.requestService.delete<CameraModel>(this.url.del(id));
    }

    list(item: GetCamerasParams) {
        return this.requestService.post<GetCamerasParams, Response<PagedList<CameraModel>>>(this.url.list(), item);
    }

}

 
export class AIModelRequestService {
    url: url.ResourceCameraAIModel;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.ResourceCameraAIModel();
    }
    create(cameraId: string, aiModelId: string) {
        return this.requestService.post<CameraAIModel, Response<CameraAIModel>>(this.url.create(cameraId, aiModelId));
    }

    get(cameraId: string, aiModelId: string) {
        return this.requestService.get<CameraAIModel>(this.url.get(cameraId, aiModelId));
    }

    list(cameraId: string) {
        return this.requestService.get<CameraAIModel[]>(this.url.list(cameraId));
    }

    del(cameraId: string, aiModelId: string) {
        return this.requestService.delete<CameraAIModel>(this.url.del(cameraId, aiModelId));
    }

    copyTo(param: BatchCopyRequest, tagCameraId: string) {
        return this.requestService.post<BatchCopyRequest, Response<BatchResult>>(this.url.copy(tagCameraId), param);
    }

}

 
export class LabelRequestService {
    url: url.Label;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.Label();
    }
    create(item: ResourceLabelModel) {
        return this.requestService.post<ResourceLabelModel, Response<ResourceLabelModel>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.get<ResourceLabelModel>(this.url.get(id));
    }

    set(item: ResourceLabelModel) {
        return this.requestService.put<ResourceLabelModel, ResourceLabelModel>(this.url.edit(item.Id), item);
    }

    del(id: string) {
        return this.requestService.delete<ResourceLabelModel>(this.url.del(id));
    }

    list(item: GetResourceLabelsParams) {
        return this.requestService.post<GetResourceLabelsParams, Response<PagedList<ResourceLabelModel>>>(this.url.list(), item);
    }
}

 
export class ResourceLabelRequestService {
    url: url.ResourceLabel;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.ResourceLabel();
    }
    create(sourceId: string, labelId: string) {
        return this.requestService.post<ResourceLabelModel, Response<ResourceLabelModel>>(this.url.create(sourceId, labelId));
    }

    get(sourceId: string, labelId: string) {
        return this.requestService.get<ResourceLabelModel>(this.url.get(sourceId, labelId));
    }

    // list(sourceId:string){
    //     return this.requestService.get<ResourceLabelModel[]>>(this.url.list(sourceId));
    // }

    del(sourceId: string, labelId: string) {
        return this.requestService.delete<ResourceLabelModel>(this.url.del(sourceId, labelId));
    }
}

 
export class ResourceMediumRequestService {
    url: url.MediumPicture;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new url.MediumPicture();
        this.session = new SessionUser();
    }

     session:SessionUser;

    binary() {
        return this.url.binary();
    }

    getJPG(id: string) {
        
        return this.url.getJPG(id, this.session.WUser.ServerId);
    }
    getData(id: string) {
        return this.url.getData(id, this.session.WUser.ServerId);
    }

}

 
export class ResourceSRServersRequestService {
    url: SRService;
    constructor(private requestService: HowellAuthHttp) {
        this.url = new SRService();
    }

    PreviewUrls(params: GetPreviewUrlParams) {
        return this.requestService.post<VideoUrl>(this.url.preview(), params as any);
    }

    VodUrls(params: GetVodUrlParams) {
        return this.requestService.post<VideoUrl>(this.url.vod(), params as any);
    }

}
