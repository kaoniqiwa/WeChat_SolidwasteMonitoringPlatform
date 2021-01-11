import { EventNumber } from "../../data-core/model/waste-regulation/event-number";
import { DivisionRequestDao } from "../../data-core/dao/division-request";
import { GarbageStationRequestDao } from "../../data-core/dao/garbage-station-request";
import { AppEChart } from "../../common/echart-line";
import { DivisionTypeEnum, ResourceRoleType } from "../../common/enum-helper";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { User } from "../../data-core/url/user-url";
import { Division } from "../../data-core/model/waste-regulation/division";
import { dateFormat, getAllDay } from "../../common/tool";
import { Service } from "../../data-core/repuest/service";
import { TimeUnit } from "../../data-core/model/page";

declare var MiniRefresh: any;
declare var weui: any;

namespace GarbageCondition {

	var date = new Date();
	const bgColor = ['red-bg', 'red-bg', 'red-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg'];


	export class IllegalDropHistory {
		constructor(private user: SessionUser, private service: Service) {

		}


		async getData() {
			const model = new IllegalDropEventData()
				, request = new DivisionRequestDao.DivisionRequest()
			dateFormat
			model.datas = new Array();
			if (this.user.WUser.Resources && this.user.WUser.Resources.length) {
				const day = getAllDay(date);
				const data = await this.service.division.eventNumbersHistory({

					PageIndex: 1,
					PageSize: 999,
					BeginTime: day.begin.toISOString(),
					EndTime: day.end.toISOString(),
					TimeUnit: TimeUnit.Hour
				}, this.user.WUser.Resources[0].Id)
				for (var x of data.Data.Data) {
					for (const y of x.EventNumbers)
						if (y.EventType == EventTypeEnum.IllegalDrop)
							model.datas.push(y);
				}
				return model;
			}
		}

		Convert(input: IllegalDropEventData): AppEChart.LineOption {
			const lc = this.joinPart(new AppEChart.LineOption());
			var enters1 = new Array<EventNumber>();
			for (let i = 0; i < input.datas.length; i++) {
				enters1.push(input.datas[i]);
			}
			lc.seriesData = new Array();
			for (const x of enters1)
				lc.seriesData.push(x.DeltaNumber);
			return lc;
		}

		async init() {

			const datas = await this.getData();
			if (datas) {
				const chartOptions = this.Convert(datas);
				new AppEChart.EChartLine().init(document.getElementById('chart'), chartOptions);
			}
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
				if (this.user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {

					const divisionIds = divisions.filter(x => x.DivisionType == DivisionTypeEnum.Committees).map(x => x.Id);
					console.log("divisionIds", divisionIds);

					const now = new Date();
					const today = new Date(now.getHours(), now.getMonth() + 1, now.getDate());
					const dataDate = new Date(date.getHours(), date.getMonth() + 1, date.getDate());

					if (dataDate.getTime() - today.getTime() >= 0) {
						const responseStatistic = await this.service.division.statisticNumberList({ Ids: divisionIds });
						for (const x of responseStatistic.Data.Data) {
							const info = new IllegalDropInfo();
							model.items.push(info);
							info.division = x.Name;
							info.dropNum = 0;
							for (const v of x.TodayEventNumbers)
								if (v.EventType == EventTypeEnum.IllegalDrop)
									info.dropNum += v.DayNumber;
						}
					}
					else {
						for (let i = 0; i < divisions.length; i++) {
							const division = divisions[i];
							if (division.DivisionType == DivisionTypeEnum.County)
								continue;
							const day = getAllDay(date);
							const response = await this.service.division.eventNumbersHistory({
								TimeUnit: TimeUnit.Day,
								BeginTime: day.begin.toISOString(),
								EndTime: day.end.toISOString()
							}, division.Id)
							const info = new IllegalDropInfo();
							info.division = division.Name;

							let numbers = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventTypeEnum.IllegalDrop);
							if (numbers && numbers.length > 0) {
								info.dropNum = numbers[0].DayNumber;
							}
							info.unit = "起";
							model.items.push(info);
						}

					}
				}
				else if (this.user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
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
								if (v.EventType == EventTypeEnum.IllegalDrop)
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
			const model = new Specification();

			model.illegalDropNumber = 0;
			if (this.user.WUser.Resources[0].ResourceType == ResourceRoleType.County) {
				const now = new Date();
				const today = new Date(now.getHours(), now.getMonth() + 1, now.getDate());
				const dataDate = new Date(date.getHours(), date.getMonth() + 1, date.getDate());

				if (dataDate.getTime() - today.getTime() >= 0) {
					// 今天

					const divisionIds = divisions.filter(x => x.DivisionType == DivisionTypeEnum.County).map(y => {
						return y.Id;
					});
					const res = await this.service.division.statisticNumberList({ Ids: divisionIds });

					for (let i = 0; i < res.Data.Data.length; i++) {
						const data = res.Data.Data[i];
						let filter = data.TodayEventNumbers.filter(x => { return x.EventType == EventTypeEnum.IllegalDrop });
						if (filter && filter.length > 0) {
							model.illegalDropNumber += filter[0].DayNumber;
						}
						filter = data.TodayEventNumbers.filter(x => { return x.EventType == EventTypeEnum.MixedInto });
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
					model.illegalDropNumber = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventTypeEnum.IllegalDrop)[0].DayNumber;
					model.hybridPushNumber = response.Data.Data[0].EventNumbers.filter(x => x.EventType == EventTypeEnum.MixedInto)[0].DayNumber;
				}

			}
			else if (this.user.WUser.Resources[0].ResourceType == ResourceRoleType.Committees) {
				const responseStations = await this.service.garbageStation.list({ DivisionId: this.user.WUser.Resources[0].Id });
				const stationIds = new Array<string>();


				for (const x of responseStations.Data.Data)
					stationIds.push(x.Id);
				if (stationIds.length) {
					const responseData = await this.service.garbageStation.statisticNumberList({ Ids: stationIds });
					for (const x of responseData.Data.Data) {
						for (const v of x.TodayEventNumbers)
							if (v.EventType == EventTypeEnum.IllegalDrop)
								model.illegalDropNumber += v.DayNumber;
							else if (v.EventType == EventTypeEnum.MixedInto)
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
			const viewModel = this.Convert(datas);
			if (viewModel && viewModel.length) {
				this.page.element.count.illegalDrop.innerHTML = viewModel[0].toString();
				this.page.element.count.hybridPush.innerHTML = viewModel[1].toString();
			}
		}
	}


	class IllegalDropEventData {
		datas!: EventNumber[];
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


	enum EventTypeEnum {
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
			this.history = new GarbageCondition.IllegalDropHistory(user, service);
			this.order = new GarbageCondition.IllegalDropOrder(this, user, service);
			this.count = new GarbageCondition.DivisionGarbageCount(this, user, service);
		}

		element = {
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

			this.history.init();
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
							console.log(result);

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





