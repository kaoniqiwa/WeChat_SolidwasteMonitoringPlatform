import { EventRecord } from "./event-record";
import { CameraAIData } from "./camera-ai-data";
import { CameraAIRule } from "./camera-ai-rule";

    /**
     * 摄像机AI事件
     */
export class CameraAIEventRecord extends EventRecord {
   
    /**
     *  AI事件内容
     */
    Data: CameraAIData;
    /**
     *  AI事件规则(可选)
     */
    Rules: CameraAIRule[];
}
 