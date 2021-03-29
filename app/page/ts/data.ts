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
import { CandlestickOption } from './echart'
import { GarbageStationGarbageCountStatistic } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";

import * as echarts from 'echarts/core';
import {
	GridComponent,
	GridComponentOption,
	TooltipComponentOption,
	TooltipComponent,
	DataZoomComponent,
	DataZoomComponentOption,
	VisualMapComponent,
	VisualMapComponentOption,
} from 'echarts/components';

import { LineChart, LineSeriesOption, BarChart, BarSeriesOption } from 'echarts/charts';

import { CanvasRenderer } from "echarts/renderers";

echarts.use([
	GridComponent,
	LineChart,
	BarChart,
	VisualMapComponent,
	CanvasRenderer,
	TooltipComponent,
	DataZoomComponent
])


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
			this.page.element.count.illegalDropCount.innerHTML = data.illegalDropNumber.toString();
			this.page.element.count.mixIntoCount.innerHTML = data.mixedIntoNumber.toString();
		}
	}



	class Page {

		type: ResourceType;

		history: GarbageCondition.HistoryChart;
		dropOrder: GarbageCondition.GarbageDropOrder;
		candlestickOption: CandlestickOption;
		count: GarbageCondition.DivisionGarbageCount;
		rankSwiper: null | Swiper = null;
		chartSwiper: null | Swiper = null;

		private _activeIndex: number = 0;

		get activeIndex() {
			return this._activeIndex;
		}
		set activeIndex(val) {
			this._activeIndex = val;

			if (this.rankSwiper && this.rankSwiper.slides.length > this.activeIndex) {
				this.rankSwiper.slideTo(this.activeIndex);
			}
			if (this.chartSwiper && this.chartSwiper.slides.length > this.activeIndex) {
				this.chartSwiper.slideTo(this.activeIndex)
			}
		}

		constructor(private dataController: IDataController) {
			this.type = user.WUser.Resources![0].ResourceType;
			this.history = new GarbageCondition.HistoryChart(this);
			this.dropOrder = new GarbageCondition.GarbageDropOrder(this);
			this.count = new GarbageCondition.DivisionGarbageCount(this);
			this.candlestickOption = new CandlestickOption();
		}

		element = {
			orderPanel: document.getElementById("top-div") as HTMLDivElement,
			date: document.getElementById("date")!,
			datePicker: document.getElementById("showDatePicker")!,
			count: {
				illegalDropCount: document.getElementById("illegalDropCount")!,
				mixIntoCount: document.getElementById("mixIntoCount")!
			},
			list: {
				illegalDropRank: document.getElementById("illegalDropRank")!,
				mixIntoRank: document.getElementById("mixIntoRank")!,
				littleGarbageRank: document.getElementById("littleGarbageRank")!,
			},
			chart: {
				illegalDrop: Array.from(document.querySelectorAll<HTMLElement>(".illegalChart")),
				mixDrop: Array.from(document.querySelectorAll<HTMLElement>(".mixIntoChart")),
				littelGarbageChart: document.querySelector<HTMLElement>('#littelGarbageChart')
			}
		}



		loadData() {
			let day = getAllDay(date);

			// 数量接口
			let eventCountPromise = this.dataController.getEventCount(day)
			eventCountPromise.then(data => {
				this.count.view(data);
			})

			// 图表接口
			this.dataController.getHistory(day).then(historyData => {
				if (historyData && "IllegalDrop" in historyData) {

					let illegalOpts = this.history.convert(historyData.IllegalDrop);
					let mixinOpts = this.history.convert(historyData.MixedInto);


					this.element.chart.illegalDrop = Array.from(document.querySelectorAll<HTMLElement>(".illegalChart"));

					this.history.view(illegalOpts, this.element.chart.illegalDrop);

					this.element.chart.mixDrop = Array.from(document.querySelectorAll<HTMLElement>(".mixIntoChart"))
					this.history.view(mixinOpts, this.element.chart.mixDrop);


				} else {
					throw new Error('')
				}
			}).then(() => {
				this.chartSwiper = new Swiper("#diagram", {
					initialSlide: this.activeIndex,
					pagination: {
						el: '#chart-pagination'
					},
					on: {
						slideChange: (swiper) => {
							this.activeIndex = swiper.activeIndex;

						}
					}
				})
			}).catch(error => {

			})

			Promise.all([
				this.dataController.getStatisticNumberList(day),
				this.getGarbageStationNumberStatisticList()
			]).then(([listData, statisticData]) => {

				console.log('居委会信息', listData)
				const items = listData.sort((a, b) => {
					return b.illegalDropNumber - a.illegalDropNumber;
				})

				const viewModel = items.map(x => {
					return {
						name: x.name,
						subName: x.illegalDropNumber,
						subNameAfter: '起'
					}
				})
				this.dropOrder.view(viewModel, this.element.list.illegalDropRank);

				// 混合投放排行榜
				const items2 = listData.sort((a, b) => {
					return b.mixedIntoNumber - a.mixedIntoNumber;
				})
				const viewModel2 = items2.map(x => {
					return {
						name: x.name,
						subName: x.mixedIntoNumber,
						subNameAfter: '起'
					}
				})
				this.dropOrder.view(viewModel2, this.element.list.mixIntoRank);


				console.log('统计信息', statisticData)


				const viewModel3 = statisticData.map(x => {
					return {
						name: x.Name,
						subName: Number(x.GarbageRatio.toFixed(0)),
						subNameAfter: '分'
					}

				})
				this.dropOrder.view(viewModel3, this.element.list.littleGarbageRank)


			}).then(() => {
				this.rankSwiper = new Swiper("#rank", {
					initialSlide: this.activeIndex,
					pagination: {
						el: '#rank-pagination'
					},
					on: {
						slideChange: (swiper) => {
							this.activeIndex = swiper.activeIndex;

						}
					}
				})


			})

			this.dataController.getGarbageStationNumberStatistic("310109011002002000", new Date(),).then((res) => {
				console.log('小包垃圾:', res)
				this.fillCandlestickOption(res);
				this.drawChart()
			}).catch((err) => {
				console.log('error', err)
			})
		}

		fillCandlestickOption(lineDataSource: Array<GarbageStationGarbageCountStatistic>
		) {

			this.candlestickOption.barData = new Array();
			this.candlestickOption.barDataB = new Array();
			this.candlestickOption.lineData = new Array();
			this.candlestickOption.lineDataB = new Array();
			this.candlestickOption.xAxisBar = new Array();
			this.candlestickOption.xAxisLine = new Array();
			// console.log(eventNumberStatistic);
			const toFormat = function (params: { value: number }) {
				return params.value == 0 ? '' : '{Sunny|}'
			}, rich = {
				value: {
					// lineHeight: 18,
					align: 'center'
				},
				Sunny: {
					width: 12,
					height: 18,
					align: 'center',
					backgroundColor: {
						image: '/assets/img/arrow-tag-a.png',
					},
					// opacity: 0.3
				}
			}
			for (var i = 9; i <= 21; i++)
				for (var u = 0; u < 60; u++) {
					const m = u < 10 ? ('0' + u) : (u == 60 ? '00' : u);

					this.candlestickOption.xAxisLine.push(i + ':' + m);
					this.candlestickOption.xAxisBar.push(i + ':' + m);
					this.candlestickOption.barData.push({
						value: 0,
						itemStyle: {
							color: 'rgba(16,22,48,0)',
							//color: '#fff'
						},
						label: {
							show: false,
							formatter: toFormat,
							rich: rich,
						},
						emphasis: {
							label: {
								rich: {
									Sunny: {
										width: 12,
										height: 18,
										align: 'center',
										backgroundColor: {
											image: '/assets/img/arrow-tag.png',
										}
									}
								}
							}
						}
					});
					this.candlestickOption.barDataB.push({
						value: 0,
						itemStyle: {
							color: 'rgba(16,22,48,0)'
						},
						label: {
							show: false,
							formatter: toFormat,
							rich: rich
						},
						emphasis: {
							label: {
								rich: {
									Sunny: {
										width: 12,
										height: 18,
										align: 'center',
										backgroundColor: {
											image: '/assets/img/arrow-tag.png',
										}
									}
								}
							}
						}
					});
					if (i == 21) break;
				}

			// toIllegalDropTick(0, 100);
			var tag = 0;
			for (var i = 9; i < 21; i++)
				for (var u = 0; u < 60; u++) {

					const item = lineDataSource.find(x => {
						const date = new Date(x.BeginTime);
						return (date.getHours() == i && date.getMinutes() == u);
					});
					var garbageCount = 0;
					if (item) {// green  coffee
						garbageCount = item.GarbageCount > 0 ? 1 : 0;
						this.candlestickOption.lineDataB.push('-');//断开 
					}
					else this.candlestickOption.lineDataB.push(0); //gay 链接 

					this.candlestickOption.lineData.push(garbageCount);



					tag += 1;
				}

			/** 9:00 填补 */
			this.candlestickOption.lineData.push(0);
			/**
			 * 拉长没数据 线
			 */
			const grayIndex = new Array<number>();
			for (let i = 0; i < this.candlestickOption.lineDataB.length; i++)
				if (this.candlestickOption.lineDataB[i] == 0)
					grayIndex.push(i + 1);

			grayIndex.map(g => {
				this.candlestickOption.lineDataB[g] = 0;
			});

			console.log(this.candlestickOption)
		}
		drawChart() {
			let myChart = echarts.init(this.element.chart.littelGarbageChart)
			let options = {
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [150, 230, 224, 218, 135, 147, 260],
					type: 'line'
				}]
			}
			const options1 = {
				animation: false,

				tooltip: {
					trigger: 'axis',
					formatter: '{b}',
					axisPointer: {
						lineStyle: {
							color: '#5e6ebf',
							width: 1.2
						}
					}
				},
				visualMap: {
					show: false,

					pieces: [{
						gt: 0.005,
						lte: 1,
						color: '#CD661D'
					}, {
						gte: 0,
						lte: 0.005,
						color: '#28ce38'
					}],
					seriesIndex: 0,
				},
				grid: [
					{
						top: 20,
						left: '40px',
						right: '60px',
						height: '60%',
					},
					{
						left: '40px',
						right: '60px',
						top: '74%',
						height: '10%'
					}
				],
				xAxis: [
					{
						type: 'category',
						data: this.candlestickOption.xAxisLine,
						scale: true,
						boundaryGap: false,
						axisLine: {
							onZero: false,
							lineStyle: {
								color: '#7d90bc'
							}
						},
						splitLine: {
							lineStyle: {
								color: 'rgb(117,134,224,0.3)'
							}
						},
						min: 'dataMin',
						max: 'dataMax',
						axisLabel: {
							color: '#CFD7FE',
							fontSize: "16",
						},
						axisTick: {        //刻度线

							lineStyle: {
								color: 'rgb(117,134,224,0.3)'
							}
						},
					},
					{
						type: 'category',
						gridIndex: 1,
						data: this.candlestickOption.xAxisBar,
						scale: true,
						boundaryGap: false,
						axisLine: { show: false, onZero: false },
						axisTick: { show: false },
						splitLine: { show: false },
						axisPointer: {
							show: true,
							type: 'none',

						},

						min: 'dataMin',
						max: 'dataMax',

						axisLabel: {
							show: false
						},
					}
				],
				yAxis: [
					{
						scale: true,
						splitArea: {
							show: false
						},
						axisTick: {        //刻度线
							show: false
						},

						axisLine: {
							show: false,
							onZero: false,//y轴
							lineStyle: {
								color: '#7d90bc'
							}
						},
						axisLabel: {
							color: '#CFD7FE',
							fontSize: "16",
							show: false,
						},
						splitLine: {
							lineStyle: {
								color: 'rgb(117,134,224,0.3)'
							}
						}
					},
					{
						scale: true,
						gridIndex: 1,
						axisLabel: { show: false },
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false },
						axisPointer: {
							show: false
						}
					}
				],
				dataZoom: [
					{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 0,
						end: 100
					},
					{
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						top: '84%',
						start: 0,
						end: 100,
						fillerColor: 'rgb(117,134,224,0.5)',
						borderColor: '#5e6ebf',
						textStyle: {
							color: '#CFD7FE',
							fontSize: "16",
						}
					}
				],
				series: [{
					name: 'theLine',
					type: 'line',
					data: this.candlestickOption.lineData,
					step: 'end',
					symbolSize: 8,
				}, {
					name: 'theLineB',
					type: 'line',
					data: this.candlestickOption.lineDataB,
					symbolSize: 8,
					itemStyle: {
						color: 'gray'
					}
				},
				{
					name: 'theBar',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: this.candlestickOption.barData
				}
				]
			}
			myChart.setOption(options1)
		}

		async getGarbageStationNumberStatisticList() {

			let stationList = await this.dataController.getGarbageStationList()
			let ids = stationList.map(item => {
				return item.Id
			})
			console.log('ID列表:', ids);

			let res = await this.dataController.getGarbageStationNumberStatisticList(
				ids
			)
			res = res.sort(function (a, b) {
				return a.GarbageRatio - b.GarbageRatio
			})

			return res
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




