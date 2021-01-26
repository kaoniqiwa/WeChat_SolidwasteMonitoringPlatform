import { EventNumber } from "../../data-core/model/waste-regulation/event-number";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { AppEChart } from "../../common/echart-line";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { User } from "../../data-core/url/user-url";
import { Division, DivisionType } from "../../data-core/model/waste-regulation/division";
import { dateFormat, getAllDay } from "../../common/tool";
import { Service } from "../../data-core/repuest/service";
import { TimeUnit } from "../../data-core/model/page";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";

declare var MiniRefresh: any;
declare var weui: any;

namespace GarbageCondition {

	var date = new Date();
	const bgColor = ['red-bg', 'red-bg', 'red-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg'];

	interface IIllegalDropHistory {
		getData(dat: { begin: Date, end: Date }): Promise<IllegalDropEventData>;
	}
	interface IllegalDropHistoryPage {
		convert(input: IllegalDropEventData): AppEChart.LineOption;
		view(data: AppEChart.LineOption): void;
	}

	class DivisionIllegalDropHistory implements IIllegalDropHistory {
		constructor(private service: Service, private roles: ResourceRole[]) {

		}
		async getData(day: { begin: Date, end: Date }): Promise<IllegalDropEventData> {
			const model = new IllegalDropEventData();
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
							model.datas.push(y);
				}
			}
			
