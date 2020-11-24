import { EventNumber } from "./event-number";
/**区划数量统计 */
    export interface DivisionNumberStatistic
    {
        /**区划ID */
        Id: string;
        /**区划名称 */
        Name: string;
        /**垃圾房数量 */
        StationNumber: number;
        /**摄像机数量 */
        CameraNumber: number;
        /**离线摄像机数量 */
        OfflineCameraNumber: number;
        /**垃圾桶数量 */
        TrashCanNumber: number;
        /**下一层区划数量 */
        ChildDivisionNumber: number;
        /**叶区划数量 */
        LeafDivisionNumber: number;
        /**干垃圾满溢垃圾房数量 */
        DryFullStationNumber: number;
        /**湿垃圾满溢垃圾房数量 */
        WetFullStationNumber: number;
        /**当日事件数量(可选) */
        TodayEventNumbers: EventNumber[];
        /**当天总数量，单位：L */
        DayVolume: number;
        /**当天干垃圾容量，单位：L */
        DayDryVolume: number;
        /**当天湿垃圾容量，单位：L */
        DayWetVolume: number;
    }

      /// <summary>
    /**获取区划数量参数
     */
    export class GetDivisionStatisticNumbersParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**区划ID(可选) */
        Ids: string[];
        /**区划名称(可选)，支持LIKE */
        Name: string;
    }