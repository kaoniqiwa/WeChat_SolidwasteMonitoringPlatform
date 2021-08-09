import {
  EventNumber,
  EventType,
} from '../../data-core/model/waste-regulation/event-number'
import { AppEChart } from '../../common/echart-line'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
import { SessionUser } from '../../common/session-user'
import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
import { dateFormat, getAllDay } from '../../common/tool'
import { Service } from '../../data-core/repuest/service'
import { ResourceType } from '../../data-core/model/we-chat'
import { StatisticNumber } from './data-controllers/IController'
import { ControllerFactory } from './data-controllers/ControllerFactory'
import Swiper, { Pagination } from 'swiper'
import { CandlestickOption } from './echart'
import { GarbageStationGarbageCountStatistic } from '../../data-core/model/waste-regulation/garbage-station-number-statistic'
import { NavigationWindow } from '.'
import { IDataController } from './data-controllers/modules/IController/IDataController'

Swiper.use([Pagination])

declare var weui: any

namespace GarbageCondition {
  var date = new Date()

  export class HistoryChart {
    constructor(private page: Page) {}

    convert(datas: Array<EventNumber>): AppEChart.LineOption {
      const lc = this.joinPart(new AppEChart.LineOption())
      lc.seriesData = new Array()
      lc.boundaryGap = true

      for (let i = 0; i < datas.length; i++) {
        const data = datas[i]
        lc.seriesData.push(data.DeltaNumber)
      }
      return lc
    }

    async view(opts: AppEChart.LineOption, elements: HTMLElement[]) {
      elements.forEach((element) => {
        new AppEChart.EChartLine().init(element, opts)
      })
    }

    private joinPart(t1: AppEChart.LineOption) {
      t1.xAxisData = []
      for (let i = 0; i <= 12; i++) {
        if (i < 10) t1.xAxisData.push('0' + i + ':00')
        else t1.xAxisData.push(i + ':00')
      }
      for (let i = 13; i <= 24; i++) {
        if (i == 24) t1.xAxisData.push('23' + ':59')
        else t1.xAxisData.push(i + ':00')
      }
      return t1
    }
  }

  export class GarbageDropOrder {
    constructor(private page: Page) {}

    async view(
      viewModel: Array<{ name: string; subName: string; subNameAfter: string }>,
      target: HTMLElement
    ) {
      var html = ''
      target.innerHTML = ''
      for (let i = 0; i < viewModel.length; i++) {
        const t = viewModel[i]
        // html += ` <div class=" top5-list-wrap">
        //               <div class="pull-left number-item ${i < 3 ? 'red-bg' : "orange-bg"}">
        //                   <label class="white-text ">${i + 1}</label>
        //               </div>
        //               <div class="pull-left">${t.name}</div>
        //               <div class="pull-right sky-blue-text">${t.subName} <label class="list-desc-unit">${t.subNameAfter}</label></div>
        //           </div> `;

        html += `
						<div class='wrapper'>
							<div class='prefix'>
								<div class="${i < 3 ? 'red-bg' : 'orange-bg'} prefix__number">${i + 1}</div>
								<div class='prefix__title'>${t.name}</div>
							</div>
							<div class='suffix'>
								<div class='sky-blue-text'>${t.subName}</div>
								<div class='list-desc-unit'>${t.subNameAfter}</div>
							</div>
						</div>
				`
      }
      target.insertAdjacentHTML('afterbegin', html)
    }
  }

  export class DivisionGarbageCount {
    constructor(private page: Page) {}

    async view(data: StatisticNumber) {
      this.page.element.count.illegalDropCount.innerHTML =
        data.illegalDropNumber.toString()
      this.page.element.count.mixIntoCount.innerHTML =
        data.mixedIntoNumber.toString()
      this.page.element.count.garbageDropCount.innerHTML =
        data.garbageDropNumber.toString()
    }
  }

  class Page {
    type: ResourceType

