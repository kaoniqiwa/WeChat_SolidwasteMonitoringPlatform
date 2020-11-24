/**事件信息 */
    export interface EventInfo
    {
        /**事件类型 */
        Type: number;
        /**事件名称 */
        Name: string;
        /**事件对应的AIOP分析模型(可选) */
        AIModels: AIModelTrigger[];
        /**事件级别 */
        Level: number;


    }
    /**分析模型触发条件 */
    export interface AIModelTrigger
    {
        /**模型ID */
        ModelId: string;
        /**模型类型，默认：AIOP */
        ModelType: string;
        /**模型名称，默认：AIOP */
        ModelName: string;
        /**触发事件的标签列表(可选) */
        Labels: AIModelTriggerLabel[];
    }
    /**分析模型触发标签 */
    export interface AIModelTriggerLabel
    {
        /**标签ID */
        LabelId: string;
        /**标签数值 */
        LabelValue: string;
        /**数值(可选) */
        DataValue: string;
        /**标签名称 */
        LabelName: string;
    }