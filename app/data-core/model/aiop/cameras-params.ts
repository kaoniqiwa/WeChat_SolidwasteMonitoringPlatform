import { GetResourcesParams } from "./resources-params";


    /**
     * 
     */
export class GetCamerasParams extends GetResourcesParams{
    OnlineStatus: number | null;
    CameraTypes: number[];
    CameraState: number | null;
    IPAddress: string;
    /**
     * 是否PTZ可控(可选)
     */
    PTZControllable: boolean | null;
    /**
     * 是否可存储的(可选)
     */
    Storable: boolean | null;
    /**
     * AI模型ID列表(可选)
     */
    AIModelIds: string[];
}