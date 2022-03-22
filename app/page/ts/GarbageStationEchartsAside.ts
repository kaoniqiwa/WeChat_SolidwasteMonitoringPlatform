/**
 * pmx
 */
import { CandlestickOption } from './echart'
import IAside from './IAside'
import { dateFormat, getAllDay } from '../../common/tool'
import '../css/aside.less'
import '../css/header.less'

import weui from 'weui.js/dist/weui.js'
import 'weui'

import echartAsideTemplate from '../garbagestation/garbage-station-details.html'

import Swiper, { Virtual, Pagination } from 'swiper'

Swiper.use([Virtual, Pagination])

import * as echarts from 'echarts/core'
import {
  GridComponent,
  GridComponentOption,
  TooltipComponentOption,
  TooltipComponent,
  DataZoomComponent,
  DataZoomComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
} from 'echarts/components'

import {
  LineChart,
  LineSeriesOption,
  BarChart,
  BarSeriesOption,
} from 'echarts/charts'

import { CanvasRenderer } from 'echarts/renderers'
import {
  GarbageStationGarbageCountStatistic,
  GarbageStationNumberStatisticV2,
} from '../../data-core/model/waste-regulation/garbage-station-number-statistic'
import {
  CameraViewModel,
  GarbageStationViewModel,
} from './data-controllers/ViewModels'
import { NavigationWindow } from '.'
import { Service } from '../../data-core/repuest/service'
import { ControllerFactory } from './data-controllers/ControllerFactory'
import { DataController } from './data-controllers/DataController'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { OneDay } from './data-controllers/IController'
import EchartsDetailAside from './GarbageStationEchartsDetailAside'
import IObserver from './IObserver'
import UserLabelAside from './GarbageStationUserLabel'
import CreateUserLabelAside from './GarbageStationCreateUserLabel'
import { IGarbageStationController } from './data-controllers/modules/IController/IGarbageStationController'

echarts.use([
  GridComponent,
  LineChart,
  BarChart,
  VisualMapComponent,
  CanvasRenderer,
  TooltipComponent,
  DataZoomComponent,
])

export default class EchartsAside extends IAside implements IObserver {
  candlestickOption: CandlestickOption = new CandlestickOption()
  myChart?: echarts.ECharts
  statisticAllData: Array<Array<GarbageStationNumberStatisticV2>> = []
  day!: OneDay

  outterContainer: HTMLElement
  innerContainer: HTMLDivElement = document.createElement('div')

  private _date!: Date
  get date() {
    return this._date
  }
  set date(val) {
    this._date = val
    this.day = getAllDay(val)

    this.reset()
    this.loadAllData().then(() => {
      console.log(this.statisticAllData)
      this.createContent()
      this.manualSlide()
    })
  }
  data?: GarbageStationViewModel[]

  statistic: Map<string, GarbageStationGarbageCountStatistic[]> = new Map()

  private activeIndex: number = 0
  public pickerId?: number // 页面打开时的时间戳

  private _id: string = ''
  get id() {
    return this._id
  }
  set id(val) {
    this._id = val
  }
  update(args: any) {
    if (args) {
      if ('showDetail' in args) {
        this.showDetail = args.showDetail
      }
      if ('showUserLabel' in args) {
        this.showUserLabel = args.showUserLabel
        if ('id' in args && 'mode' in args) {
          let detail_a = document.querySelector(
            `#detail-${args.id}`
          ) as HTMLElement
          let a = document.querySelector(`#${args.id}`) as HTMLElement
          console.log('detail:', detail_a)
          console.log('current:', a)
          switch (args.mode) {
            case 'remove':
              detail_a.classList.remove('has')
              a.classList.remove('has')
              break
            case 'create':
              detail_a.classList.add('has')
              a.classList.add('has')
              break
            default:
              break
          }
        }
      }
    }
  }

  myEchartsDetailAside: EchartsDetailAside | null = null

  private _showDetail: boolean = false

  get showDetail() {
    return this._showDetail
  }
  set showDetail(val) {
    this._showDetail = val
    if (this.myEchartsDetailAside) {
      if (val) {
        this.elements.detailContainer.classList.add('slideIn')
      } else {
        this.elements.detailContainer.classList.remove('slideIn')
      }
    }
  }

  swiper!: Swiper

  contentLoaded: boolean = false

  elements!: {
    [key: string]: HTMLElement
  }
  template = echartAsideTemplate

