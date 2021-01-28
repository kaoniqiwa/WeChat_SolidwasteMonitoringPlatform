import { EventNumber } from "../../data-core/model/waste-regulation/event-number";
import { AppEChart } from "../../common/echart-line";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { dateFormat, getAllDay } from "../../common/tool";
import { Service } from "../../data-core/repuest/service";
import { ResourceType } from "../../data-core/model/we-chat";
import { IDataController, StatisticNumber } from "./data-controllers/IController";
import { ControllerFactory } from "./data-controllers/ControllerFactory";


declare var weui: any;

namespace GarbageCondition {

	var date = new Date();
	const bgColor = ['red-bg', 'red-bg', 'red-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg', 'orange-bg'];




	export class IllegalDropHistoryChart {
		constructor(private page: Page) {
		}

		convert(datas: Array<EventNumber>): AppEChart.LineOption {
			const lc = this.joinPart(new AppEChart.LineOption());
			lc.seriesData = new Array();

			for (let i = 0; i < datas.length; i++) {
				const data = datas[i];
				lc.seriesData.push(data.DeltaNumber);
			}
			return lc;
		}

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

		constructor(private page: Page) { }



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
		constructor(private page: Page) { }

		async view(data: StatisticNumber) {
			this.page.element.count.illegalDrop.innerHTML = data.illegalDropNumber.toString();
			this.page.element.count.hybridPush.innerHTML = data.hybridPushNumber.toString();
		}
	}



	class Page {



		type: ResourceType;

		history: GarbageCondition.IllegalDropHistoryChart;
		order: GarbageCondition.IllegalDropOrder;
		count: GarbageCondition.DivisionGarbageCount;
		constructor(private dataController:IDataController) {
			this.type = user.WUser.Resources![0].ResourceType;
			this.history = new GarbageCondition.IllegalDropHistoryChart(this);
			this.order = new GarbageCondition.IllegalDropOrder(this);
			this.count = new GarbageCondition.DivisionGarbageCount(this);

			
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



		loadData() {

			

			let day = getAllDay(date);

			let historyData = this.dataController.getHistory(day);

			historyData.then(x => {
				if (x) {
					let opts = this.history.convert(x);

					this.history.view(opts);
				}
			});


			const promise = this.dataController.getIllegalDropList(day);
			promise.then(data => {
				if (data) {
					const items = data.sort((a, b) => {
						return b.count - a.count;
					}).splice(0, 10);

					const viewModel = items.map(x => {
						return {
							name: x.name,
							subName: x.count,
							subNameAfter: '起'
						}
					})
					this.order.view(viewModel);
				}
			})

			let eventCountPromise = this.dataController.getEventCount(day)
			eventCountPromise.then(data => {
				this.count.view(data);
			})

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


	const user = new SessionUser();
	if (user.WUser.Resources) {
		const type = user.WUser.Resources![0].ResourceType;

		new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {

			const service = new Service(http);
			const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);
			const page = new Page(dataController);
			page.init();
			page.loadData();

		});
	}

}





