 /**批量操作结果 */
    export class BatchResult
    {
        /**操作结果(可选) */
        Results: SingleResult[];
    }


    /**批量操作结果 */
    export class BatchRequest
    {
        /**资源ID列表 */
        ResourceIds: string[];
        /**是否删除数据，(可选)，默认：true */
        IsDelete: boolean | null;
    }

    /**单个操作结果 */
    export class SingleResult
    {
        /**资源ID */
        ResourceId: string;
        /**结果：0-成功，1-失败 */
        Result: number;
        /**描述信息(可选) */
        ResultDescription: string;
    }