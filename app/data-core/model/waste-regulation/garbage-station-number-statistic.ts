import { IPageParams } from "../page";
import { EventNumber } from "./event-number";
 /**垃圾房数量统计 */
    export class GarbageStationNumberStatistic
    {
      /**
       *	垃圾房ID	M
       *
       * @type {string}
       * @memberof GarbageStationNumberStatistic
       */
      Id!	:string;
      /**
       *	垃圾房名称	M
       *
       * @type {string}
       * @memberof GarbageStationNumberStatistic
       */
      Name!	:string;
      /**
       *	摄像机数量	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      CameraNumber!	:number;
      /**
       *	离线摄像机数量	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      OfflineCameraNumber!	:number;
      /**
       *	垃圾桶数量	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      TrashCanNumber!	:number;
      /**
       *	干垃圾满溢垃圾桶数量	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      DryTrashCanNumber!	:number;
      /**
       *	湿垃圾满溢垃圾桶数量	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      WetTrashCanNumber!	:number;
      /**
       *	干垃圾满溢	O
       *
       * @type {boolean}
       * @memberof GarbageStationNumberStatistic
       */
      DryFull?	:boolean;
      /**
       *	湿垃圾满溢	O
       *
       * @type {boolean}
       * @memberof GarbageStationNumberStatistic
       */
      WetFull?	:boolean;
      /**
       *	当日事件数量	O
       *
       * @type {EventNumber[]}
       * @memberof GarbageStationNumberStatistic
       */
      TodayEventNumbers?:	EventNumber[];
      /**
       *	当天总数量，单位：L	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      DayVolume!	:number;
      /**
       *	当天干垃圾容量，单位：L	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      DayDryVolume!	:number;
      /**
       *	当天湿垃圾容量，单位：L	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      DayWetVolume!	:number;
      /**
       *	垃圾房状态	M
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      StationState!	:number;
      /**
       *	评级	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      Garde?	:number;
      /**
       *	满溢时间，单位：分钟	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      FullDuration?	:number;
      /**
       *	当前垃圾堆数量	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      GarbageCount?	:number;
      /**
       *	当前垃圾堆滞留时间	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      CurrentGarbageTime?	:number;
      /**
       *	当日垃圾滞留比值      有垃圾时长/没有垃圾的时长	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      GarbageRatio?	:number;
      /**
       *	当日垃圾堆平均滞留时间，单位：分钟	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      AvgGarbageTime?	:number;
      /**
       *	当日垃圾堆最大滞留时间，单位：分钟	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      MaxGarbageTime?	:number;
      /**
       *	当日最大滞留堆数量	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      MaxGarbageCount?	:number;
      /**
       *	有垃圾时长，单位：分钟	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      GarbageDuration?	:number;
      /**
       *	无垃圾时长，单位：分钟	O
       *
       * @type {number}
       * @memberof GarbageStationNumberStatistic
       */
      CleanDuration?	:number;

    }

      /**获取垃圾房数量参数 */
    export class GetGarbageStationStatisticNumbersParams implements IPageParams
    {
        /**页码[1-n](可选) */
        PageIndex?: number;
        /**分页大小[1-100](可选) */
        PageSize?: number;
        /**区划ID(可选) */
        Ids?: string[];
        /**区划名称(可选)，支持LIKE */
        Name?: string;
    }