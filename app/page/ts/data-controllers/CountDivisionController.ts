
import { Response } from "../../../data-core/model/response";
import { PagedList, TimeUnit } from "../../../data-core/model/page";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "../../../data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatistic, GetDivisionStatisticNumbersParams } from "../../../data-core/model/waste-regulation/division-number-statistic";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { IDataController, IGarbageStationController, OneDay, Paged, StatisticNumber } from "./IController";
import { DataController } from "./DataController";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/mixed-into-event-record";
import { dateFormat, enumForeach } from "../../../common/tool";
import { GetEventRecordsParams } from "../../../data-core/model/waste-regulation/event-record";
import { GarbageFullEventRecord } from "../../../data-core/model/waste-regulation/garbage-full-event-record";

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


	getGarbageStationStatisticNumberListInToday = async (sources:ResourceRole[]):Promise<Array<StatisticNumber>>=>{
		const responseStatistic = await this.service.garbageStation.statisticNumberList({
			Ids: sources.map(x => x.Id)
		});
		return responseStatistic.Data.Data.map(x => {
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
		return responseStatistic.Data.Data.map(x => {
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
			response.Data.Data.forEach(x => {
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

	getStatisticNumberList = async (day: OneDay): Promise<Array<StatisticNumber>> => {
		
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const dataDate = new Date(day.begin.getFullYear(), day.begin.getMonth(), day.begin.getDate());

		let roles = await this.getResourceRoleList()

		if (dataDate.getTime() - today.getTime() >= 0) {
			return this.getStatisticNumberListInToday(roles);
		}
		else {
			return this.getStatisticNumberListInOtherDay(day, roles);
		}
	}

	getHistory = async (day: OneDay) => {
		const result = new Array<EventNumber>();
		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			const data = await this.service.division.eventNumbersHistory({
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString(),
				TimeUnit: TimeUnit.Hour
			}, role.Id)

			for (var x of data.Data.Data) {
				for (const y of x.EventNumbers)
					if (y.EventType == EventType.IllegalDrop)
						result.push(y);
			}
		}

		let alldayCount = await this.getEventCount(day);
		let count = result[result.length - 1].DayNumber;
		let current = alldayCount.illegalDropNumber - count;

		let thelast = new EventNumber();
		thelast.DayNumber = current;
		thelast.EventType = EventType.IllegalDrop;
		thelast.DeltaNumber = current;

		result.push(thelast);

		return result;
	}

	getGarbageStationList = async () => {
		
		let result = new Array<GarbageStation>();
		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			const promise = await this.service.garbageStation.list({ DivisionId: role.Id });
			result = result.concat(promise.Data.Data);
		}
		result = result.sort((a, b) => {
			return a.DivisionId!.localeCompare(a.DivisionId!) || a.Name.localeCompare(b.Name);
		})
		return result;
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
			result = result.concat(promise.Data.Data.map(x => {
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
		const params = new GetEventRecordsParams();
		params.BeginTime = day.begin.toISOString();
		params.EndTime = day.end.toISOString();
		params.PageSize = page.size;
		params.PageIndex = page.index;
		params.Desc = true;

		params.DivisionIds = this.roles.map(x => x.Id);

		if (ids) {
			params.DivisionIds = ids;
		}
		return params;
	}


}
