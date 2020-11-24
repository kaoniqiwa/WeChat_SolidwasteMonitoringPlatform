import { CameraAIDataObject } from "./camera-ai-data-object";
import { Resolution } from "./Resolution";

    /**
     * 摄像机AI数据
     */
export class CameraAIData {
    /**
     * 识别成功的目标列表
     */
    Objects: CameraAIDataObject[];
    /**
     *  图片分辨率(可选)
     */
    Resolution: Resolution;
    ImageUrl: string;
    /**
     * 数据上报时间
     */
    Time: string;
    ModelId: string;
    ModelName:string;
}