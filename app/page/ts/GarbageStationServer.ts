import { Page, PagedList } from "../../data-core/model/page";
import { Flags, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { IGarbageStationController, Paged } from "./data-controllers/IController";
import { GarbageStationViewModel } from "./data-controllers/ViewModels";

export default class GarbageStationServer {
  garbageStations: GarbageStationViewModel[] = [];//接口请求到的所有数据
  garbageDropState = '999'

  eventTypes: Array<string> = [];
  roleTypes: Array<string> = []; // 筛选区域
  paged?: Paged;
  totalData: GarbageStationViewModel[] = [];

  constructor(private dataController: IGarbageStationController) {

  }
  async loadAllData() {
    console.time();
    this.garbageStations = await this.dataController.getGarbageStationList();
    console.timeEnd();
    // console.log('原始数据', this.garbageStations)
  }
  // 这里模拟请求服务器数据
  fetch(eventTypes: string[], roleTypes: string[], paged: Paged) {

    this.eventTypes = eventTypes;
    this.roleTypes = roleTypes;
    this.paged = paged;

    this.totalData = this.filter();
    return this.split();

  }
  private filter() {
    //console.log('eventTypes', this.eventTypes)
    //console.log('roltTypes', this.roleTypes)
    /**
     *   垃圾落地集合中包含 正常/异常/满溢状态
     *   如果筛选的条件是垃圾落地和正常，那么筛选出垃圾落地后，再筛选正常会有重复的正常出现
     * 
     */

    let eventData: GarbageStationViewModel[] = [];
    if (this.eventTypes.length == 0) {
      eventData = this.garbageStations;
    }
    else {
      for (let i = 0; i < this.eventTypes.length; i++) {
        let type = this.eventTypes[i];
        let filtered = this.garbageStations.filter(item => {
          let stationState = (item.StationState as Flags<StationState>);
          // console.log(stationState, type)
          // 垃圾落地筛选条件
          if (type == this.garbageDropState) {
            let currentGarbageTime = (item.NumberStatistic?.CurrentGarbageTime!) >> 0;
            return currentGarbageTime > 0
          } else {
            // Flag<StationState>字段筛选
            if (stationState.value == StationState.Normal) {
              return stationState.value == Number(type)
            } else {
              return stationState.contains(Number(type))
            }
          }

        })

        eventData.push(...filtered)
      }
    }

    let resData: GarbageStationViewModel[] = []

    let roleData: GarbageStationViewModel[] = [];

    if (this.roleTypes.length == 0) {
      roleData = eventData;
    } else {
      // 居委会筛选是交集关系
      for (let i = 0; i < this.roleTypes.length; i++) {
        let type = this.roleTypes[i];
        let filtered = eventData.filter(item => {
          return item.DivisionId == type
        })
        roleData.push(...filtered)
      }
    }

    resData = Array.from(new Set(roleData));// 去重
    // console.log('筛选后的数据', resData)

    // 将数据按垃圾落地先排序，默认升序排序
    resData.sort((a, b) => {
      let a_time = a.NumberStatistic!.CurrentGarbageTime! >> 0;
      let b_time = b.NumberStatistic!.CurrentGarbageTime! >> 0;
      return (a_time - b_time)
    })
    resData.reverse();// 降序

    return resData
  }
  split() {
    let size = this.paged!.size;
    let index = this.paged!.index;


    let resData = this.totalData;

    // 数据筛选后，切割数据
    let data: GarbageStationViewModel[] = [];
    data = resData.slice((index - 1) * size, index * size)


    let PageIndex = index;
    let PageSize = size;
    let PageCount = Math.ceil(resData.length / size)
    let RecordCount = data.length
    let TotalRecordCount = resData.length


    let page: Page = {
      PageIndex,
      PageSize,
      PageCount,
      RecordCount,
      TotalRecordCount
    }
    let res: PagedList<GarbageStationViewModel> & {
      TotalData: GarbageStationViewModel[]
    }
      = {
      Page: page,
      Data: data,
      TotalData: resData
    }
    // console.log(res)
    return res;
  }
}