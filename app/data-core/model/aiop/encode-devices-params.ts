import { GetResourcesParams } from "./resources-params";

    /**
     * 
     */
export class GetCamerasParams extends GetResourcesParams {
    EncodeDeviceIds: string[];
    /**
     * 
     */
    OnlineStatus: number | null;
    CameraTypes: number[];
    CameraState: number | null;
    IPAddress: string;
    /**
     * 
     */
    PTZControllable: boolean | null;
    /**
     * 
     */
    Storable: boolean | null;
    /**
     * 
     */
    AIModelIds: string[];
}

    /**
     * 
     */
export class GetEncodeDevicesParams extends GetResourcesParams {
    OnlineStatus: number | null;
    Model: string;
    /**
     * 
     */
    SerialNumber: string;
    /**
     * 
     */
    DeviceType: string;
    /**
     * 
     */
    IPAddress: string;
}