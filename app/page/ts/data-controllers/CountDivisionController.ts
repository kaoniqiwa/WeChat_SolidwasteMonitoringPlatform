
import { TimeUnit } from "../../../data-core/model/page";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { IDataController, IGarbageStationController, OneDay, Paged, StatisticNumber } from "./IController";
import { DataController } from "./DataController";
import { GetEventRecordsParams } from "../../../data-core/model/waste-regulation/event-record-params";
import { GarbageStationViewModel, ViewModelConverter } from "./ViewModels";


export class CountDivisionController extends DataController implements IDataController, IGarbageStationController {
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


	getGarbageStationStatisticNumberListInToday = async (sources: ResourceRole[]): Promise<Array<StatisticNumber>> => {
		const responseStatistic = await this.service.garbageStation.statisticNumberList({
			Ids: sources.map(x => x.Id)
		});
		return responseStatistic.Data.map(x => {
			let illegalDropNumber = 0;
			let mixedIntoNumber = 0;
			let garbageFullNumber = 0;
			if (x.TodayEventNumbers) {
				let filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.IllegalDrop);
				let last = filter.pop();
				if (last) {
					illegalDropNumber = last.DayNumber;
				}

				filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.MixedInto);
				last = filter.pop();
				if (last) {
					mixedIntoNumber = last.DayNumber;
				}
				filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.GarbageFull);
				last = filter.pop();
				if (last) {
					garbageFullNumber = last.DayNumber;
				}
			}
			return {
				id: x.Id,
				name: x.Name,
				illegalDropNumber: illegalDropNumber,
				mixedIntoNumber: mixedIntoNumber,
				garbageFullNumber: garbageFullNumber
			}
		});
	}

	getStatisticNumberListInToday = async (sources: ResourceRole[]): Promise<Array<StatisticNumber>> => {


		const responseStatistic = await this.service.division.statisticNumberList({
			Ids: sources.map(x => x.Id)
		});
		return responseStatistic.Data.map(x => {
			let illegalDropNumber = 0;
			let mixedIntoNumber = 0;
			let garbageFullNumber = 0;
			if (x.TodayEventNumbers) {
				let filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.IllegalDrop);
				let last = filter.pop();
				if (last) {
					illegalDropNumber = last.DayNumber;
				}

				filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.MixedInto);
				last = filter.pop();
				if (last) {
					mixedIntoNumber = last.DayNumber;
				}
				filter = x.TodayEventNumbers.filter(y => y.EventType == EventType.GarbageFull);
				last = filter.pop();
				if (last) {
					garbageFullNumber = last.DayNumber;
				}
			}
			return {
				id: x.Id,
				name: x.Name,
				illegalDropNumber: illegalDropNumber,
				mixedIntoNumber: mixedIntoNumber,
				garbageFullNumber: garbageFullNumber
			}
		});
	}

	getStatisticNumberListInOtherDay = async (day: OneDay, sources: ResourceRole[]): Promise<Array<StatisticNumber>> => {
		let result = new Array<StatisticNumber>();
		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];

			const response = await this.service.division.eventNumbersHistory({
				TimeUnit: TimeUnit.Day,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString()
			}, source.Id)
			response.Data.forEach(x => {
				let illegalDropNumber = 0;
				let mixedIntoNumber = 0;
				let garbageFullNumber = 0;
				let filter = x.EventNumbers.filter(y => y.EventType == EventType.IllegalDrop);
				filter.forEach(y => {
					illegalDropNumber += y.DayNumber;
				})
				filter = x.EventNumbers.filter(y => y.EventType == EventType.MixedInto);
				filter.forEach(y => {
					mixedIntoNumber += y.DayNumber;
				})
				filter = x.EventNumbers.filter(y => y.EventType == EventType.GarbageFull);
				filter.forEach(y => {
					garbageFullNumber += y.DayNumber;
				})

				result.push({
					id: source.Id,
					name: source.Name!,
					illegalDropNumber: illegalDropNumber,
					mixedIntoNumber: mixedIntoNumber,
					garbageFullNumber: garbageFullNumber
				});
			})
		}
		return result;
	}


	getHistory = async (day: OneDay) => {

		// 乱丢垃圾数组
		const illegalDropResult = new Array<EventNumber>();

		// 混合投放数组
		const mixedIntoResult = new Array<EventNumber>();

		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];

			// 以小时为单位获得垃圾投放数量信息
			const data = await this.service.division.eventNumbersHistory({
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString(),
				TimeUnit: TimeUnit.Hour
			}, role.Id)

			// console.log('countDivisionController', data.Data)
			for (var x of data.Data) {
				for (const y of x.EventNumbers)
					if (y.EventType == EventType.IllegalDrop)
						illegalDropResult.push(y);
					else if (y.EventType == EventType.MixedInto)
						mixedIntoResult.push(y)


			}
		}
		// 获得0点至当前分钟的垃圾投放数量
		let alldayCount = await this.getEventCount(day);

		// console.log('allDay', alldayCount)

		// illegalDropResult 按小时为单位计算，超过小时部分投放的垃圾数量未计算在内
		let illegalDropCount = illegalDropResult[illegalDropResult.length - 1].DayNumber;
		let illegalDropCurrent = alldayCount.illegalDropNumber - illegalDropCount;

		let mixedIntoCount = mixedIntoResult[mixedIntoResult.length - 1].DayNumber;
		let mixedIntoCurrent = alldayCount.mixedIntoNumber - mixedIntoCount;

		illegalDropResult.push(new EventNumber(EventType.IllegalDrop, illegalDropCurrent, illegalDropCurrent));
		mixedIntoResult.push(new EventNumber(EventType.MixedInto, mixedIntoCurrent, mixedIntoCurrent));

		return {
			'IllegalDrop': illegalDropResult,
			'MixedInto': mixedIntoResult
		};
	}

	getGarbageStationList = async () => {
		if (this.GgarbageStations) {
			return this.GgarbageStations;
		}
		let list = new Array<GarbageStation>();
		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];			
			const promise = await this.service.garbageStation.list({ DivisionId: role.Id });
			list = list.concat(promise.Data);
		}
		let statisic = await this.service.garbageStation.statisticNumberList({ Ids: list.map(x => x.Id) })

		let result = new Array<GarbageStationViewModel>()
		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			let vm = ViewModelConverter.Convert(this.service, item);
			vm.NumberStatistic = statisic.Data.find(x => x.Id == vm.Id);
			result.push(vm);
		}
		result = result.sort((a, b) => {
			if (a.DivisionId && b.DivisionId)
				return a.DivisionId.localeCompare(b.DivisionId) || a.Name.localeCompare(b.Name);
			return 0;
		})
		this.GgarbageStations = result;
		return this.GgarbageStations;
	}

	private _ResourceRoleList?: Array<ResourceRole>;

	getResourceRoleList = async () => {

		if (this._ResourceRoleList) {
			return this._ResourceRoleList;
		}


		let result = new Array<ResourceRole>();

		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			let promise = await this.service.division.list({ ParentId: role.Id });
			result = result.concat(promise.Data.map(x => {
				let r = new ResourceRole();
				r.Id = x.Id;
				r.Name = x.Name;
				r.ResourceType = ResourceType.County;
				return r;
			}))
		}
		this._ResourceRoleList = result;
		return result;

	}


	getEventListParams(day: OneDay, page: Paged, type: EventType, ids?: string[]) {
		const params = {
			BeginTime: day.begin.toISOString(),
			EndTime: day.end.toISOString(),
			PageSize: page.size,
			PageIndex: page.index,
			Desc: true,
			DivisionIds: this.roles.map(x => x.Id)
		}
		if (ids) {
			params.DivisionIds = ids;
		}
		return params;
	}


}
