import { initEcharts, linearGradient } from './echart'
export namespace AppEChart {
  export class EChartLine {
    init(dom: any, options: LineOption) {
      const checkDataIndex = (
          index: number,
          displayDataIndex: number[]
        ): boolean => {
          if (displayDataIndex.length == 0) return true
          const i = displayDataIndex.indexOf(index)
          return i > -1
        },
        seriesConfig = (options: LineOption) => {
          if (options.moreLine == false) {
            return [
              {
                data: options.seriesData,
                type: 'line',
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: '14',
                      color: '#b2b2b2', //图表中的数值颜色
                      textStroke: '1px white',
                    },
                    formatter: function (obj: any) {
                      if (options.seriesLabel != null) {
                        let display = checkDataIndex(
                          obj.dataIndex,
                          options.seriesLabel
                        )
                        if (!display) return ''
                      }
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: '#3a93ff',
                    lineStyle: {
                      color: '#3a93ff',
                      width: 4,
                    },
                  },
                },
                areaStyle: {
                  normal: {
                    color: linearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: '#3a93ff', // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgba(58, 147, 255, 0.1)', // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                  },
                },
              },
            ]
          } else {
            const configs = new Array()
            var i = 0
            options.seriesData.map((x: any) => {
              configs.push({
                data: x.data,
                name: x.name,
                type: 'line',
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: '14',
                      color: options.colors[i],
                    },
                    formatter: function (obj: any) {
                      if (options.seriesLabel != null) {
                        let display = checkDataIndex(
                          obj.dataIndex,
                          options.seriesLabel
                        )
                        if (!display) return ''
                      }
                    },
                  },
                },
                itemStyle: {
                  normal: {
                    color: options.colors[i],
                    lineStyle: {
                      color: options.colors[i],
                      width: 4,
                    },
                  },
                },
                areaStyle: {
                  normal: {
                    color: linearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: options.colors[i], // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: options.colors2[i], // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                  },
                },
              })
              i += 1
            })
            return configs
          }
        }

      const create = (options: LineOption) => {
        return {
          grid: {
            left: options.left,
            top: '20%',
            right: options.right,
            bottom: '10px',
            containLabel: true,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: options.legendData.data,
            orient: options.legendData.orient,
            right: options.legendData.right,
            textStyle: {
              color: options.legendData.color,
              fontSize: options.legendData.fontSize,
            },
          },
          // title: {
          //     subtext: '单位(起)',
          //     left: 'right',
          //      subtextStyle:{
          //          color:'#7A8DE6'
          //      },
          //      top:-6
          // },
          xAxis: {
            type: 'category',
            data: options.xAxisData,
            axisLabel: {
              color: '#c9c8ce', // 图表底部数值颜色
              fontSize: '14',
              interval: function (index: number, value: string) {
                return options.xAxisInterval.indexOf(index) > -1
              },
            },
            axisTick: {
              //刻度线
              show: false,
              lineStyle: {
                color: 'rgb(117,134,224,0.3)',
              },
            },
          },
          yAxis: {
            type: 'value',
            axisTick: {
              //刻度线
              show: false,
            },
            axisLine: {
              //y轴
              show: false,
            },
            axisLabel: {
              color: '#d8f4ff',
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(117,134,224,0.3)',
              },
            },
          },
          series: seriesConfig(options),
        }
      }
      initEcharts(dom, create(options))
    }
  }

  export class LineOption {
    xAxisData: Array<any>
    boundaryGap: boolean = true
    seriesData: Array<any>
    legendData: {
      data: string[]
      right: number
      color: string
      fontSize: number
      orient: string
    } = {
      data: [],
      right: 0,
      color: 'white',
      fontSize: 12,
      orient: 'horizontal',
    }
    legend: any
    init = true
    right = '12px'
    left = '12px'
    /**多条 */
    moreLine = false
    colors = ['#7586e0', '#3184e3', '#ffba00']
    colors2 = [
      'rgb(117,134,224,0.5)',
      'rgb(49,132,227,0.5)',
      'rgb(255,186,0,0.5)',
    ]
    xAxisInterval = [0, 5, 11, 17, 23] //
    seriesLabel = [0, 3, 6, 9, 12, 15, 18, 21]
  }
}
