import { CandlestickOption } from "./echart";
import IAside from "./IAside"
import { dateFormat, getAllDay } from "../../common/tool";

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
import { GarbageStationGarbageCountStatistic } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { GarbageStationViewModel } from "./data-controllers/ViewModels";
import { NavigationWindow } from ".";
import { Service } from "../../data-core/repuest/service";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { DataController } from "./data-controllers/DataController";
import { EventType } from "../../data-core/model/waste-regulation/event-number";

echarts.use([
    GridComponent,
    LineChart,
    BarChart,
    VisualMapComponent,
    CanvasRenderer,
    TooltipComponent,
    DataZoomComponent
])

/**
 * 
 */

interface EchartsAsideOptions {
    date?: Date;
    data?: GarbageStationViewModel[];
    dataController: DataController
}

// const user = (window.parent as NavigationWindow).User;


export default class EchartsAside extends IAside {
    candlestickOption: CandlestickOption = new CandlestickOption()
    myChart: echarts.ECharts

    outterContainer: HTMLElement;
    innerContainer: HTMLDivElement = document.createElement("div");

    dataController: DataController;

    _title: string = "";

    get title() {
        return this._title;
    }
    set title(val) {
        this._title = val;
        // this.elements.doms.title.textContent = val;
    }
    _date: Date = new Date();

    get date() {
        return this._date;
    }
    set date(val) {
        this._date = val;
        // this.elements.doms.date.textContent = dateFormat(val, "yyyy年MM月dd日")
    }
    data: GarbageStationViewModel[];

    statistic: Map<string, GarbageStationGarbageCountStatistic[]> = new Map()

    _id: string = '';

    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;

        let index = this.data.findIndex(item => {
            return item.Id == val;
        })
        index = index == -1 ? 0 : index
        if (index == 0) {
            this.draw();
        } else {

            this.swiper.slideTo(index);
        }

        console.log('set id')



    }
    swiper: Swiper;



    elements: {
        [key: string]: any
    } = {

        }

    template = `
    <div class="inner-mask"></div>
    <div class='inner-content'>
         <div class='inner-bar'>
           <div class='inner-back'>
             <i class="howell-icon-arrow2left"></i>返回
           </div>
        </div>
        <div class='inner-main'>
              <div class="swiper-container">
                 <div class="swiper-wrapper">
                 </div>

             </div>
        </div>
        <div class='inner-footer' style='display:none'>
            <div class='inner-btn'>返回</div>
        </div>
    </div>
    `
    constructor(selector: HTMLElement | string) {
        super();
        this.outterContainer = typeof selector == "string" ? document.querySelector(selector) as HTMLElement : selector;


        this.innerContainer.classList.add("echart-inner-container");
        this.innerContainer.innerHTML = this.template;



        return this;
    }
    init(options: EchartsAsideOptions) {
        this.outterContainer.innerHTML = '';
        this.outterContainer.appendChild(this.innerContainer);


        this.elements = {
            mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
            doms: {
                innerBack: this.innerContainer.querySelector('.inner-back') as HTMLDivElement,
            },
            footer: {
                backBtn: this.innerContainer.querySelector('.inner-btn') as HTMLDivElement,
            }
        }
        Object.assign(this, options);


        this.bindEvents();

        this.swiper = new Swiper('.echart-inner-container .swiper-container', {
            virtual: {
                slides: (() => {
                    var slides = [];
                    for (let i = 0; i < this.data.length; i++) {

                        let { Name, GarbageRatio, AvgGarbageTime, MaxGarbageTime, GarbageDuration, TodayEventNumbers } = this.data[i].NumberStatistic;

                        GarbageRatio = Number(GarbageRatio.toFixed(2));
                        AvgGarbageTime = Math.round(AvgGarbageTime);
                        MaxGarbageTime = Math.round(MaxGarbageTime);
                        GarbageDuration = Math.round(GarbageDuration);
                        let maxHour = Math.floor(MaxGarbageTime / 60);
                        let maxMinute = MaxGarbageTime - maxHour * 60;
                        let totalHour = Math.floor(GarbageDuration / 60);
                        let totalMinute = GarbageDuration - totalHour * 60;
                        let illegalDrop = 0;
                        let mixIntoDrop = 0;

                        TodayEventNumbers.forEach(eventNumber => {
                            if (eventNumber.EventType == EventType.IllegalDrop) {
                                illegalDrop = eventNumber.DayNumber
                            } else if (eventNumber.EventType == EventType.MixedInto) {
                                mixIntoDrop = eventNumber.DayNumber
                            }
                        })

                        slides.push(`
                            <div data-id='${this.data[i].Id}' style="padding:0 10px;">
                                <div class='inner-txt'>
                                    <div class='inner-title'>${this.data[i].Name}</div>
                                     <div class='inner-date'>${dateFormat(this.date, "yyyy年MM月dd日")}</div>
                                </div>
                                <div class='inner-statisic'>
                                    <div class='head'>
                                        <div class='head-num'>${GarbageRatio}</div>
                                        <div class='head-suffix'>分</div>
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
                        `)
                    }
                    return slides
                })(),
            },
            on: {
                transitionEnd: () => {
                    console.log('transitionEnd')
                    this.draw()
                }
            }
        })


        return this;
    }
    bindEvents() {
        // window.addEventListener("resize", () => this.myChart.resize());
        if (this.elements.doms && this.elements.doms.innerBack) {
            this.elements.doms.innerBack.addEventListener("click", () => {
                this.notify({
                    showChart: false
                })
            })
        }
        if (this.elements.footer && this.elements.footer.backBtn) {
            this.elements.footer.backBtn.addEventListener("click", () => {
                this.notify({
                    showChart: false
                })
            })
        }
    }
    draw() {

        let activeSlide = this.innerContainer.querySelector('.swiper-slide-active') as HTMLElement;
        let echart = activeSlide.querySelector('.inner-chart') as HTMLElement;
        let id = (activeSlide.firstElementChild as HTMLElement).dataset['id'];
        console.log('draw', id)
        if (this.statistic.has(id)) {
            // 该id已经请求过数据，使用缓存
            console.log('使用缓存');

        } else {
            //this.date
            this.dataController.getGarbageStationNumberStatistic(id,new Date(new Date().getTime() - 24*3600*1000*3)).then(res => {
                console.log('画图',res);
                this.statistic.set(id, res)
                this.fillCandlestickOption(res);
                this.drawChart(echarts.init(echart))
            })
        }
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
    drawChart(echart: echarts.ECharts) {

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