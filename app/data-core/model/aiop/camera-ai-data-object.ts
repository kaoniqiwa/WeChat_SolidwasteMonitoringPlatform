import { Point } from "../Point";


/**
 * AI摄像机识别的目标
 */
export class CameraAIDataObject {
    Id: string;
    /**
     * 目标所在的归一化多边形
     */
    Polygon: Point[];
    /**
     * 置信度：0-100
     */
    Confidence: number;
    /**
     * 是否有效(可选)
     */
    Valid: boolean | null;
    /**
     * 是否可见(可选)
     */
    Visible: boolean | null;
    ObjectImageUrl: string;
    /**
     *  标签信息，包括所有子标签 (可选)
     */
    Labels: CameraAIDataObjectLabel[];
}

/**标签信息，包括所有子标签 */
export class CameraAIDataObjectLabel {
    /**模型数据ID(可选) */
    ModelId: string;
    /**标签ID */
    LabelId: string;
    /**标签数值(可选) */
    LabelValue: string;
    /**标签名称 */
    LabelName: string;
    /**置信度：0-100 */
    Confidence: number;
    /**标签值的单位(可选)，只有Int类型是有单位的 */
    Unit: string;
    /**标签值类型(可选) None，Int，String，Enum  */
    DataType: string;
    /**数值(可选) */
    DataValue: string;
    /**数值描述(可选) */
    DataDescription: string;
    /**是否为与页标签(可选) */
    IsLeaf: boolean | null;
    /**父标签ID(可选) */
    ParentLabelId: string;
}