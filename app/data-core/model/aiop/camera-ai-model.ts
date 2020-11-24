/**AI模型信息 */
export class CameraAIModel {
    /**ID */
    Id: string;
    /**模型ID(可选) */
    ModelId: string;
    /**模型标签图标0-n */
    Label: number;
    /**数据集ID(可选) */
    DataSetId: string;
    /**版本(可选) */
    Version: string;
    /**应用类型，一般是设备型号(可选) */
    TransformType: string;
    /**模型类型(可选)：AIOP */
    ModelType: string;
    /**模型名称(可选) */
    ModelName: string;
    /**模型数据传输对象的格式(可选) */
    ModelDTO: CameraAIModelDTO;
    /**JSON文件的BASE64， 创建时必须填写 */
    ModelJSON: string;
    /**创建时间 */
    CreateTime: Date | string;
    /**更新事件 */
    UpdateTime: Date | string;

}


/**模型数据传输对象的格式 */
export class CameraAIModelDTO {
    /**模型数据ID */
    ModelId: string;
    /**模型数据类型(可选)：1:检测数据，2:分类数据 */
    ModelType: number | null;
    /**模型数据标签(可选) */
    Labels: CameraAIModelDTOLabel[];

}


/**I摄像机模型DTO标签 */
export class CameraAIModelDTOLabel {
    /**模型数据ID */
    ModelId: string;
    /**模型数据类型(可选)：1:检测数据，2:分类数据 */
    ModelType: number | null;
    /**标签ID */
    LabelId: string;
    /**标签对应的数值(可选) */
    LabelValue: string;
    /**标签名称 */
    LabelName: string;
    /**标签值的单位(可选)，只有Int类型是有单位的 */
    Unit: string;
    /**标签值类型：0-None, 1-Int，2-String，3-Enum */
    DataType: string;
    /**数值(可选) */
    DataValue: string;
    /**枚举类型数值列表(可选) */
    EnumValues: EnumValue[];
    /**子标签、子属性(可选) */
    Labels: CameraAIModelDTOLabel[];
    /**是否为叶节点(可选) */
    IsLeaf: boolean | null;
    /**模型标签值(可选) */
    LabelModelValue: string;


}

/**枚举值 */
export class EnumValue {
    /**值 */
    Value: number;
    /**描述 */
    Description: string;
    /**模型给出的值 */
    ModelValue: number;
}