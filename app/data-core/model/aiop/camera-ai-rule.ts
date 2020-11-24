import { Point } from "../Point";


    /**
     * 摄像机AI规则信息
     */
export class CameraAIRule {
    RuleId: string;
    TriggerType: number | null;
    Direction: number | null;
    /**
     * 规则的归一化多边形(可选) 
     */
    Polygon: Point[];
    /**
     *  触发规则的对象ID(可选) ，可以在CameraAIData的Objects中找到
     */
    ObjectIds: string[];
}