			return model;
		}
	}
	class GarbageStationIllegalDropHistory implements IIllegalDropHistory {
		constructor(private service: Service, private roles: ResourceRole[]) {

		}
		async getData(day: { begin: Date, end: Date }): Promise<IllegalDropEventData> {
			const model = new IllegalDropEventData();
			for (let i = 0; i < this.roles.length; i++) {
				const role = this.roles[i];
				const data = await this.service.garbageStation.eventNumbersHistory({
					BeginTime: day.begin.toISOString(),
					EndTime: day.end.toISOString(),
					TimeUnit: TimeUnit.Hour
				}, role.Id)
				for (var x of data.Data.Data) {
					for (const y of x.EventNumbers)
						if (y.EventType == EventType.IllegalDrop)
							model.datas.push(y);
				}
			}
			return model;
		}
	}


	export class IllegalDropHistory implements IllegalDropHistoryPage {
		constructor(private page: Page, private user: SessionUser, private service: Service) {

		}

		async getData() {

			var base!: IIllegalDropHistory;
			const model = new IllegalDropEventData()
			model.datas = new Array();
			if (this.user.WUser.Resources && this.user.WUser.Resources.length) {
				switch (this.user.WUser.Resources[0].ResourceType) {
					case ResourceType.County:
					case ResourceType.Committees:
						base = new DivisionIllegalDropHistory(this.service, this.user.WUser.Resources)
						break;
					case ResourceType.GarbageStations:
						base = new GarbageStationIllegalDropHistory(this.service, this.user.WUser.Resources);
						break;
					default:
						break;
				}
				const day = getAllDay(date);
				return base.getData(day);

			}
		}

		convert(input: IllegalDropEventData): AppEChart.LineOption {
			const lc = this.joinPart(new AppEChart.LineOption());
			lc.seriesData = new Array();

			for (let i = 0; i < input.datas.length; i++) {
				const data = input.datas[i];
				lc.seriesData.push(data.DeltaNumber);
			}
			return lc;
		}

		// async init() {

		// 	const datas = await this.getData();
		// 	if (datas) {
		// 		const chartOptions = this.convert(datas);
		// 		new AppEChart.EChartLine().init(this.page.element.chart, chartOptions);
		// 	}
		// }
		async view(opts: AppEChart.LineOption) {
			
			new AppEChart.EChartLine().init(this.page.element.chart.illegalDrop, opts);
		}

		private joinPart(t1: AppEChart.LineOption) {
			t1.xAxisData = [];
			for (let i = 1; i <= 12; i++) {
				if (i < 10)
					t1.xAxisData.push('0' + i + ':00');
				else
					t1.xAxisData.push(i + ':00');
			}
			for (let i = 13; i <= 24; i++) {
				if (i == 24)
					t1.xAxisData.push('23' + ':59');
				else
					t1.xAxisData.push(i + ':00');
			}
			return t1;
		}


	}

	export class IllegalDropOrder {

		constructor(
			private page: Page,
			private user: SessionUser,
			private service: Service

		) { }


		async getData(divisions: Division[]) {
			const model = new IllegalDropOrderInfo();
			model.items = new Array();
			if (this.user.WUser.Resources && this.user.WUser.Resources.length) {
				if (this.user.WUser.Resources[0].ResourceType == ResourceType.County) {

					const divisionIds = divisions.filter(x => x.DivisionType == DivisionType.Committees).map(x => x.Id);
					

					const now = new Date();
					const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
					const dataDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

					if (dataDate.getTime() - today.getTime() >= 0) {
						const responseStatistic = await this.service.division.statisticNumberList({ Ids: divisionIds });
						for (const x of responseStatistic.Data.Data) {
							const info = new IllegalDropInfo();
							model.items.push(info);
							info.division = x.Name;
							info.dropNum = 0;
							for (const v of x.TodayEventNumbers)
								if (v.EventType == EventType.IllegalDrop)
									info.dropNum += v.DayNumber;
						}
					}
					else {
						for (let i = 0; i < divisions.length; i++) {
							const division = divisions[i];
							if (division.DivisionType == DivisionType.County)
								continue;
							const day = getAllDay(date);
							const response = await this.service.division.eventNumbersHistory({
								TimeUnit: TimeUnit.Day,
								BeginTime: day.begin.toISOString(),
								EndTime: day.end.toISOString()
							}, division.Id)
							const info = new IllegalDropInfo();
							info.division = division.Name;
							if (response.Data.Data && response.Data.Data.length > 0) {
								let numbers = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventType.IllegalDrop);
								if (numbers && numbers.length > 0) {
									info.dropNum = numbers[0].DayNumber;
								}
								info.unit = "起";
								model.items.push(info);
							}
						}

					}
				}
				else if (this.user.WUser.Resources[0].ResourceType == ResourceType.Committees) {
					const responseStations = await this.service.garbageStation.list({ DivisionId: this.user.WUser.Resources[0].Id })
					const stationIds = new Array<string>();




					for (const x of responseStations.Data.Data)
						stationIds.push(x.Id);
					if (stationIds.length) {
						const responseStatistic = await this.service.garbageStation.statisticNumberList({ Ids: stationIds });
						for (const x of responseStatistic.Data.Data) {
							const info = new IllegalDropInfo();
							model.items.push(info);
							info.division = x.Name;
							info.dropNum = 0;
							for (const v of x.TodayEventNumbers)
								if (v.EventType == EventType.IllegalDrop)
									info.dropNum += v.DayNumber;
						}
					}
				}
				return model;
			}
		}

		async view(viewModel: Array<{ name: string, subName: number, subNameAfter: string }>) {
			
			var html = '';
			this.page.element.list.illegalDrop.innerHTML = '';
			for (let i = 0; i < viewModel.length; i++) {
				const t = viewModel[i];
				if (i == viewModel.length - 1) {
					html += ` <div class="fill-width top5-list-wrap m-b-10">
                                        <div class="pull-left number-item text-center m-r-10  ${bgColor[i]}">
                                            <label class="white-text ">${i + 1}</label>
                                        </div>
                                        <div class="pull-left card-box-title width black-text">${t.name}</div>
                                        <div class="pull-right card-box-title sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
                                    </div> `;
				}
				else html += ` <div class="fill-width top5-list-wrap =">
                              <div class="pull-left number-item text-center m-r-10  ${bgColor[i]}">
                                  <label class="white-text ">${i + 1}</label>
                              </div>
                              <div class="pull-left card-box-title width black-text">${t.name}</div>
                              <div class="pull-right card-box-title sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
                          </div> `;

			}
			this.page.element.list.illegalDrop.insertAdjacentHTML('afterbegin', html);

		}
	}


	export class DivisionGarbageCount {
		constructor(
			private page: Page,
			private user: SessionUser,
			private service: Service) {

		}
		async getData(divisions: Division[]) {
			if (!this.user.WUser.Resources) {
				return;
			}
			
			const model = new Specification();

			model.illegalDropNumber = 0;
			if (this.user.WUser.Resources[0].ResourceType == ResourceType.County) {
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				const dataDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

				if (dataDate.getTime() - today.getTime() >= 0) {
					// 今天
					debugger;
					const divisionIds = divisions.filter(x => x.DivisionType == DivisionType.County).map(y => {
						return y.Id;
					});
					const res = await this.service.division.statisticNumberList({ Ids: divisionIds });

					for (let i = 0; i < res.Data.Data.length; i++) {
						const data = res.Data.Data[i];
						let filter = data.TodayEventNumbers.filter(x => { return x.EventType == EventType.IllegalDrop });
						if (filter && filter.length > 0) {
							model.illegalDropNumber += filter[0].DayNumber;
						}
						filter = data.TodayEventNumbers.filter(x => { return x.EventType == EventType.MixedInto });
						if (filter && filter.length > 0) {
							model.hybridPushNumber += filter[0].DayNumber;
						}
					}
				}
				else {
					const day = getAllDay(date);
					const response = await this.service.division.eventNumbersHistory({
						TimeUnit: TimeUnit.Day,
						BeginTime: day.begin.toISOString(),
						EndTime: day.end.toISOString(),
					}, this.user.WUser.Resources[0].Id)
					if (response.Data.Data && response.Data.Data.length > 0) {
						model.illegalDropNumber = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventType.IllegalDrop)[0].DayNumber;
						model.hybridPushNumber = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventType.MixedInto)[0].DayNumber;
					}
				}

			}
			else if (this.user.WUser.Resources[0].ResourceType == ResourceType.Committees) {
				const responseStations = await this.service.garbageStation.list({ DivisionId: this.user.WUser.Resources[0].Id });
				const stationIds = new Array<string>();


				for (const x of responseStations.Data.Data)
					stationIds.push(x.Id);
				if (stationIds.length) {
					const responseData = await this.service.garbageStation.statisticNumberList({ Ids: stationIds });
					for (const x of responseData.Data.Data) {
						for (const v of x.TodayEventNumbers)
							if (v.EventType == EventType.IllegalDrop)
								model.illegalDropNumber += v.DayNumber;
							else if (v.EventType == EventType.MixedInto)
								model.hybridPushNumber += v.DayNumber;
					}
				}
			}
			return model;
		}

		Convert(input: Specification): number[] {
			return [input.illegalDropNumber, 0];
		}

		async view(divisions: Division[]) {
			
			const datas = await this.getData(divisions);
			
			
			if (datas) {
				const viewModel = this.Convert(datas);
				if (viewModel && viewModel.length) {
					this.page.element.count.illegalDrop.innerHTML = viewModel[0].toString();
					this.page.element.count.hybridPush.innerHTML = viewModel[1].toString();
				}
			}
		}
	}


	class IllegalDropEventData {
		datas: EventNumber[] = [];
	}

	class IllegalDropOrderInfo {
		items!: IllegalDropInfo[];
	}

	export class Specification {
		/**投放点 */
		garbagePushNumber = 0;
		/**垃圾桶 */
		garbageBarrelNumber = 0;
		/**满溢 */
		fullPushNumber = 0;
		/**乱扔行为 */
		illegalDropNumber = 0;
		/**混合行为 */
		hybridPushNumber = 0;
	}


	class IllegalDropInfo {
		division!: string;
		dropNum!: number;
		unit!: string;
	}
	export class OrderTable {
		table!: {
			name: string;
			subName: string;
			subNameAfter: string;
		}[]
	}


	enum EventType {
		IllegalDrop = 1,
		MixedInto,
		GarbageVolume,
		GarbageFull
	}


	class Page {


		history: GarbageCondition.IllegalDropHistory;
		order: GarbageCondition.IllegalDropOrder;
		count: GarbageCondition.DivisionGarbageCount;
		constructor(private user: SessionUser, private service: Service) {
			this.history = new GarbageCondition.IllegalDropHistory(this, user, service);
			this.order = new GarbageCondition.IllegalDropOrder(this, user, service);
			this.count = new GarbageCondition.DivisionGarbageCount(this, user, service);
		}

		element = {
			orderPanel: document.getElementById("top-div") as HTMLDivElement,
			date: document.getElementById("date")!,
			datePicker: document.getElementById("showDatePicker")!,
			count: {
				illegalDrop: document.getElementById("illegalDrop")!,
				hybridPush: document.getElementById("hybridPush")!
			},
			list: {
				illegalDrop: document.getElementById("top")!,
			},
			chart: {
				illegalDrop: document.getElementById("chart")!
			}
		}

		async getDivisions() {
			const request = new DivisionRequestDao.DivisionRequest()
				, responseDivisions = await request.getDivisions();
			return responseDivisions.Data.Data;
		}

		divisions?: Division[];

		async getDivision(): Promise<Division[]> {
			if (this.divisions) {
				return this.divisions;
			}
			const promise = this.service.division.list({});
			return promise.then((response) => {
				this.divisions = response.Data.Data;
				return this.divisions;
			});
		}



		loadData() {

			var historyData = this.history.getData();
			
			historyData.then(x => {
				if (x) {
					let opts = this.history.convert(x)
					
					this.history.view(opts);
				}
			});
			const divisionsPromise = this.getDivisions();
			divisionsPromise.then(divisions => {
				const promise = this.order.getData(divisions);
				promise.then(data => {
					if (data) {
						const items = data.items.sort((a, b) => {
							return b.dropNum - a.dropNum;
						}).splice(0, 10);
						
						const viewModel = items.map(x => {
							return {
								name: x.division,
								subName: x.dropNum,
								subNameAfter: '起'
							}
						})
						this.order.view(viewModel);

					}
				})
				
				this.count.view(divisions);

			});
		}




		init() {

			this.viewDatePicker(new Date());
			this.initRefresh();
			this.initDatePicker();
		}

		initRefresh() {

			try {
				var miniRefresh = new MiniRefresh({
					container: '#refreshContainer',
					down: {
						callback: () => {
							setTimeout(() => {
								// 下拉事件
								this.loadData();
								miniRefresh.endDownLoading();
							}, 500);
						}
					},
					up: {
						isLock: true,
						callback: () => {
							miniRefresh.endUpLoading(true);
						}
					}
				});


			} catch (error) {
				console.error(error);
			}
		}

		initDatePicker() {
			try {

				this.element.datePicker.addEventListener('click', () => {
					weui.datePicker({
						start: new Date(2020, 12 - 1, 1),
						end: new Date(),
						onChange: function (result: any) {

						},
						onConfirm: (result: any) => {
							date = new Date(result[0].value, result[1].value - 1, result[2].value);
							
							this.loadData();
							this.viewDatePicker(date);
						},
						title: '请选择日期'
					});
				});
			} catch (ex) {
				console.error(ex);
			}
		}

		viewDatePicker(date: Date) {
			this.element.date.innerHTML = dateFormat(date, "yyyy年MM月dd日");
		}


	}



	new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {

		const user = new SessionUser();
		const service = new Service(http);
		const page = new Page(user, service);
		page.init();
		page.loadData();

	});


}





