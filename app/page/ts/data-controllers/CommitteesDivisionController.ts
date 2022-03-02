import { TimeUnit } from '../../../data-core/model/page'
import { EventNumberStatistic } from '../../../data-core/model/waste-regulation/division-event-numbers'
import {
  EventNumber,
  EventType,
} from '../../../data-core/model/waste-regulation/event-number'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'
import { ResourceRole, ResourceType } from '../../../data-core/model/we-chat'
import { Service } from '../../../data-core/repuest/service'
import { DataCache } from './Cache'
import { DataController } from './DataController'
import { OneDay, Paged, StatisticNumber } from './IController'
import { ViewModelConverter } from './ViewModelConverter'
import { GarbageStationViewModel } from './ViewModels'

export class CommitteesDivisionController extends DataController {
  constructor(service: Service, roles: ResourceRole[]) {
    super(service, roles)
  }

  getGarbageStationList = async () => {
    if (DataCache.GarbageStations) {
      return DataCache.GarbageStations
    }
    let list = new Array<GarbageStation>()
    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]
      let promise = await this.service.garbageStation.list({
        DivisionId: role.Id,
      })
      list = list.concat(promise.Data)
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
    // 		return a.DivisionId.localeCompare(a.DivisionId) || a.Name.localeCompare(b.Name);
    // 	return 0;
    // })
    DataCache.GarbageStations = result
    return DataCache.GarbageStations
  }
  getGarbageStationStatisticNumberListInToday = async (
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    return this.getStatisticNumberListInToday(sources)
  }

  getStatisticNumberListInOtherDay = async (
    day: OneDay,
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    let result = new Array<StatisticNumber>()
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]

      const response = await this.service.garbageStation.eventNumbersHistory(
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
  getStatisticNumberListInToday = async (
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

  getResourceRoleList = async () => {
    let result = new Array<ResourceRole>()
    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]
      let promise = await this.service.garbageStation.list({
        DivisionId: role.Id,
      })
      let current = promise.Data.map((x) => {
        let role = new ResourceRole()
        role.ResourceType = ResourceType.Committees
        role.Id = x.Id
        role.Name = x.Name
        return role
      })
      result = result.concat(current)
    }

    return result
  }

  getHistory = async (day: OneDay) => {
    // 垃圾落地数组
    const illegalDropResult = new Array<EventNumber>()

    // 混合投放数组
    const mixedIntoResult = new Array<EventNumber>()

    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]

      // 以小时为单位获得垃圾投放数量信息
      const data = await this.service.division.eventNumbersHistory(
        {
          BeginTime: day.begin,
          EndTime: day.end,
          TimeUnit: TimeUnit.Hour,
        },
        role.Id
      )

      // console.log('countDivisionController', data.Data)
      let begin = new Date(data.Data[0].BeginTime)
      while (begin.getTime() >= day.begin.getTime()) {
        let item = new EventNumberStatistic()
        item.EndTime = begin
        begin.setHours(begin.getHours() - 1)
        item.BeginTime = begin
        item.EventNumbers = [
          {
            EventType: EventType.IllegalDrop,
            DayNumber: 0,
          },
          {
            EventType: EventType.MixedInto,
            DayNumber: 0,
          },
        ]

        data.Data.unshift(item)
      }
      for (var x of data.Data) {
        for (const y of x.EventNumbers)
          if (y.EventType == EventType.IllegalDrop) illegalDropResult.push(y)
          else if (y.EventType == EventType.MixedInto) mixedIntoResult.push(y)
      }
    }
    // 获得0点至当前分钟的垃圾投放数量
    let alldayCount = await this.getEventCount(day)

    // console.log('allDay', alldayCount)

    // illegalDropResult 按小时为单位计算，超过小时部分投放的垃圾数量未计算在内
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

  getEventListParams(
    day: OneDay,
    page: Paged,
    type: EventType,
    ids?: string[]
  ) {
    const params = {
      BeginTime: day.begin,
      EndTime: day.end,
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
