import { EventNumber } from "./event-number";
 /**垃圾房数量统计 */
    export interface GarbageStationNumberStatistic
    {
        /**垃圾房ID */
        Id: string;
        /**垃圾房名称 */
        Name: string;
        /**摄像机数量 */
        CameraNumber: number;
        /**离线摄像机数量 */
        OfflineCameraNumber: number;
        /**垃圾桶数量 */
        TrashCanNumber: number;
        /**干垃圾满溢垃圾桶数量 */
        DryTrashCanNumber: number;
        /**湿垃圾满溢垃圾桶数量 */
        WetTrashCanNumber: number;
        /**当日事件数量(可选) */
        TodayEventNumbers: EventNumber[];
        /**当天总数量，单位：L  */
        DayVolume: number;
        /**当天干垃圾容量，单位：L  */
        DayDryVolume: number;
        /**当天湿垃圾容量，单位：L  */
        DayWetVolume: number;

    }

      /**获取垃圾房数量参数 */
    export class GetGarbageStationStatisticNumbersParams
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