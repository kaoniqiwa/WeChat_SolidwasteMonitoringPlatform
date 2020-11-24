
/**获取资源信息请求参数 */
export class GetResourcesParams {
    /**页码[1-n](可选) */
    PageIndex: number | null;
    /**分页大小[1-100](可选) */
    PageSize: number | null;
    /**资源ID列表(可选) */
    ResourceIds: string[];
    /**资源名称，支持LIKE(可选) */
    Name: string;
    /**资源类型(可选) */
    ResourceType: string;
    /**标签名称的OR筛选(可选) */
    Labels: string[];
    /**标签ID的OR筛选(可选) */
    LabelIds: string[];
    /**标签名称的AND筛选(可选) */
    AndLabels: string[];
    /**标签ID的AND筛选(可选) */
    AndLabelIds: string[];
    /**平台ID(可选) */
    PlatformId: string;
    /**所属区域ID */
    RegionIds: string[];
    /**区域ID必须为NULL */
    RegionIdNullable: boolean;
}