  constructor(
    selector: HTMLElement | string,
    private dataController: IGarbageStationController,
    private stations: Array<GarbageStationViewModel>,
    date: Date
  ) {
    super()
    this.outterContainer =
      typeof selector == 'string'
        ? (document.querySelector(selector) as HTMLElement)
        : selector

    this.innerContainer.classList.add('aside-inner-container')
    this.innerContainer.innerHTML = this.template
    this.date = date // 在设置日期时提前下载好数据
  }
  init() {
    this.outterContainer.innerHTML = ''
    this.outterContainer.appendChild(this.innerContainer)
    this.elements = {
      mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
      innerBack: this.innerContainer.querySelector(
        '.inner-back'
      ) as HTMLDivElement,
      date: this.innerContainer.querySelector('.inner-date') as HTMLDivElement,
      showDatePicker: document.querySelector(
        '#showDatePicker'
      ) as HTMLDivElement,
      detailContainer: document.querySelector(
        '#detail-container'
      ) as HTMLDivElement,
      userLabelContainer: document.querySelector(
        '#detail-user-label-container'
      ) as HTMLDivElement,
    }

    this.swiper = new Swiper('.aside-inner-container .swiper-container', {
      init: true,
      virtual: {
        cache: true, // 一定要缓存
      },
      on: {
        init: () => {
          this.createDetailAside()
        },
        transitionEnd: (swiper) => {
          console.log('transitionEnd')
          this.activeIndex = swiper.activeIndex
          let activeSlide = this.innerContainer.querySelector(
            '.swiper-slide-active'
          ) as HTMLDivElement

          if (activeSlide) {
            let id = (activeSlide.firstElementChild as HTMLElement).dataset[
              'id'
            ]!
            this.id = id
            this.draw()
          }
        },
        click: (swiper, event) => {
          // console.log(swiper);
          // console.log(event);

          // 事件冒泡经过的节点
          let path = event.path || (event.composedPath && event.composedPath())
          // console.log(path);

          // 当前点击的 slide
          let clickedSlide = swiper.clickedSlide

          let userLabel = clickedSlide.querySelector('.user-label')
          if (userLabel) {
            if (path.includes(userLabel as EventTarget)) {
              this.onUserLabelClicked(event)
              return
            }
          }

          // 判断 staticItem 是否在 path 数组中
          let staticItem = clickedSlide.querySelector('.inner-statisic')
          if (staticItem) {
            if (path.includes(staticItem as EventTarget)) {
              console.log('点击了信息统计区')

              let index = path.indexOf(staticItem)
              console.log('序号', index)
              if (index !== 0) {
                // 第一个元素不是 staticItem,说明事件是从子元素冒泡上来的
                let child = path[index - 1] as HTMLElement
                if (child.classList?.contains('item')) {
                  // 点击是四大按钮
                  console.log('定位成功', child, this.id)
                  if (
                    child.textContent?.includes('暂无数据') ||
                    child.classList.contains('disable')
                  )
                    return

                  const day = getAllDay(this.date)

                  if (this.myEchartsDetailAside) {
                    // 0,1,2,3
                    let detailType = child.getAttribute('detail-type')
                    let type: EventType | undefined
                    if (!detailType) {
                      type = undefined
                    } else {
                      type = Number(detailType)
                    }

                    console.log(type)
                    this.myEchartsDetailAside.id = this.id
                    this.myEchartsDetailAside.date = this.date
                    this.myEchartsDetailAside.type = type
                    this.myEchartsDetailAside.render()
                    this.showDetail = true
                  }
                }
              }
            }
          }
        },
      },
    })

    this.bindEvents()
  }

  onUserLabelClicked(e: Event) {
    if (!this.id) return
    let data = this.stations.find((x) => x.Id === this.id)
    if (!data) return
    let promise = data.getUserLabel()

    promise
      .then((x) => {
        let p = new UserLabelAside(
          this.elements.userLabelContainer,
          data!,
          this.dataController
        )

        p.init()
        p.add(this)
        this.showUserLabel = true
      })
      .catch((x) => {
        let p = new CreateUserLabelAside(
          this.elements.userLabelContainer,
          data!,
          this.dataController
        )

        p.init()
        p.add(this)

        this.showUserLabel = true
      })

    e.stopPropagation()
  }

