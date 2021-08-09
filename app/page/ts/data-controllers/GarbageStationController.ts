import { TimeUnit } from '../../../data-core/model/page'
import { EventNumberStatistic } from '../../../data-core/model/waste-regulation/division-event-numbers'
import {
  EventNumber,
  EventType,
} from '../../../data-core/model/waste-regulation/event-number'
import { GetEventRecordsParams } from '../../../data-core/model/waste-regulation/event-record-params'
import { GetEventTasksParams } from '../../../data-core/model/waste-regulation/event-task'
import { ResourceRole, ResourceType } from '../../../data-core/model/we-chat'
import { Service } from '../../../data-core/repuest/service'
import { DataCache } from './Cache'
import { DataController } from './DataController'
import {
  IDataController,
  IGarbageStationController,
  OneDay,
  Paged,
  StatisticNumber,
} from './IController'
import { ViewModelConverter } from './ViewModelConverter'
import { GarbageStationViewModel } from './ViewModels'

export class GarbageStationController
  extends DataController
  implements IDataController, IGarbageStationController
{
  constructor(service: Service, roles: ResourceRole[]) {
    super(service, roles)
  }

  getTimeUnit(date: Date) {
    if (this.isToday(date)) {
      return TimeUnit.Hour
    } else {
      return TimeUnit.Day
    }
  }
  getGarbageStationStatisticNumberListInToday = async (
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>> => {
    return this.getStatisticNumberListInToday(sources)
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

  getStatisticNumberList = async (
    day: OneDay
  ): Promise<Array<StatisticNumber>> => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dataDate = new Date(
      day.begin.getFullYear(),
      day.begin.getMonth(),
      day.begin.getDate()
    )

    let roles = await this.getResourceRoleList()

    if (dataDate.getTime() - today.getTime() >= 0) {
      return this.getStatisticNumberListInToday(roles)
    } else {
      return this.getStatisticNumberListInOtherDay(day, roles)
    }
  }

  /* getStatisticNumberList = async (day: OneDay) => {
		
		let result = new Array<StatisticNumber>();

		const timeUnit = this.getTimeUnit(day.begin);

		for (let i = 0; i < this.roles.length; i++) {
			const source = this.roles[i];
			
			const response = await this.service.garbageStation.eventNumbersHistory({
				TimeUnit: timeUnit,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString()
			}, source.Id);

			let illegalDropNumber = 0;
			let mixedIntoNumber = 0;
			let garbageFullNumber = 0;
			
			response.Data.Data.forEach(x => {
				let filter = x.EventNumbers.filter(y => y.EventType == EventType.IllegalDrop);
				let last = filter.pop();
				if (last) {
					illegalDropNumber = last.DayNumber;
				}
				filter = x.EventNumbers.filter(y => y.EventType == EventType.MixedInto);

				last = filter.pop();
				if (last) {
					mixedIntoNumber = last.DayNumber;
				}
				filter = x.EventNumbers.filter(y => y.EventType == EventType.GarbageFull);
				last = filter.pop()!;
				if (last) {
					garbageFullNumber = last.DayNumber;
				}
			})

			result.push({
				id: source.Id,
				name: source.Name!,
				illegalDropNumber: illegalDropNumber,
				mixedIntoNumber: mixedIntoNumber,
				garbageFullNumber: garbageFullNumber
			});
			console.log(response)
			console.log(day, result[i]);
		}
		return result;
	} */
  getHistory = async (day: OneDay) => {
    let datas: Array<EventNumberStatistic> = []

    for (let i = 0; i < this.roles.length; i++) {
      const role = this.roles[i]
      const data = await this.service.garbageStation.eventNumbersHistory(
        {
          BeginTime: day.begin,
          EndTime: day.end,
          TimeUnit: TimeUnit.Hour,
        },
        role.Id
      )

      if (datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = EventNumberStatistic.Plus(datas[i], data.Data[i])
        }
      } else {
        datas = data.Data
      }
    }
    let result = new Array<EventNumber>()
    for (let i = 0; i < datas.length; i++) {
      const item = datas[i].EventNumbers.find(
        (x) => x.EventType == EventType.IllegalDrop
      )
      if (item) {
        result.push(item)
      }
    }

    let alldayCount = await this.getEventCount(day)
    let count = result[result.length - 1].DayNumber
    let current = alldayCount.illegalDropNumber - count

    let thelast = new EventNumber()
    thelast.DayNumber = current
    thelast.EventType = EventType.IllegalDrop
    thelast.DeltaNumber = current

    result.push(thelast)
    return result
  }

  getGarbageStationList = async () => {
    if (DataCache.GarbageStations) {
      return DataCache.GarbageStations
    }
    let promise = await this.service.garbageStation.list({
      Ids: this.roles.map((x) => x.Id),
    })

    let ids = promise.Data.map((x) => x.Id)
    let statisic = await this.service.garbageStation.statisticNumberList({
      Ids: ids,
    })
    let userLabels = await this.userLabel.list(ids)

    let result = new Array<GarbageStationViewModel>()
    for (let i = 0; i < promise.Data.length; i++) {
      const item = promise.Data[i]
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

  getResourceRoleList = async () => {
    let promise = await this.service.garbageStation.list({
      Ids: this.roles.map((x) => x.Id),
    })
    return promise.Data.map((x) => {
      let role = new ResourceRole()
      role.Id = x.Id
      role.Name = x.Name
      role.ResourceType = ResourceType.GarbageStations
      return role
    })
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

      StationIds: this.roles.map((x) => x.Id),
    }
    if (ids) {
      params.StationIds = ids
    }
    return params
  }

  async getEventTaskList(day: OneDay) {
    let stations = await this.getGarbageStationList()
    let ids = stations.map((x) => x.Id)
    this.getGarbageStationStatisticNumberListInToday
    let today = this.getToday()
    let params: GetEventTasksParams = {
      BeginTime: day.begin,
      EndTime: day.end,
      Ids: ids,
    }
    return this.service.eventTask.list(params)
  }
}
