/**区划信息 */
    export class Division  
    {
        /**区划ID */
        Id: string;
        /**区划名称 */
        Name: string;
        /**父区划ID(可选)，如果是根区域节点，则该ID为空 */
        ParentId: string;
        /**是否为叶节点的区域 */
        IsLeaf: boolean;
        /**外部扩展ID(可选)，用于国标区划编码 */
        ExternalId: string;
        /**区划完整路径(可选)，含本节点，@进行分割，上级节点在前 */
        DivisionPath: string;
        /**描述信息(可选) */
        Description: string;
        /**人口(可选) */
        Population: number | null;
        /**区划类型，用于图标区分 */
        DivisionType: number;
        /**创建时间 */
        CreateTime: Date | string;
        /**更新事件 */
        UpdateTime: Date | string;
        /**区划中心GIS点位(可选) */
        GisPoint: any;
        /**区划GIS点位区域(可选) */
        GisArea: any;
    }

     /**获取区划列表参数 */
    export class GetDivisionsParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**区划ID(可选) */
        Ids: string[];
        /**区划名称，支持LIKE(可选) */
        Name: string;
        /**区划类型(可选) */
        DivisionType: number | null;
        /**父ID(可选) */
        ParentId: string;
        /**区划完整路径(可选)，含本节点，@进行分割，上级节点在前，支持LIKE */
        DivisionPath: string;
        /**祖辈ID(可选)，返回该ID下的所有子孙区划信息 */
        AncestorId: string;

    }


    