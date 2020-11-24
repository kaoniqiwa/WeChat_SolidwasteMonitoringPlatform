  /**获取资源标签列表请求参数 */
export class GetResourceLabelsParams {
    /**页码[1-n](可选) */
    PageIndex: number | null;
    /**分页大小[1-100](可选) */
    PageSize: number | null;
    /**资源标签ID列表(可选) */
    ResourceLabelIds: string[];
    /**标签名称，支持LIKE(可选) */
    Name: string;
}