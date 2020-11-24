  /**垃圾容量 */
    export class GarbageVolume
    {
        /**当天总数量，单位：L */
        DayVolume: number;
        /**当天干垃圾容量，单位：L */
        DayDryVolume: number;
        /**当天湿垃圾容量，单位：L */
        DayWetVolume: number;
        /**增量垃圾数量，单位：L */
        DeltaVolume: number;
        /**增量干垃圾容量，单位：L */
        DeltaDryVolume: number;
        /**增量湿垃圾容量，单位：L */
        DeltaWetVolume: number;
        /**当前总数量，单位：L */
        Volume: number;
        /**当前干垃圾容量，单位：L */
        DryVolume: number;
        /**当前湿垃圾容量，单位：L */
        WetVolume: number;
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;

        /**当前容量百分比，[0,1] */
        VolumePercent: number;
        /**当前干垃圾容量百分比，[0,1] */
        DryVolumePercent: number;
        /**当前湿垃圾容量百分比，[0,1] */
        WetVolumePercent: number;
    }

    

    /**获取区划下的垃圾容量参数 */
    export class GetDivisionVolumesParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;
        /**统计时间单位:1-Hour，2-Day */
        TimeUnit: number;
    }

     /**获取垃圾房下的垃圾容量参数 */
    export class GetGarbageStationVolumesParams
    {
        /**页码[1-n](可选) */
        PageIndex: number | null;
        /**分页大小[1-100](可选) */
        PageSize: number | null;
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;
        /**统计时间单位:1-Hour，2-Day */
        TimeUnit: number;
    }