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
import Swiper, { Pagination } from 'swiper';

Swiper.use([Pagination])

declare var weui: any;

namespace GarbageCondition {

	var date = new Date();



	export class HistoryChart {
		constructor(private page: Page) {
		}

		convert(datas: Array<EventNumber>): AppEChart.LineOption {
			const lc = this.joinPart(new AppEChart.LineOption());
			lc.seriesData = new Array();
			lc.boundaryGap = true;

			for (let i = 0; i < datas.length; i++) {
				const data = datas[i];
				lc.seriesData.push(data.DeltaNumber);
			}
			return lc;
		}

		async view(opts: AppEChart.LineOption, elements: HTMLElement[]) {

			elements.forEach(element => {
				new AppEChart.EChartLine().init(element, opts)
			})
		}

		private joinPart(t1: AppEChart.LineOption) {
			t1.xAxisData = [];
			for (let i = 0; i <= 12; i++) {
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

	export class GarbageDropOrder {
		constructor(private page: Page) { }



		async view(viewModel: Array<{ name: string, subName: number, subNameAfter: string }>, target: HTMLElement) {

			var html = '';
			target.innerHTML = '';
			for (let i = 0; i < viewModel.length; i++) {
				const t = viewModel[i];
				html += ` <div class=" top5-list-wrap">
                              <div class="pull-left number-item ${i < 3 ? 'red-bg' : "orange-bg"}">
                                  <label class="white-text ">${i + 1}</label>
                              </div>
                              <div class="pull-left">${t.name}</div>
                              <div class="pull-right sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
                          </div> `;

			}
			target.insertAdjacentHTML('afterbegin', html);

		}
	}

	export class DivisionGarbageCount {
		constructor(private page: Page) { }

		async view(data: StatisticNumber) {
			this.page.element.count.illegalDrop.innerHTML = data.illegalDropNumber.toString();
			this.page.element.count.hybridPush.innerHTML = data.mixedIntoNumber.toString();
		}
	}



	class Page {

		type: ResourceType;

		history: GarbageCondition.HistoryChart;
		dropOrder: GarbageCondition.GarbageDropOrder;

		count: GarbageCondition.DivisionGarbageCount;
		constructor(private dataController: IDataController) {
			this.type = user.WUser.Resources![0].ResourceType;
			this.history = new GarbageCondition.HistoryChart(this);
			this.dropOrder = new GarbageCondition.GarbageDropOrder(this);
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
				mixDrop: document.getElementById("top2")!,
			},
			chart: {
				illegalDrop: Array.from(document.querySelectorAll<HTMLElement>(".illegalChart")),
				mixDrop: Array.from(document.querySelectorAll<HTMLElement>(".mixIntoChart"))
			}
		}



		loadData() {


			/**
			 *  swiper会根据 loop:true,复制一份Dom,
			 *  所以先初始化swiper,再echart
			 *   在用echart时，dom元素为类选择器
			 */
			new Swiper("#diagram", {
				loop: true,
				pagination:{
					el:'#chart-pagination'
				}
			})


			let day = getAllDay(date);

			let historyData = this.dataController.getHistory(day);

			historyData.then(datas => {
				console.log('datas', datas)
				if (datas && "IllegalDrop" in datas) {
					let illegalOpts = this.history.convert(datas.IllegalDrop);
					let mixinOpts = this.history.convert(datas.MixedInto);


					this.element.chart.illegalDrop = Array.from(document.querySelectorAll<HTMLElement>(".illegalChart"));

					this.history.view(illegalOpts, this.element.chart.illegalDrop);

					this.element.chart.mixDrop = Array.from(document.querySelectorAll<HTMLElement>(".mixIntoChart"))
					this.history.view(mixinOpts, this.element.chart.mixDrop);

				}
			});



			const promise = this.dataController.getStatisticNumberList(day);
			promise.then(data => {
				if (data) {
					console.log('居委会信息', data)
					const items = data.sort((a, b) => {
						return b.illegalDropNumber - a.illegalDropNumber;
					})

					const viewModel = items.map(x => {
						return {
							name: x.name,
							subName: x.illegalDropNumber,
							subNameAfter: '起'
						}
					})
					this.dropOrder.view(viewModel, this.element.list.illegalDrop);

					// 混合投放排行榜
					const items2 = data.sort((a, b) => {
						return b.mixedIntoNumber - a.mixedIntoNumber;
					})
					const viewModel2 = items2.map(x => {
						return {
							name: x.name,
							subName: x.mixedIntoNumber,
							subNameAfter: '起'
						}
					})
					this.dropOrder.view(viewModel2, this.element.list.mixDrop);


					// 等待dom数据填充进去再创建swiper,否则显示空白div
					let swiper = new Swiper("#rank", {
						loop: true,
						pagination: {
							el: '#rank-pagination'
						}
					})

					console.log(swiper)
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

	console.log(user)
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