    history: GarbageCondition.HistoryChart
    dropOrder: GarbageCondition.GarbageDropOrder
    candlestickOption: CandlestickOption
    count: GarbageCondition.DivisionGarbageCount
    rankSwiper: null | Swiper = null
    chartSwiper: null | Swiper = null

    private _activeIndex: number = 0

    get activeIndex() {
      return this._activeIndex
    }
    set activeIndex(val) {
      this._activeIndex = val

      if (this.rankSwiper && this.rankSwiper.slides.length > this.activeIndex) {
        this.rankSwiper.slideTo(this.activeIndex)
      }
      if (
        this.chartSwiper &&
        this.chartSwiper.slides.length > this.activeIndex
      ) {
        this.chartSwiper.slideTo(this.activeIndex)
      }
    }

    constructor(private dataController: IDataController) {
      this.type = user.WUser.Resources![0].ResourceType
      this.history = new GarbageCondition.HistoryChart(this)
      this.dropOrder = new GarbageCondition.GarbageDropOrder(this)
      this.count = new GarbageCondition.DivisionGarbageCount(this)
      this.candlestickOption = new CandlestickOption()
      this.registEvent()
    }

    element = {
      orderPanel: document.getElementById('top-div') as HTMLDivElement,
      date: document.getElementById('date')!,
      datePicker: document.getElementById('showDatePicker')!,
      count: {
        illegalDropCount: document.getElementById(
          'illegalDropCount'
        ) as HTMLSpanElement,
        mixIntoCount: document.getElementById(
          'mixIntoCount'
        ) as HTMLSpanElement,
        garbageDropCount: document.getElementById(
          'garbageDropCount'
        ) as HTMLSpanElement,
      },
      list: {
        illegalDropRank: document.getElementById('illegalDropRank')!,
        mixIntoRank: document.getElementById('mixIntoRank')!,
        littleGarbageRank: document.getElementById('littleGarbageRank')!,
      },
      chart: {
        illegalDrop: Array.from(
          document.querySelectorAll<HTMLElement>('.illegalChart')
        ),
        mixDrop: Array.from(
          document.querySelectorAll<HTMLElement>('.mixIntoChart')
        ),
      },
    }

    registEvent() {
      this.element.count.illegalDropCount.addEventListener('click', () => {
        ;(window.parent as NavigationWindow).pageChange(1, {
          eventtype: EventType.IllegalDrop,
        })
      })
      this.element.count.mixIntoCount.addEventListener('click', () => {
        ;(window.parent as NavigationWindow).pageChange(1, {
          eventtype: EventType.MixedInto,
        })
      })
      this.element.count.garbageDropCount.addEventListener('click', () => {
        ;(window.parent as NavigationWindow).pageChange(2, { eventtype: 999 })
      })
    }