  private _showUserLabel: boolean = false
  public get showUserLabel(): boolean {
    return this._showUserLabel
  }
  public set showUserLabel(v: boolean) {
    this._showUserLabel = v
    if (v) {
      this.elements.userLabelContainer.classList.add('slideIn')
    } else {
      this.elements.userLabelContainer.classList.remove('slideIn')
    }
  }

  createDetailAside() {
    this.myEchartsDetailAside = new EchartsDetailAside(
      this.elements.detailContainer,
      this.dataController
    )

    this.myEchartsDetailAside.init()
    this.myEchartsDetailAside.add(this)
  }
  notify(args: any) {
    this.observerList.forEach((observer) => {
      observer.update(args)
    })
  }
  /**
   * 手动控制swiper
   */
  manualSlide() {
    let id = this.id
    let index = this.stations.findIndex((val) => {
      return val.Id == id
    })
    if (index == -1) return
    /**
     *  选中第一个slide或者在当前slide上重新绘制
     */
    if (index == this.activeIndex) {
      console.log('手动绘制echart')
      this.draw()
    }

    this.swiper.slideTo(index)
    this.activeIndex = index

    this.stations[index]
      .getUserLabel()
      .then((x) => {
        let detail = document.querySelector(`#detail-user-label-${x.LabelId}`)
        if (detail) {
          detail.classList.add('has')
        }
      })
      .catch((x) => {
        let detail = document.querySelector(`#detail-user-label-${id}`)
        if (detail) {
          detail.classList.remove('has')
        }
      })
  }
  private bindEvents() {
    if (this.elements.innerBack) {
      this.elements.innerBack.addEventListener('click', () => {
        this.notify({
          showChart: false,
          showUserLabel: false,
        })
      })
    }

    if (this.elements.showDatePicker) {
      this.elements.showDatePicker.addEventListener('click', () => {
        this.showDatePicker()
      })
    }
  }
  showDatePicker() {
    if (this.pickerId) {
      weui.datePicker({
        start: new Date(2020, 12 - 1, 1),
        end: new Date(),
        onChange: (result: any) => {},
        onConfirm: (result: any) => {
          let date = new Date(
            result[0].value,
            result[1].value - 1,
            result[2].value
          )
          this.date = date
        },
        title: '请选择日期',
        id: this.pickerId,
      })
    }
  }
  reset() {
    // console.log('reset')
    this.statistic.clear()
    this.statisticAllData = []
    this.contentLoaded = false
  }
  /**
   *  为了保证请求结果和 this.stations 顺序一致
   */
  async loadAllData() {
    // console.log('loadAllData', this.stations)
    let arr = []
    for (let i = 0; i < this.stations.length; i++) {
      arr.push(this.loadData(this.stations[i].Id))
    }
    this.statisticAllData = await Promise.all(arr)
  }
  private async loadData(id: string) {
    let res = await this.dataController.getGarbageStationNumberStatisticList(
      [id],
      this.day
    )
    return res
  }

