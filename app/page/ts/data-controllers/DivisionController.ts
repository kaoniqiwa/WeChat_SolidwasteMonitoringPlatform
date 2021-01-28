import { Response } from "../../../data-core/model/response";
import { PagedList, TimeUnit } from "../../../data-core/model/page";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "../../../data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatistic, GetDivisionStatisticNumbersParams } from "../../../data-core/model/waste-regulation/division-number-statistic";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { IDataController, IGarbageStationController, IllegalDropItem, OneDay } from "./IController";
import { DataController } from "./DataController";

export class DivisionController extends DataController implements IDataController, IGarbageStationController {
	constructor(service: Service, roles: ResourceRole[]) {
		super(service, roles)
	}
	getEventCount = async (day: OneDay) => {
		let result = {
			id:"",
			illegalDropNumber: 0,
			hybridPushNumber: 0
		}
		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			const response = await this.service.division.eventNumbersHistory({
				TimeUnit: TimeUnit.Day,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString(),
			}, role.Id)
			if (response.Data.Data && response.Data.Data.length > 0) {
				result.id = role.Id;
				result.illegalDropNumber += response.Data.Data[0].EventNumbers.find(x => x.EventType == EventType.IllegalDrop)!.DayNumber;
				result.hybridPushNumber += response.Data.Data[0].EventNumbers.find(x => x.EventType == EventType.MixedInto)!.DayNumber;
			}
		}
		return result;
	}


	private getDayNumber(source: EventNumberStatistic, type: EventType): number;
	private getDayNumber(source: DivisionNumberStatistic, type: EventType): number;
	private getDayNumber(source: EventNumberStatistic | DivisionNumberStatistic, type: EventType): number {
		let count = 0;
		if (source instanceof EventNumberStatistic) {
			let filter = source.EventNumbers.filter(x => x.EventType == type);
			filter.forEach(x => {
				count += x.DayNumber;
			})
		}
		else if (source instanceof DivisionNumberStatistic) {
			if (source.TodayEventNumbers) {
				let filter = source.TodayEventNumbers.filter(x => x.EventType == type);
				filter.forEach(y => {
					count += y.DayNumber;
				});
			}
		}
		else {
			return 0;
		}
		return count;
	}

	getIllegalDropListInToday = async (sources: ResourceRole[]): Promise<Array<IllegalDropItem>> => {
		const responseStatistic = await this.service.division.statisticNumberList({
			Ids: sources.map(x => x.Id)
		});
		return responseStatistic.Data.Data.map(x => {
			return {
				id: x.Id,
				name: x.Name,
				count: this.getDayNumber(x, EventType.IllegalDrop)
			}
		});
	}

	getIllegalDropListInOtherDay = async (day: OneDay, sources: ResourceRole[]): Promise<Array<IllegalDropItem>> => {
		let result = new Array<IllegalDropItem>();
		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];

			const response = await this.service.division.eventNumbersHistory({
				TimeUnit: TimeUnit.Day,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString()
			}, source.Id)
			response.Data.Data.forEach(x => {
				result.push({
					id: source.Id,
					name: source.Name!,
					count: this.getDayNumber(x, EventType.IllegalDrop)
				});
			})
		}
		return result;
	}

	getIllegalDropList = async (day: OneDay): Promise<Array<IllegalDropItem>> => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const dataDate = new Date(day.begin.getFullYear(), day.begin.getMonth(), day.begin.getDate());

		if (dataDate.getTime() - today.getTime() >= 0) {
			return this.getIllegalDropListInToday(this.roles);
		}
		else {
			return this.getIllegalDropListInOtherDay(day, this.roles);
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




	getResourceRoleList = async () => {
		let promise = await this.service.division.list({ Ids: this.roles.map(x => x.Id) });

		return promise.Data.Data.map(x => {
			let role = new ResourceRole();
			role.ResourceType = ResourceType.Committees;
			role.Id = x.Id;
			role.Name = x.Name;
			return role;
		});

	}
}