    loadData() {
      let day = getAllDay(date)

      // 数量接口
      let eventCountPromise = this.dataController.getEventCount(day)
      eventCountPromise.then((data) => {
        // console.log('数量:', data)
        this.count.view(data)
      })

      // 图表接口
      this.dataController
        .getHistory(day)
        .then((historyData) => {
          if (historyData && 'IllegalDrop' in historyData) {
            let illegalOpts = this.history.convert(historyData.IllegalDrop)
            let mixinOpts = this.history.convert(historyData.MixedInto)

            this.element.chart.illegalDrop = Array.from(
              document.querySelectorAll<HTMLElement>('.illegalChart')
            )

            this.history.view(illegalOpts, this.element.chart.illegalDrop)

            this.element.chart.mixDrop = Array.from(
              document.querySelectorAll<HTMLElement>('.mixIntoChart')
            )
            this.history.view(mixinOpts, this.element.chart.mixDrop)
          } else {
            throw new Error('')
          }
        })
        .then(() => {
          if (!this.chartSwiper) {
            this.chartSwiper = new Swiper('#diagram', {
              initialSlide: this.activeIndex,
              pagination: {
                el: '#chart-pagination',
              },
              on: {
                slideChange: (swiper) => {
                  this.activeIndex = swiper.activeIndex
                },
              },
            })
          }
        })
        .catch((error) => {})

      Promise.all([
        this.dataController.getStatisticNumberList(day),
        this.getGarbageStationNumberStatisticList(),
      ])
        .then(([listData, statisticData]) => {
          // console.log('居委会信息', listData)
          const items = listData.sort((a, b) => {
            return b.illegalDropNumber - a.illegalDropNumber
          })

          const viewModel = items.map((x) => {
            return {
              name: x.name,
              subName: x.illegalDropNumber.toString(),
              subNameAfter: '起',
            }
          })
          this.dropOrder.view(viewModel, this.element.list.illegalDropRank)

          // 混合投放排行榜
          const items2 = listData.sort((a, b) => {
            return b.mixedIntoNumber - a.mixedIntoNumber
          })
          const viewModel2 = items2.map((x) => {
            return {
              name: x.name,
              subName: x.mixedIntoNumber.toString(),
              subNameAfter: '起',
            }
          })
          this.dropOrder.view(viewModel2, this.element.list.mixIntoRank)

          // console.log('统计信息', statisticData)

          const viewModel3 = statisticData.map((x) => {
            // x.GarbageRatio = 91
            return {
              name: x.Name,
              subName:
                x.GarbageRatio == 100
                  ? x.GarbageRatio.toFixed(0)
                  : x.GarbageRatio!.toFixed(2),
              subNameAfter: '分',
            }
          })
          this.dropOrder.view(viewModel3, this.element.list.littleGarbageRank)
        })
        .then(() => {
          if (!this.rankSwiper) {
            this.rankSwiper = new Swiper('#rank', {
              initialSlide: this.activeIndex,
              pagination: {
                el: '#rank-pagination',
              },
              on: {
                slideChange: (swiper) => {
                  this.activeIndex = swiper.activeIndex
                  // console.log('activeIndex', this.activeIndex)
                },
              },
            })
          }
        })
    }

    async getGarbageStationNumberStatisticList() {
      let stationList = await this.dataController.getGarbageStationList()
      let ids = stationList.map((item) => {
        return item.Id
      })
      // console.log('ID列表:', ids);

      let day = getAllDay(date)

      let res = await this.dataController.getGarbageStationNumberStatisticList(
        ids,
        day
      )
      res = res.sort(function (a, b) {
        return a.GarbageRatio! - b.GarbageRatio!
      })

      return res
    }

    init() {
      this.viewDatePicker(new Date())
      this.initRefresh()
      this.initDatePicker()
    }

    initRefresh() {
      try {
        var miniRefresh = new MiniRefresh({
          container: '#refreshContainer',
          down: {
            callback: () => {
              setTimeout(() => {
                // 下拉事件
                this.loadData()
                miniRefresh.endDownLoading()
              }, 500)
            },
          },
          up: {
            isLock: true,
            callback: () => {
              miniRefresh.endUpLoading(true)
            },
          },
        })
      } catch (error) {
        // console.error(error);
      }
    }

    initDatePicker() {
      try {
        this.element.datePicker.addEventListener('click', () => {
          weui.datePicker({
            start: new Date(2020, 12 - 1, 1),
            end: new Date(),
            onChange: function (result: any) {},
            onConfirm: (result: any) => {
              date = new Date(
                result[0].value,
                result[1].value - 1,
                result[2].value
              )

              this.loadData()
              this.viewDatePicker(date)
            },
            title: '请选择日期',
          })
        })
      } catch (ex) {
        console.error(ex)
      }
    }

    viewDatePicker(date: Date) {
      this.element.date.innerHTML = dateFormat(date, 'yyyy年MM月dd日')
    }
  }

  const user = new SessionUser()

  // console.log(user)
  if (user.WUser.Resources) {
    const type = user.WUser.Resources![0].ResourceType

    new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {
      const service = new Service(http)
      const dataController = ControllerFactory.Create(
        service,
        type,
        user.WUser.Resources!
      )
      const page = new Page(dataController)
      page.init()
      page.loadData()
    })
  }
}
