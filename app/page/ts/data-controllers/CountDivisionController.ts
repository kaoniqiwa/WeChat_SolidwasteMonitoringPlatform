import { TimeUnit } from '../../../data-core/model/page'
import {
  EventNumber,
  EventType,
} from '../../../data-core/model/waste-regulation/event-number'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'
import { ResourceRole, ResourceType } from '../../../data-core/model/we-chat'
import { Service } from '../../../data-core/repuest/service'
import { OneDay, Paged, StatisticNumber } from './IController'
import { DataController } from './DataController'
import { GetEventRecordsParams } from '../../../data-core/model/waste-regulation/event-record-params'
import { GarbageStationViewModel } from './ViewModels'
import { DataCache } from './Cache'
import { ViewModelConverter } from './ViewModelConverter'
import { IDataController } from './modules/IController/IDataController'
import { IGarbageStationController } from './modules/IController/IGarbageStationController'

export class CountDivisionController
  extends DataController
  implements IDataController, IGarbageStationController
{
  constructor(service: Service, roles: ResourceRole[]) {
    super(service, roles)
  }

  // private getDayNumber(source: EventNumberStatistic, type: EventType): number;
  // private getDayNumber(source: DivisionNumberStatistic, type: EventType): number;
  // private getDayNumber(source: EventNumberStatistic | DivisionNumberStatistic, type: EventType): number {
  // 	let count = 0;
  // 	if (source instanceof EventNumberStatistic) {
  // 		let filter = source.EventNumbers.filter(x => x.EventType == type);
  // 		filter.forEach(x => {
  // 			count += x.DayNumber;
  // 		})
  // 	}
  // 	else if (source instanceof DivisionNumberStatistic) {
  // 		if (source.TodayEventNumbers) {
  // 			let filter = source.TodayEventNumbers.filter(x => x.EventType == type);
  // 			filter.forEach(y => {
  // 				count += y.DayNumber;
  // 			});
  // 		}
  // 	}
  // 	else {
  // 		return 0;
  // 	}
  // 	return count;
  // }

  getGarbageStationStatisticNumberListInToday = async (
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    const responseStatistic =
      await this.service.garbageStation.statisticNumberList({
        Ids: sources.map((x) => x.Id),
      })
    return responseStatistic.Data.map((x) => {
      let illegalDropNumber = 0
      let mixedIntoNumber = 0
      let garbageFullNumber = 0
      if (x.TodayEventNumbers) {
        let filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.IllegalDrop
        )
        let last = filter.pop()
        if (last) {
          illegalDropNumber = last.DayNumber
        }

        filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.MixedInto
        )
        last = filter.pop()
        if (last) {
          mixedIntoNumber = last.DayNumber
        }
        filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.GarbageFull
        )
        last = filter.pop()
        if (last) {
          garbageFullNumber = last.DayNumber
        }
      }
      return {
        id: x.Id,
        name: x.Name,
        illegalDropNumber: illegalDropNumber,
        mixedIntoNumber: mixedIntoNumber,
        garbageFullNumber: garbageFullNumber,
        garbageDropNumber: x.GarbageDropStationNumber ?? 0,
      }
    })
  }

  getStatisticNumberListInToday = async (
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    const responseStatistic = await this.service.division.statisticNumberList({
      Ids: sources.map((x) => x.Id),
    })
    return responseStatistic.Data.map((x) => {
      let illegalDropNumber = 0
      let mixedIntoNumber = 0
      let garbageFullNumber = 0
      let garbageDropNumber = 0
      if (x.TodayEventNumbers) {
        let filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.IllegalDrop
        )
        let last = filter.pop()
        if (last) {
          illegalDropNumber = last.DayNumber
        }

        filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.MixedInto
        )
        last = filter.pop()
        if (last) {
          mixedIntoNumber = last.DayNumber
        }
        filter = x.TodayEventNumbers.filter(
          (y) => y.EventType == EventType.GarbageFull
        )
        last = filter.pop()
        if (last) {
          garbageFullNumber = last.DayNumber
        }
      }
      return {
        id: x.Id,
        name: x.Name,
        illegalDropNumber: illegalDropNumber,
        mixedIntoNumber: mixedIntoNumber,
        garbageFullNumber: garbageFullNumber,
        garbageDropNumber: x.GarbageDropStationNumber ?? 0,
      }
    })
  }

  getStatisticNumberListInOtherDay = async (
    day: OneDay,
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    let result = new Array<StatisticNumber>()
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]

      const response = await this.service.division.eventNumbersHistory(
        {
          TimeUnit: TimeUnit.Day,
          BeginTime: day.begin,
          EndTime: day.end,
        },
        source.Id
      )
      response.Data.forEach((x) => {
        let illegalDropNumber = 0
        let mixedIntoNumber = 0
        let garbageFullNumber = 0
        let garbageDropNumber = 0
        let filter = x.EventNumbers.filter(
          (y) => y.EventType == EventType.IllegalDrop
        )
        filter.forEach((y) => {
          illegalDropNumber += y.DayNumber
        })
        filter = x.EventNumbers.filter(
          (y) => y.EventType == EventType.MixedInto
        )
        filter.forEach((y) => {
          mixedIntoNumber += y.DayNumber
        })
        filter = x.EventNumbers.filter(
          (y) => y.EventType == EventType.GarbageFull
        )
        filter.forEach((y) => {
          garbageFullNumber += y.DayNumber
        })
        filter = x.EventNumbers.filter(
          (y) => y.EventType == EventType.GarbageDropTimeout
        )
        filter.forEach((y) => {
          garbageDropNumber += y.DayNumber
        })
        result.push({
          id: source.Id,
          name: source.Name!,
          illegalDropNumber: illegalDropNumber,
          mixedIntoNumber: mixedIntoNumber,
          garbageFullNumber: garbageFullNumber,
          garbageDropNumber: garbageDropNumber,
        })
      })
    }
    return result
  }

  getHistory = async (day: OneDay) => {
    // ??????????????????
    const illegalDropResult = new Array<EventNumber>()

    // ??????????????????
    const mixedIntoResult = new Array<EventNumber>()

    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]

      // ????????????????????????????????????????????????
      const data = await this.service.division.eventNumbersHistory(
        {
          BeginTime: day.begin,
          EndTime: day.end,
          TimeUnit: TimeUnit.Hour,
        },
        role.Id
      )

      // console.log('countDivisionController', data.Data)
      for (var x of data.Data) {
        for (const y of x.EventNumbers)
          if (y.EventType == EventType.IllegalDrop) illegalDropResult.push(y)
          else if (y.EventType == EventType.MixedInto) mixedIntoResult.push(y)
      }
    }
    // ??????0???????????????????????????????????????
    let alldayCount = await this.getEventCount(day)

    // console.log('allDay', alldayCount)

    // illegalDropResult ?????????????????????????????????????????????????????????????????????????????????
    let illegalDropCount =
      illegalDropResult[illegalDropResult.length - 1].DayNumber
    let illegalDropCurrent = alldayCount.illegalDropNumber - illegalDropCount

    let mixedIntoCount = mixedIntoResult[mixedIntoResult.length - 1].DayNumber
    let mixedIntoCurrent = alldayCount.mixedIntoNumber - mixedIntoCount

    illegalDropResult.push(
      new EventNumber(
        EventType.IllegalDrop,
        illegalDropCurrent,
        illegalDropCurrent
      )
    )
    mixedIntoResult.push(
      new EventNumber(EventType.MixedInto, mixedIntoCurrent, mixedIntoCurrent)
    )

    return {
      IllegalDrop: illegalDropResult,
      MixedInto: mixedIntoResult,
    }
  }

  getGarbageStationList = async () => {
    if (DataCache.GarbageStations) {
      return DataCache.GarbageStations
    }
    let list = new Array<GarbageStation>()
    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]
      try {
        const promise = await this.service.garbageStation.list({
          DivisionId: role.Id,
        })
        list = list.concat(promise.Data)
      } catch (e) {
        console.error('getGarbageStationList error:', e)
      }
    }
    let ids = list.map((x) => x.Id)
    let statisic = await this.service.garbageStation.statisticNumberList({
      Ids: ids,
    })
    let userLabels = await this.userLabel.list(ids)

    let result = new Array<GarbageStationViewModel>()
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      let vm = ViewModelConverter.Convert(this.service, item)
      vm.NumberStatistic = statisic.Data.find((x) => x.Id == vm.Id)
      vm.UserLabel = userLabels.find((x) => x.LabelId === vm.Id)
      result.push(vm)
    }
    // result = result.sort((a, b) => {
    // 	if (a.DivisionId && b.DivisionId)
    // 		return a.DivisionId.localeCompare(b.DivisionId) || a.Name.localeCompare(b.Name);
    // 	return 0;
    // })
    DataCache.GarbageStations = result
    return DataCache.GarbageStations
  }

  private _ResourceRoleList?: Array<ResourceRole>

  getResourceRoleList = async () => {
    if (this._ResourceRoleList) {
      return this._ResourceRoleList
    }

    let result = new Array<ResourceRole>()

    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]
      let promise = await this.service.division.list({ ParentId: role.Id })
      result = result.concat(
        promise.Data.map((x) => {
          let r = new ResourceRole()
          r.Id = x.Id
          r.Name = x.Name
          r.ResourceType = ResourceType.County
          return r
        })
      )
    }
    this._ResourceRoleList = result
    return result
  }

  getEventListParams(
    day: OneDay,
    page: Paged,
    type: EventType,
    ids?: string[]
  ) {
    const params = {
      BeginTime: day.begin.toISOString(),
      EndTime: day.end.toISOString(),
      PageSize: page.size,
      PageIndex: page.index,
      Desc: true,
      DivisionIds: this.roles.map((x) => x.Id),
    }
    if (ids) {
      params.DivisionIds = ids
    }
    return params
  }
}
