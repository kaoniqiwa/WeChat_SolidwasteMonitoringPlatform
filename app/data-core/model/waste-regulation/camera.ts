  /**摄像机信息 */
    export class Camera
    {
        /**摄像机ID */
        Id: string;
        /**摄像机名称 */
        Name: string;
        /**摄像机用途 */
        CameraUsage: number;
        /**创建时间 */
        CreateTime: Date | string;
        /**更新事件 */
        UpdateTime: Date | string;
        /**垃圾桶房ID */
        GarbageStationId: string;
        /**位置编号，
箱外：1-9
箱内：11-19
11,15：干垃圾
12：湿垃圾
13：可回收垃圾
14：有害垃圾 */
        PositionNo:number;

        OnlineStatus:number;
    }

     /**获取摄像机列表参数 */
    export class GetGarbageStationCamerasParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**摄像机ID(可选) */
        Ids: string[];
        /**垃圾房ID(可选) */
        GarbageStationIds: string[];
        /**摄像机名称(可选) */
        Name: string;
        /**摄像机用途(可选) */
        CameraUsage: number | null;
        
        OnlineStatus:number;

        DivisionIds: string[];
    }