  private createContent() {
    this.swiper.virtual.slides = []
    this.swiper.virtual.cache = {}

    // for (let i = 0; i < this.stations.length; i++) {
    //   let id = this.stations[i];
    //   let name = this.symb.get(id)?.name
    //   console.log(name)

    // }

    let len = this.statisticAllData.length
    for (let i = 0; i < len; i++) {
      let obj = {
        Id: this.stations[i].Id,
        Name: this.stations[i].Name,
        GarbageRatio: 0,
        maxDrop: '暂无数据',
        totalDrop: '暂无数据',
        illegalDrop: '暂无数据',
        mixIntoDrop: '暂无数据',
        MaxGarbageTime: 0,
        GarbageDuration: 0,
      }
      this.dataController.getImageUrl
      if (this.statisticAllData[i].length != 0) {
        let data = this.statisticAllData[i][0]

        let {
          GarbageRatio,
          AvgGarbageTime,
          MaxGarbageTime,
          GarbageDuration,
          EventNumbers,
        } = data

        obj.GarbageRatio = Number(GarbageRatio!.toFixed(2))

        AvgGarbageTime = Math.round(AvgGarbageTime!)
        MaxGarbageTime = Math.round(MaxGarbageTime!)
        GarbageDuration = Math.round(GarbageDuration!)

        obj.MaxGarbageTime = MaxGarbageTime
        obj.GarbageDuration = GarbageDuration

        let maxHour = Math.floor(MaxGarbageTime / 60)
        let maxMinute = Math.ceil(MaxGarbageTime % 60)
        let totalHour = Math.floor(GarbageDuration / 60)
        let totalMinute = Math.ceil(GarbageDuration % 60)

        if (maxHour == 0) {
          obj.maxDrop = maxMinute + '分钟'
        } else {
          obj.maxDrop = maxHour + '小时' + maxMinute + '分钟'
        }
        if (totalHour == 0) {
          obj.totalDrop = totalMinute + '分钟'
        } else {
          obj.totalDrop = totalHour + '小时' + totalMinute + '分钟'
        }

        EventNumbers!.forEach((eventNumber) => {
          if (eventNumber.EventType == EventType.IllegalDrop) {
            obj.illegalDrop = eventNumber.DayNumber.toString()
          } else if (eventNumber.EventType == EventType.MixedInto) {
            obj.mixIntoDrop = eventNumber.DayNumber.toString()
          }
        })
      }

      let slide = `
      <div data-id='${obj.Id}' style="padding:0 10px;">
          <div class='inner-head'>
              <div class='inner-title'><span>${
                obj.Name
              }</span><span><a id="detail-user-label-${
        obj.Id
      }" class="user-label"><i class="glyphicon glyphicon-earphone"></i></a></span></div>
                <div class='inner-date'>${dateFormat(
                  this.date,
                  'yyyy年MM月dd日'
                )}</div>
          </div>


          <div class='inner-statisic'>
              <div class='ratio'>
                  <div  style="display:none">
                  <div>联系人</div>
                  <div>联系人</div>
                  </div>
                  <div>
                  <div  style="display:none">联系人</div></div>
                  <div class='ratio-num'>${obj.GarbageRatio}</div>
                  <div class='ratio-suffix'>%</div>
              </div>

              <div class='item${obj.MaxGarbageTime ? '' : ' disable'}'>
                  <div class='item-title'>最大落地:</div>
                  <div class='item-content'>
                     ${obj.maxDrop}
                  </div>
              </div>
              <div class='item${obj.GarbageDuration ? '' : ' disable'}'> 
                  <div class='item-title'> 总落地:</div>
                  <div class='item-content'>
                  ${obj.totalDrop}
                  </div>
              </div>

              <div class='item${
                obj.illegalDrop === '0' ? ' disable' : ''
              }' detail-type='${EventType.IllegalDrop}'>
                  <div class='item-title'> 垃圾落地:</div>
                  <div class='item-content'>${obj.illegalDrop}起</div>
              </div>

              <div class='item${
                obj.mixIntoDrop === '0' ? ' disable' : ''
              }' detail-type='${EventType.MixedInto}'>
                  <div class='item-title'> 混合投放:</div>
                  <div class='item-content'>${obj.mixIntoDrop}起</div>
              </div>
          </div>
          
          <div class='inner-info' style='display:none'>
            <div class='item'>
                <div class='name'>经霞敏</div>
                <div class='note'>卫生干部</div>
                <div class='phone'>13764296742</div>
            </div>
            <div class='item'>
              <div class='name'>经霞敏</div>
              <div class='note'>卫生干部</div>
              <div class='phone'>13764296742</div>
            </div>
          </div>
          <div class="inner-chart"></div>
      </div>
      `
      this.swiper.virtual.appendSlide(slide) // 不要append数组
    }

    this.contentLoaded = true
  }
  private draw() {
    // console.log('%cdraw()', "color:green")
    let activeSlide = this.innerContainer.querySelector(
      '.swiper-slide-active'
    ) as HTMLDivElement
    if (activeSlide == null) return
    let echart = activeSlide.querySelector('.inner-chart') as HTMLElement

    let id = this.id
    // console.log('绘制', activeSlide.querySelector('.inner-title')?.textContent)
    if (id) {
      if (this.statistic.has(id)) {
        // 该id已经请求过数据，使用缓存
        console.log('使用缓存')
      } else {
        this.dataController
          .getGarbageStationNumberStatistic(id, this.date)
          .then((res) => {
            // console.log('画图', res);
            this.statistic.set(id!, res)
            this.fillCandlestickOption(res)
            this.drawChart(echarts.init(echart))
          })
      }
    }
  }
  private fillCandlestickOption(
    lineDataSource: Array<GarbageStationGarbageCountStatistic>
  ) {
    this.candlestickOption.barData = new Array()
    this.candlestickOption.barDataB = new Array()
    this.candlestickOption.lineData = new Array()
    this.candlestickOption.lineDataB = new Array()
    this.candlestickOption.xAxisBar = new Array()
    this.candlestickOption.xAxisLine = new Array()
    // console.log(eventNumberStatistic);
    const toFormat = function (params: { value: number }) {
        return params.value == 0 ? '' : '{Sunny|}'
      },
      rich = {
        value: {
          // lineHeight: 18,
          align: 'center',
        },
        Sunny: {
          width: 12,
          height: 18,
          align: 'center',
          backgroundColor: {
            image: '../../assets/img/arrow-tag-a.png',
          },
          // opacity: 0.3
        },
      }
    for (var i = 9; i <= 21; i++)
      for (var u = 0; u < 60; u++) {
        const m = u < 10 ? '0' + u : u == 60 ? '00' : u

        this.candlestickOption.xAxisLine.push(i + ':' + m)
        this.candlestickOption.xAxisBar.push(i + ':' + m)
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
                    image: '../../assets/img/arrow-tag.png',
                  },
                },
              },
            },
          },
        })
        this.candlestickOption.barDataB.push({
          value: 0,
          itemStyle: {
            color: 'rgba(16,22,48,0)',
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
                  },
                },
              },
            },
          },
        })
        if (i == 21) break
      }

    // toIllegalDropTick(0, 100);
    var tag = 0
    for (var i = 9; i < 21; i++)
      for (var u = 0; u < 60; u++) {
        const item = lineDataSource.find((x) => {
          const date = new Date(x.BeginTime)
          return date.getHours() == i && date.getMinutes() == u
        })
        var garbageCount = 0
        if (item) {
          // green  coffee
          garbageCount = item.GarbageCount > 0 ? 1 : 0
          this.candlestickOption.lineDataB.push('-') //断开
        } else this.candlestickOption.lineDataB.push(0) //gay 链接

        this.candlestickOption.lineData.push(garbageCount)

        tag += 1
      }

    /** 9:00 填补 */
    this.candlestickOption.lineData.push(0)
    /**
     * 拉长没数据 线
     */
    const grayIndex = new Array<number>()
    for (let i = 0; i < this.candlestickOption.lineDataB.length; i++)
      if (this.candlestickOption.lineDataB[i] == 0) grayIndex.push(i + 1)

    grayIndex.map((g) => {
      this.candlestickOption.lineDataB[g] = 0
    })
  }
  private drawChart(echart: echarts.ECharts) {
    const options1 = {
      animation: false,

      tooltip: {
        trigger: 'axis',
        formatter: '{b}',
        axisPointer: {
          lineStyle: {
            color: '#5e6ebf',
            width: 1.2,
          },
        },
      },
      visualMap: {
        show: false,

        pieces: [
          {
            gt: 0.005,
            lte: 1,
            color: '#CD661D',
          },
          {
            gte: 0,
            lte: 0.005,
            color: '#28ce38',
          },
        ],
        seriesIndex: 0,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          top: '84%',
          start: 0,
          end: 100,
          fillerColor: 'rgb(117,134,224,0.5)',
          borderColor: '#5e6ebf',
          textStyle: {
            color: '#CFD7FE',
            fontSize: '16',
          },
        },
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
              color: '#7d90bc',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgb(117,134,224,0.3)',
            },
          },
          min: 'dataMin',
          max: 'dataMax',
          axisLabel: {
            color: '#CFD7FE',
            fontSize: '16',
          },
          axisTick: {
            //刻度线

            lineStyle: {
              color: 'rgb(117,134,224,0.3)',
            },
          },
        },
      ],
      yAxis: {
        boundaryGap: false,
        scale: true,
        splitArea: {
          show: false,
        },
        axisTick: {
          //刻度线
          show: false,
        },

        axisLine: {
          show: false,
          onZero: false, //y轴
          lineStyle: {
            color: '#7d90bc',
          },
        },
        axisLabel: {
          color: '#CFD7FE',
          fontSize: '16',
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: 'rgb(117,134,224,0.3)',
          },
        },
      },
      series: [
        {
          name: 'theLine',
          type: 'line',
          data: this.candlestickOption.lineData,
          step: 'end',
          symbolSize: 8,
        },
        {
          name: 'theLineB',
          type: 'line',
          data: this.candlestickOption.lineDataB,
          symbolSize: 8,
          itemStyle: {
            color: 'gray',
          },
        },
      ],
    }
    echart.setOption(options1)
  }
}
