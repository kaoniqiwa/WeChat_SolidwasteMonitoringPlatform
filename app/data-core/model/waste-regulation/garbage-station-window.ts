
    /**垃圾投放窗口 */
    export class GarbageStationWindow
    {
        /**窗口编号，从1开始 */
        No: number;
        /**名称(可选) */
        Name: string;
        /**垃圾桶类型 */
        CanType: number;
        /**垃圾桶数量，（保留） */
        TrashCanNumber: number | null;
    }