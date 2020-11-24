 /**垃圾桶信息 */
    export class TrashCan
    {
        /**垃圾桶ID */
        Id: string;
        /**垃圾桶名称(可选) */
        Name: string;
        /**垃圾桶编号(可选) */
        No: string;
        /**垃圾桶类型 */
        CanType: number;
        /**容积，单位：L */
        MaxVolume: number;
        /**当前容积(可选)，单位：L */
        CurrentVolume: number | null;
        /**创建时间 */
        CreateTime: Date | string;
        /**更新事件 */
        UpdateTime: Date | string;
        /**垃圾桶房ID */
        GarbageStationId: string;
        /**摄像机ID(可选) */
        CameraId: string;
        /**垃圾桶盖子状态(可选)，0：打开，1：关闭 */
        LidState: number | null;
    }

      /// <summary>
    /**获取垃圾桶列表参数
     */
    export class GetGarbageStationTrashCansParams
    {

        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**垃圾桶ID(可选) */
        Ids: string[];
        /**摄像机ID(可选) */
        CameraIds: string[];
        /**垃圾房ID(可选) */
        GarbageStationIds: string[];
        /**垃圾桶名称(可选) */
        Name: string;
        /**垃圾桶编号(可选) */
        No: string;
        /**垃圾桶类型(可选) */
        CanType: number | null;
        /**垃圾桶盖子状态(可选), 0：打开，1：关闭 */
        LidState: number | null;


    }