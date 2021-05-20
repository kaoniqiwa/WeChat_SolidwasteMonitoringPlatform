/**
 *  pmx
 */
export interface IEChartsData {

}

export interface IEChartOption { }

export class BarOption implements IEChartOption {
  xAxisData: IEChartsData = [];
  seriesData: IEChartsData[] = [];
  seriesName = new Array<string>();
  label = {
    show: true,
    position: 'top'
  }
  axisTick = {
    show: false
  }
  axisLine = {
    show: false,
    onZero: false,//y轴
    lineStyle: {
      color: '#7d90bc'
    }
  }
  axisLabel = {
    color: '#d8f4ff',
    show: false,
    formatter: null
  }
  legendData: {
    data: string[], itemWidth: number, itemHeight: number
    , right: number, color: string, fontSize: number, orient: string,
  } = {
      data: [],
      itemHeight: 6,
      itemWidth: 6,
      right: 0,
      color: 'white',
      fontSize: 12,
      orient: 'horizontal'
    };

  color = ['#7586e0', '#ffba00', '#32b43e', '#2ac3e2', '#ef6464'];
  color2 = ['rgb(117,134,224,0.5)', 'rgb(255,186,0,0.5)', 'rgb(50,180,62,0.5)', 'rgb(42,195,226,0.5)', 'rgb(239,100,100,0.5)'];
  displayScaleIndex: number[] = new Array();
  displayDataIndex: number[] = new Array();
  subTitle = '单位(吨)';
  barWidth = 12;
}


export class BarOptionV2 implements IEChartOption {
  yAxisData: IEChartsData = []
  seriesData: IEChartsData[] = [];
  seriesName = new Array<string>();
  color = ['#7586e0', '#3184e3'];
  color2 = ['rgb(117,134,224,0.5)', 'rgb(49,132,227,0.5)'];
  barWidth = 12;
}



export class LineOption implements IEChartOption {
  xAxisData: Array<IEChartsData> = [];
  seriesData: Array<IEChartsData> = [];
  label = {
    show: true
  }
  axisTick = {
    show: false
  }
  axisLine = {
    show: false,
    onZero: false,//y轴
    lineStyle: {
      color: '#7d90bc'
    }
  }
  axisLabel = {
    color: '#d8f4ff',
    show: false,
    formatter: null
  }
  legendData: {
    data: string[], right: number, color: string
    , fontSize: number, orient: string,
  } = {
      data: [],
      right: 0,
      color: 'white',
      fontSize: 12,
      orient: 'horizontal'
    };
  legend?: IEChartsData;
  init = true;
  right = '12px';
  left = '12px';
  /**多条 */
  moreLine = false;
  colors = ['#7586e0', '#ffba00', '#32b43e', '#2ac3e2', '#ef6464'];
  colors2 = ['rgb(117,134,224,0.5)', 'rgb(255,186,0,0.5)', 'rgb(50,180,62,0.5)', 'rgb(42,195,226,0.5)', 'rgb(239,100,100,0.5)'];
  xAxisInterval = [0, 5, 11, 17, 23]; // 
  seriesLabel = [0, 3, 6, 9, 12, 15, 18, 21];
}

export class CandlestickOption implements IEChartOption {
  xAxisLine: Array<string> = [];
  xAxisBar: Array<string> = [];
  lineData: Array<number | string> = [];
  lineDataB: Array<number | string> = [];
  barDataB: Array<{
    value: number,
    itemStyle: {
      color: string
    },
    label: {
      show: boolean,
      formatter: any,
      rich: any
    },
    emphasis: any;
  }> = [];

  barData: Array<{
    value: number,
    itemStyle: {
      color: string
    },
    label: {
      show: boolean,
      formatter: any,
      rich: any
    },
    emphasis: any;
  }> = [];
  itemClick?: (param: {
    event: {
      offsetX: number
      offsetY: number
    },
    name: string
    seriesId: string,
    seriesName: string
  }) => void;
  dbitemClick?: (keyVal: string) => void;
  dataZoomClick?: (param: { batch: Array<{ start: number, end: number }> }) => void;
  visualMapPieces = new Array();
}

export class PieOption implements IEChartOption {
  legendData: Array<IEChartsData> = [];
  seriesData: Array<IEChartsData> = [];
}

