
    /**
     * 批量拷贝
     */
export class BatchCopyRequest {
    /**
     *  资源ID列表
     */
    ResourceIds: string[];
    /**
     * 是否删除已存在的数据(可选)，默认：true
     */
    DeleteExisted: boolean | null;
}