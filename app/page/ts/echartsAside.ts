import { CandlestickOption } from "./echart";
import IAside from "./IAside"
import { dateFormat, getAllDay } from "../../common/tool";



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
    title?: string;
    date?: Date,
    data?: GarbageStationGarbageCountStatistic[]

}
export default class EchartsAside extends IAside {
    candlestickOption: CandlestickOption = new CandlestickOption()


    outterContainer: HTMLElement;
    innerContainer: HTMLDivElement = document.createElement("div");

    _title: string = "";

    get title() {
        return this._title;
    }
    set title(val) {
        this._title = val;
        this.elements.doms.title.textContent = val;
    }
    _date: Date = new Date();

    get date() {
        return this._date;
    }
    set date(val) {
        this._date = val;
        this.elements.doms.date.textContent =  dateFormat(val, "yyyy年MM月dd日")
    }

    _data: GarbageStationGarbageCountStatistic[];

    get data() {
        return this._data;

    }
    set data(val: GarbageStationGarbageCountStatistic[]) {
        this._data = val;
        this.fillCandlestickOption(val);
        this.drawChart()
    }


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
            <div class='inner-txt'>
                <div class='inner-title'></div>
                <div class='inner-date'></div>
            </div>
            <div class="inner-chart"></div>
        </div>
        <div class='inner-footer'>
            <div class='inner-btn'>返回</div>
        </div>
    </div>
    `

    constructor(selector: HTMLElement | string, private options?: EchartsAsideOptions) {
        super();
        this.outterContainer = typeof selector == "string" ? document.querySelector(selector) as HTMLElement : selector;


        this.innerContainer.classList.add("echart-inner-container");
        this.innerContainer.innerHTML = this.template;

        return this;
    }
    init() {
        this.outterContainer.innerHTML = '';
        this.outterContainer.appendChild(this.innerContainer);


        this.elements = {
            mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
            doms: {
                innerBack: this.innerContainer.querySelector('.inner-back') as HTMLDivElement,
                title: this.innerContainer.querySelector('.inner-title'),
                date: this.innerContainer.querySelector('.inner-date'),
                chartContainer: this.innerContainer.querySelector('.inner-chart') as HTMLDivElement,
            },
            footer: {
                backBtn: this.innerContainer.querySelector('.inner-btn') as HTMLDivElement,
            }
        }

        this.title = this.options?.title;
        this.date = this.options?.date;
        this.data = this.options?.data;

        this.bindEvents()


        return this;
    }
    bindEvents() {
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

        console.log(this.candlestickOption)
    }
    drawChart() {
        let myChart = echarts.init(this.elements.doms.chartContainer)
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
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100
                }
            ],
            grid: [
                {
                    top: '20%',
                    bottom: '10px',
                    containLabel: true
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
            ]
        }
        myChart.setOption(options1)
    }
}