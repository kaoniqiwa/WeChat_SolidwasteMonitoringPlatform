/**
 * pmx
 */
import { CandlestickOption } from "./Echart";
import IAside from "./ISubject"
import { dateFormat, getAllDay } from "../../common/tool";
import "../css/myChartAside.less";
import '../css/header.less'

import weui from 'weui.js/dist/weui.js';
import "weui";


import Swiper, { Virtual, Pagination } from 'swiper';

Swiper.use([Virtual, Pagination])

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
import { GarbageStationGarbageCountStatistic, GarbageStationNumberStatisticV2 } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { GarbageStationViewModel } from "./data-controllers/ViewModels";
import { NavigationWindow } from ".";
import { Service } from "../../data-core/repuest/service";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { DataController } from "./data-controllers/DataController";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { IDataController, IGarbageStationController, OneDay } from "./data-controllers/IController";

echarts.use([
  GridComponent,
  LineChart,
  BarChart,
  VisualMapComponent,
  CanvasRenderer,
  TooltipComponent,
  DataZoomComponent
])

interface EchartsAsideOptions {
  date: Date;
  ids: string[]
}

export default class EchartsAside extends IAside {
  candlestickOption: CandlestickOption = new CandlestickOption()
  myChart?: echarts.ECharts;
  statisticAllData: Array<Array<GarbageStationNumberStatisticV2>> = [];
  day!: OneDay;

  outterContainer: HTMLElement;
  innerContainer: HTMLDivElement = document.createElement("div");

  private _originalDate!: Date;// 外部传入的日期

  private _date!: Date;
  get date() {
    return this._date;
  }
  set date(val) {
    this._date = val;
    this.day = getAllDay(val);

    this.reset();
    this.loadAllData().then(() => {
      // console.log(this.statisticAllData);
      this.createContent();
      this.manualSlide()
    })
  }
  data?: GarbageStationViewModel[];

  statistic: Map<string, GarbageStationGarbageCountStatistic[]> = new Map()

  private activeIndex: number = 0;
  private activeSlide!: HTMLDivElement;
  private isClosed: boolean = false;
  public pickerId?: number;// 页面打开时的时间戳

  private _id: string = '';
  get id() {
    return this._id;
  }
  set id(val) {
    this._id = val;
  }
  swiper!: Swiper;

  contentLoaded: boolean = false;


