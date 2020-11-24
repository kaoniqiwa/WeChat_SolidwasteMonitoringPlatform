 import { EventNumber } from "./event-number";
 /**事件数量统计 */
    export interface EventNumberStatistic
    {
        /**事件数量 */
        EventNumbers: EventNumber[];
        /**开始时间 */
        BeginTime: Date | string;
        /**结束时间 */
        EndTime: Date | string;
    } 
     /**获取区划事件数量参数 */
     export class GetDivisionEventNumbersParams
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

     /**获取垃圾房事件数量参数 */
    export class GetGarbageStationnEventNumbersParams
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