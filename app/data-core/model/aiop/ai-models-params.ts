
/**
 * 获取资源标签列表请求参数
 */
export class GetAIModelsParams {

    PageIndex: number | null;
    PageSize: number | null;
    /**
     * 
     */
    ModelIds: string[];
    /**
     * 数据集ID(可选)
     */
    DataSetIds: string[];
    /**
     *  应用类型，支持LIKE(可选)
     */
    TransformType: string;
    /**
     * 
     */
    ModelType: string;
    /**
     * 
     */
    ModelName: string;
}


/**
 * 批量拷贝
 */
export class BatchCopyRequest {
    /** 资源ID列表*/
    ResourceIds: string[];	
        /** 是否删除已存在的数据，  默认：true*/
    DeleteExisted: boolean;	
  
}