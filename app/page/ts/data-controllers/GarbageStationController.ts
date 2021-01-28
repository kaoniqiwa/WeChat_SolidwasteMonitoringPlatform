import { PagedList, TimeUnit } from "../../../data-core/model/page";
import { EventNumberStatistic } from "../../../data-core/model/waste-regulation/division-event-numbers";
import { EventNumber, EventType } from "../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { DataController } from "./DataController";
import { IDataController, IGarbageStationController, IllegalDropItem, OneDay, StatisticNumber } from "./IController";

export class GarbageStationController extends DataController implements IDataController, IGarbageStationController {

	constructor(service: Service, roles: ResourceRole[]) {
		super(service, roles)
	}

	getTimeUnit(date: Date) {

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const dataDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		if (dataDate.getTime() - today.getTime() >= 0) {
			return TimeUnit.Hour;
		}
		else {
			return TimeUnit.Day;
		}
	}

	getEventCount = async (day: OneDay) => {
		let result = {
			id:"",
			illegalDropNumber: 0,
			hybridPushNumber: 0
		}

		let timeUnit = this.getTimeUnit(day.begin)


		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			const response = await this.service.garbageStation.eventNumbersHistory({
				TimeUnit: timeUnit,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString(),
			}, role.Id)
			if (response.Data.Data && response.Data.Data.length > 0) {
				for (let i = 0; i < response.Data.Data.length; i++) {
					const data = response.Data.Data[i];
					result.id = role.Id;
					result.illegalDropNumber += data.EventNumbers.filter(x => x.EventType == EventType.IllegalDrop)[0].DayNumber;
					result.hybridPushNumber += data.EventNumbers.filter(x => x.EventType == EventType.MixedInto)[0].DayNumber;
				}

			}
		}
		return result;
	}



	private getDayNumber(source: EventNumberStatistic) {

		let count = 0;
		let filter = source.EventNumbers.filter(x => x.EventType == EventType.IllegalDrop);
		filter.forEach(x => {
			count += x.DayNumber;
		})
		return count;
	}


	getIllegalDropList = async (day: OneDay) => {
		let result = new Array<IllegalDropItem>();

		const timeUnit = this.getTimeUnit(day.begin);

		for (let i = 0; i < this.roles.length; i++) {
			const source = this.roles[i];

			const response = await this.service.garbageStation.eventNumbersHistory({
				TimeUnit: timeUnit,
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString()
			}, source.Id);

			let count = 0;

			response.Data.Data.forEach(x => {
				count += this.getDayNumber(x);
			})
			result.push({
				id: source.Id,
				name: source.Name!,
				count: count
			});
		}
		return result;
	}
	getHistory = async (day: OneDay) => {
		let datas: Array<EventNumberStatistic> = [];

		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];
			const data = await this.service.garbageStation.eventNumbersHistory({
				BeginTime: day.begin.toISOString(),
				EndTime: day.end.toISOString(),
				TimeUnit: TimeUnit.Hour
			}, role.Id)

			if (datas.length > 0) {
				for (let i = 0; i < datas.length; i++) {
					const item = datas[i];
					datas[i] = EventNumberStatistic.Plus(datas[i], data.Data.Data[i]);
				}
			}
			else {
				datas = data.Data.Data;
			}
		}
		let result = new Array<EventNumber>()
		for (let i = 0; i < datas.length; i++) {

			const item = datas[i].EventNumbers.find(x => x.EventType == EventType.IllegalDrop);
			if (item) {
				result.push(item);
			}
		}


		return result;
	}

	getGarbageStationList = async () => {
		let promise = await this.service.garbageStation.list({ Ids: this.roles.map(x => x.Id) });
		return promise.Data.Data;
	}


	getResourceRoleList = async () => {

		let promise = await this.service.garbageStation.list({ Ids: this.roles.map(x => x.Id) });
		return promise.Data.Data.map(x => {
			let role = new ResourceRole();
			role.Id = x.Id;
			role.Name = x.Name;
			role.ResourceType = ResourceType.GarbageStations;
			return role;
		});
	}

}