  elements!: {
    [key: string]: HTMLElement
  }
  template = `
  <div class="inner-mask"></div>
  <div class="inner-content">
    <header class='inner-bar'>
      <div class="header-item">
        <div class="inner-back">
          <i class="howell-icon-arrow2left"></i>返回
        </div>
      </div>
      <div class="header-item">
        <div class="header-item__btn" id="showDatePicker">
          <i class="howell-icon-calendar" style="font-weight: bold"></i>
        </div>
      </div>
    </header>
    <div class="inner-main">
      <div class="swiper-container">
        <div class="swiper-wrapper">
         <!-- <div class="swiper-slide">
            <div data-id="310110019025001000" style="padding: 0 10px">
              <div class="inner-head">
                <div class="inner-title">吉浦路395弄1号</div>
                <div class="inner-date">
                2021年05月20日
                </div>
              </div>
              <div class="inner-info">
                <div class="item">
                  <div class="name">经霞敏</div>
                  <div class="note">卫生干部</div>
                  <div class="phone">13764296742</div>
                </div>
                <div class="item">
                  <div class="name">经霞敏</div>
                  <div class="note">卫生干部</div>
                  <div class="phone">13764296742</div>
                </div>
              </div>
  
              <div class="inner-statisic">
                <div class="ratio">
                  <div class="ratio-num">100</div>
                  <div class="ratio-suffix">%</div>
                </div>
  
                <div class="item">
                  <div class="item-title">最大落地:</div>
                  <div class="item-content">
                   0分钟
                  </div>
                </div>
                <div class="item">
                  <div class="item-title">总落地:</div>
                  <div class="item-content">
                    0分钟
                  </div>
                </div>
  
                <div class="item">
                  <div class="item-title">乱丢垃圾:</div>
                  <div class="item-content">0起</div>
                </div>
  
                <div class="item">
                  <div class="item-title">混合投放:</div>
                  <div class="item-content">0起</div>
                </div>
              </div>
              <div class="inner-chart"></div>
            </div>
          </div>
          -->
        </div>
      </div>
    </div>
    
  </div>
  
    `
  constructor(selector: HTMLElement | string, private dataController: IGarbageStationController, private ids: string[], date: Date) {
    super();
    this.outterContainer = typeof selector == "string" ? document.querySelector(selector) as HTMLElement : selector;


    this.innerContainer.classList.add("echart-inner-container");
    this.innerContainer.innerHTML = this.template;
    this.date = this._originalDate = date;// 在设置日期时提前下载好数据

  }
  init() {


    this.outterContainer.innerHTML = '';
    this.outterContainer.appendChild(this.innerContainer);

    this.swiper = new Swiper('.echart-inner-container .swiper-container', {
      init: true,
      virtual: {
        cache: true// 一定要缓存
      },
      on: {
        transitionEnd: (swiper) => {
          console.log('transitionEnd')
          this.activeIndex = swiper.activeIndex;
          let activeSlide = this.innerContainer.querySelector('.swiper-slide-active') as HTMLDivElement

          if (activeSlide) {
            let id = (activeSlide.firstElementChild as HTMLElement).dataset['id']!;
            this.id = id;
            this.draw()
          }

        },
      },
    })

    this.elements = {
      mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
      innerBack: this.innerContainer.querySelector('.inner-back') as HTMLDivElement,
      date: this.innerContainer.querySelector('.inner-date') as HTMLDivElement,
      showDatePicker: document.querySelector('#showDatePicker') as HTMLDivElement,

    }

    this.bindEvents();
  }
  /**
   * 手动控制swiper
   */
  manualSlide() {
    let id = this.id;
    let index = this.ids.findIndex(val => {
      return val == id
    })
    if (index == -1) return
    /**
     *  选中第一个slide或者在当前slide上重新绘制
     */
    if (index == this.activeIndex) {
      console.log('手动绘制echart')
      this.draw()
    }

    this.swiper.slideTo(index);
    this.activeIndex = index;

  }
  private bindEvents() {
    if (this.elements.innerBack) {
      this.elements.innerBack.addEventListener("click", () => {
        this.notify({
          showChart: false
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
        onChange: (result: any) => {

        },
        onConfirm: (result: any) => {
          let date = new Date(result[0].value, result[1].value - 1, result[2].value);
          this.date = date;
        },
        title: '请选择日期',
        id: this.pickerId
      });

    }



  }
  reset() {
    // console.log('reset')
    this.statistic.clear()
    this.statisticAllData = [];
    this.contentLoaded = false;
  }
  /**
  *  为了保证请求结果和 this.ids 顺序一致
  */
  async loadAllData() {
    // console.log('loadAllData', this.ids)
    let arr = [];
    for (let i = 0; i < this.ids.length; i++) {
      arr.push(this.loadData(this.ids[i]))
    }
    this.statisticAllData = await Promise.all(arr);
  }
  private async loadData(id: string) {
    let res = await this.dataController.getGarbageStationNumberStatisticList([id], this.day)
    return res
  }

  private createContent() {

    this.swiper.virtual.slides = []
    this.swiper.virtual.cache = {};

    // console.log('create contentd')
    let len = this.statisticAllData.length;
    for (let i = 0; i < len; i++) {
      let data = this.statisticAllData[i][0];
      let { Name, GarbageRatio, AvgGarbageTime, MaxGarbageTime, GarbageDuration, EventNumbers } = data;

      GarbageRatio = Number(GarbageRatio!.toFixed(2));
      AvgGarbageTime = Math.round(AvgGarbageTime!);
      MaxGarbageTime = Math.round(MaxGarbageTime!);
      GarbageDuration = Math.round(GarbageDuration!);
      let maxHour = Math.floor(MaxGarbageTime / 60);
      let maxMinute = MaxGarbageTime - maxHour * 60;
      let totalHour = Math.floor(GarbageDuration / 60);
      let totalMinute = GarbageDuration - totalHour * 60;
      let illegalDrop = 0;
      let mixIntoDrop = 0;

      EventNumbers!.forEach(eventNumber => {
        if (eventNumber.EventType == EventType.IllegalDrop) {
          illegalDrop = eventNumber.DayNumber
        } else if (eventNumber.EventType == EventType.MixedInto) {
          mixIntoDrop = eventNumber.DayNumber
        }
      })
      let slide = `
      <div data-id='${data.Id}' style="padding:0 10px;">
          <div class='inner-head'>
              <div class='inner-title'>${data.Name}</div>
                <div class='inner-date'>${dateFormat(this.date, "yyyy年MM月dd日")}</div>
          </div>

          <div class='inner-info'>
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

          <div class='inner-statisic'>
              <div class='ratio'>
                  <div class='ratio-num'>${GarbageRatio}</div>
                  <div class='ratio-suffix'>%</div>
              </div>

              <div class='item'>
                  <div class='item-title'>最大落地:</div>
                  <div class='item-content'>
                      ${maxHour == 0 ? maxMinute + "分钟" : maxHour + "小时" + maxMinute + "分钟"}
                  </div>
              </div>
              <div class='item'> 
                  <div class='item-title'> 总落地:</div>
                  <div class='item-content'>
                      ${totalHour == 0 ? totalMinute + "分钟" : totalHour + "小时" + totalMinute + "分钟"}
                  </div>
              </div>

              <div class='item'>
                  <div class='item-title'> 乱丢垃圾:</div>
                  <div class='item-content'>${illegalDrop}起</div>
              </div>

              <div class='item'>
                  <div class='item-title'> 混合投放:</div>
                  <div class='item-content'>${mixIntoDrop}起</div>
              </div>
          </div>
          <div class="inner-chart"></div>
      </div>
      `
      this.swiper.virtual.appendSlide(slide)
    }

    this.contentLoaded = true;
  }
  private draw() {
    // console.log('%cdraw()', "color:green")
    let activeSlide = this.innerContainer.querySelector('.swiper-slide-active') as HTMLDivElement
    if (activeSlide == null) return
    let echart = activeSlide.querySelector('.inner-chart') as HTMLElement;
    let id = this.id
    // console.log('绘制', activeSlide.querySelector('.inner-title')?.textContent)
    if (id) {
      if (this.statistic.has(id)) {
        // 该id已经请求过数据，使用缓存
        console.log('使用缓存');

      } else {
        this.dataController.getGarbageStationNumberStatistic(id, this.date).then(res => {
          // console.log('画图', res);
          this.statistic.set(id!, res)
          this.fillCandlestickOption(res);
          this.drawChart(echarts.init(echart))
        })
      }
    }

  }
  private fillCandlestickOption(lineDataSource: Array<GarbageStationGarbageCountStatistic>
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
          image: '../../assets/img/arrow-tag-a.png',
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
                    image: '../../assets/img/arrow-tag.png',
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
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
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
            fontSize: "16",
          }
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

      ],
      yAxis: {
        boundaryGap: false,
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
      ]
    }
    echart.setOption(options1)
  }

}

