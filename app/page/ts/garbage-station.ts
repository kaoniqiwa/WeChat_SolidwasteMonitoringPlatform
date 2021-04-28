import { NavigationWindow } from ".";
import { SessionUser } from "../../common/session-user";
import { dateFormat, getAllDay } from "../../common/tool";
import { ResponseData } from "../../data-core/model/response-data";
import { OnlineStatus } from "../../data-core/model/waste-regulation/camera";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { Flags, GarbageStation, GetGarbageStationsParams, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationGarbageCountStatistic, GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow, SelectionMode } from "./aside-list";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { DataController } from "./data-controllers/DataController";
import { IGarbageStationController, StatisticNumber } from "./data-controllers/IController";
import { ClassNameHelper, Language } from "./language";
import Swiper, { Virtual, Pagination, } from 'swiper';
import $ from 'jquery';
import MyAside from './myAside';
import EchartsAside from "./echartsAside";
import { GarbageStationViewModel } from "./data-controllers/ViewModels";
import { CandlestickOption } from "./echart";

import '../css/basic.less'


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
import IObserver from "./IObserver";

echarts.use([
  GridComponent,
  LineChart,
  BarChart,
  VisualMapComponent,
  CanvasRenderer,
  TooltipComponent,
  DataZoomComponent
])


// 理论上应在ts中根据需求导入minirefresh，而不是写死在html中，受项目parcel-bundler版本限制，未实现
// import "minirefresh";


// 模块化方式使用 Swiper库
Swiper.use([
  Virtual,
  Pagination
])


enum ZoomStatus {
  out = "zoomOut",
  in = "zoomIn"
}
interface IActiveElement {
  Element: HTMLDivElement,
  id: string,
  divisionId: string,
  imageUrls: Array<string>,
  state: Flags<StationState>
  swiper?: Swiper
}
// 使用简单的观察者模式，实现 GarbageStationClient 和 myAside 类的通信
class GarbageStationClient implements IObserver {
  candlestickOption: CandlestickOption = new CandlestickOption()


  content: HTMLElement | null;
  template: HTMLTemplateElement | null;
  asideTemplate: HTMLTemplateElement | null;
  asideMain?: HTMLDivElement;

  GarbageStationNumberStatistic: Map<string, GarbageStationNumberStatistic> = new Map();
  garbageElements: Map<string, IActiveElement> = new Map();
  garbageElementsDivision: Map<string, any> = new Map();

  btnDivision: HTMLDivElement;
  imgDivision: HTMLDivElement;
  searchInput: HTMLInputElement;
  btnSearch: HTMLElement;
  originImg: HTMLDivElement;
  hwBar: HTMLDivElement

  zoomStatus: ZoomStatus = ZoomStatus.out;
  swiper: Swiper;
  swiperStatus: boolean = false;
  originStatus: boolean = false;
  activeIndex: number;
  activeElement: IActiveElement;

  asideControl: AsideControl;
  asidePage?: AsideListPage;
  asideIframe: HTMLIFrameElement;



  selectedDivisions: Map<string, any> = new Map();

  private customElement = document.createElement('div');

  dataController: IGarbageStationController;
  type: ResourceType;
  garbageStations: GarbageStationViewModel[];
  numberList: StatisticNumber[];
  roleList: ResourceRole[];
  myAside: MyAside;

  myChartAside: EchartsAside;
  myChartOptions: {
    date: Date,
    data: Array<GarbageStationGarbageCountStatistic>
  }

  _show = false;
  get show() {
    return this._show
  }
  set show(val) {
    this._show = val;
    if (val) {
      $(this.elements.container.asideContainer).show();
      setTimeout(() => {
        this.myAside.slideIn()
      }, 1e2);
    }
    else {
      setTimeout(() => {
        $(this.elements.container.asideContainer).hide();
      }, 3e2);
    }

  }
  _showChart: boolean = false;

  get showChart() {
    return this._showChart;
  }
  set showChart(val) {
    this._showChart = val;
    if (val) {
      this.elements.container.chartContainer.classList.add('slideIn')
    } else {
      this.elements.container.chartContainer.classList.remove('slideIn')
    }
  }

  elements = {
    container: {
      hwContainer: document.querySelector('#hw-container') as HTMLDivElement,

      chartContainer: document.querySelector<HTMLElement>('#chart-container'),

      asideContainer: document.querySelector('#aside-container') as HTMLElement,
    },
    btns: {
      imgDivision: document.querySelector('#img_division') as HTMLDivElement,
      btnDivision: document.querySelector('#filter') as HTMLDivElement,
      searchInput: document.querySelector('#searchInput') as HTMLInputElement,
      btnSearch: document.querySelector('#btn_search') as HTMLInputElement,
      imgIcon: document.querySelector('#img_division i') as HTMLElement
    },
    others: {
      hwBar: document.querySelector('.hw-bar') as HTMLDivElement,
      originImg: document.querySelector('#origin-img') as HTMLDivElement,
      template: document.querySelector('#card-template') as HTMLTemplateElement,
    }

  }

  constructor(type: ResourceType, dataController: IGarbageStationController
  ) {
    this.type = type;
    this.dataController = dataController;



  }
  update(args) {
    if (args) {
      if ('show' in args) {
        this.show = args.show;
      }
      if ('showChart' in args) {
        this.showChart = args.showChart
      }
      if ('filtered' in args) {
        console.log('filtered', args.filtered)
        let data: Map<string, Array<string>> = new Map();

        let filtered = args.filtered as Map<string, Set<HTMLElement>>;
        for (let [k, v] of filtered) {
          let ids = [...v].map(element => element.getAttribute('id'));
          data.set(k, ids);
        }
        console.log(data)
        this.confirmSelect(data);

      }
    }
  }
  init() {
    this.loadData().then(() => {
      this.resetBar()
      this.createAside();
      this.createChartAside();
      this.createContent();
      this.createNumberList();

      if (!refreshed) {
        this.bindEvents();
      }
    })

  }
  async loadData() {
    // 拉取厢房数据
    this.garbageStations = await this.dataController.getGarbageStationList();
    let ids = this.garbageStations.map(item => item.Id)
    console.log('厢房数据', this.garbageStations)

    // 获取垃圾厢房当天的统计数据
    let roles = ids.map(x => {
      let role = new ResourceRole();
      role.Id = x;
      role.ResourceType = type;
      return role;
    })
    this.numberList = await this.dataController.getGarbageStationStatisticNumberListInToday(roles);
    console.log('底部数量数据', this.numberList)

    this.roleList = await this.dataController.getResourceRoleList();

    console.log('侧边栏筛选数据', this.roleList)


  }

  resetBar() {
    $(this.elements.others.originImg).hide();
    this.zoomStatus = ZoomStatus.out;
    this.elements.btns.imgIcon.className = "howell-icon-list";
    this.elements.btns.searchInput.value = "";
  }
  createContent() {
    let _this = this;
    // 清空容器内容
    this.elements.container.hwContainer.innerHTML = "";

    // 模板内容
    let tempContent = this.elements.others.template?.content as DocumentFragment;

    let len = this.garbageStations.length
    for (let i = 0; i < len; i++) {
      const v = this.garbageStations[i];

      // v.StationState = Math.random() * 3 >> 0;

      if (typeof v.StationState == "number") {
        v.StationState = new Flags<StationState>(v.StationState);
      }
      if (!v.DivisionId)
        continue;
      let info = tempContent.cloneNode(true) as DocumentFragment;
      let content_card = info.querySelector('.hw-content__card') as HTMLDivElement;
      content_card.setAttribute('id', v.Id)
      content_card.setAttribute('divisionid', v.DivisionId)
      content_card.dataset['cardname'] = v.Name;


      // 标题
      let title_head = info.querySelector('.content__title__head') as HTMLDivElement;
      title_head.textContent = v.Name

      // 标题状态
      let title_bandage = info.querySelector('.content__title__badage') as HTMLDivElement;


      // v.NumberStatistic.CurrentGarbageTime = 64;
      let currentGarbageTime = v.NumberStatistic.CurrentGarbageTime >> 0;
      let hour = Math.floor(currentGarbageTime / 60);
      let minute = currentGarbageTime - hour * 60;

      let hour2 = hour.toString().padStart(2, '0');
      let minute2 = minute.toString().padStart(2, '0');

      // console.log(hour,minute);

      info.querySelector('.constDrop-number').textContent = `${hour2}:${minute2}`

      title_bandage.classList.remove('red');
      title_bandage.classList.remove('green');
      title_bandage.classList.remove('orange');
      let states = v.StationState as Flags<StationState>;

      if (states.contains(StationState.Error)) {

        title_bandage.textContent = Language.StationState(StationState.Error);
        title_bandage.classList.add('red');
      }
      else if (states.contains(StationState.Full)) {
        title_bandage.textContent = Language.StationState(StationState.Full);
        title_bandage.classList.add('orange');
      }
      else {
        title_bandage.textContent = Language.StationState(StationState.Normal);
        title_bandage.classList.add('green');
      }
      this.createFooter(v.Id, v.DivisionId);

      let wrapper = info.querySelector('.content__img .swiper-wrapper') as HTMLDivElement;
      let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement;
      let imageUrls: Array<string> = [];

      this.dataController.getCameraList(v.Id, (cameraId: string, url?: string) => {
        let img = document.getElementById(cameraId) as HTMLImageElement;
        if (!img) return
        img.src = url

        img.onerror = () => {
          img.src = DataController.defaultImageUrl;
        }

      }).then(cameras => {
        cameras.forEach((camera, index) => {

          imageUrls.push(camera.ImageUrl!)
          let div: HTMLDivElement;

          index != 0 ? div = slide?.cloneNode(true) as HTMLDivElement : div = slide;

          let img = div!.querySelector('img') as HTMLImageElement;
          img.id = camera.Id;
          img.setAttribute('index', index + '')
          // img!.src = camera.ImageUrl!;

          if (!camera.OnlineStatus == undefined || camera.OnlineStatus == OnlineStatus.Offline) {
            let nosignal = div.querySelector('.nosignal') as HTMLDivElement;
            nosignal.style.display = "block";
          }


          wrapper!.appendChild(div);
        })
      })
      content_card.addEventListener('click', function (e) {
        let target = e.target as HTMLElement;
        let currentTarget = e.currentTarget as HTMLDivElement;
        if (target.tagName.toString().toLowerCase() == 'img') {
          let ev = new CustomEvent('cat', {
            detail: {
              index: target.getAttribute('index'),
              id: v.Id
            }
          })
          _this.customElement.dispatchEvent(ev)
        } else {
          _this.myChartAside.id = currentTarget.id;
          _this.showChart = true;
        }

      })

      this.garbageElements.set(v.Id, {
        Element: content_card,
        id: v.Id,
        divisionId: v.DivisionId,
        imageUrls: imageUrls,
        state: v.StationState
      })

      this.elements.container.hwContainer?.appendChild(info)
    }
  }
  bindEvents() {
    let _this = this;
    this.elements.btns.btnDivision.addEventListener('click', () => {
      this.toggle()
    })
    this.elements.btns.imgDivision.addEventListener('click', () => {
      // 在蒙版消失之前，所有按钮不能点击

      if (this.originStatus) return

      if (this.zoomStatus == ZoomStatus.in) {
        this.elements.btns.imgIcon.classList.remove('howell-icon-list2')
        this.elements.btns.imgIcon.classList.add('howell-icon-list')
        this.zoomOut();
      } else {

        this.elements.btns.imgIcon.classList.remove('howell-icon-list')
        this.elements.btns.imgIcon.classList.add('howell-icon-list2')

        this.zoomIn();
      }
      console.log('当前状态', this.zoomStatus)


    })
    this.elements.btns.searchInput.addEventListener('search', (e) => {
      this.filerContent();

    })
    this.elements.btns.btnSearch.addEventListener('click', () => {
      this.filerContent();
    })
    // // 用私有变量监听事件
    this.customElement.addEventListener('cat', (e: any) => {
      this.showDetail({
        id: e.detail.id,
        index: e.detail.index
      }, Math.random() * 10 >> 0);
    })
    this.elements.others.originImg.addEventListener('click', function () {

      _this.activeIndex = _this.swiper.activeIndex;
      if (_this.activeElement.swiper) {
        _this.activeElement.swiper.slideTo(_this.activeIndex, 0)
      } else {
        _this.activeElement.Element.querySelector(`.swiper-slide:nth-of-type(${_this.activeIndex + 1})`).scrollIntoView({
          block: 'nearest',
          behavior: 'auto',
          inline: 'nearest'
        });
      }

      $(this).fadeOut();
      _this.originStatus = false;

    })
  }

  createFooter(id: string, divisionId: string) {
    let p = this.dataController.getDivision(divisionId);
    p.then(division => {
      let info = document.getElementById(id) as HTMLDivElement;

      let content_footer = info.querySelector('.content__footer .division-name') as HTMLDivElement;
      content_footer.innerHTML = division.Name;
    });
  }
  createNumberList() {
    let len = this.numberList.length;
    for (let i = 0; i < len; i++) {
      const numberStatic = this.numberList[i];
      if (numberStatic) {
        let info = document.getElementById(numberStatic.id) as HTMLDivElement;
        if (info) {
          let illegalDrop = info.querySelector('.illegalDrop-number') as HTMLSpanElement;
          illegalDrop.innerHTML = numberStatic.illegalDropNumber.toString();
          let mixedInto = info.querySelector('.MixedInto-number') as HTMLSpanElement;
          mixedInto.innerHTML = numberStatic.mixedIntoNumber.toString();
        }
      }
    }
  }
  toggle() {
    this.show = !this.show;
  }
  createAside() {
    this.myAside = null;
    this.myAside = new MyAside(this.elements.container.asideContainer, [
      {
        title: '状态',
        data: [
          {
            Name: Language.StationState(StationState.Normal),
            Id: StationState.Normal
          },
          {
            Name: Language.StationState(StationState.Full),
            Id: StationState.Full
          },
          {
            Name: Language.StationState(StationState.Error),
            Id: StationState.Error
          },

        ],
        type: 'state',
        shrink: false
      },
      {
        title: Language.ResourceType(type),
        data: this.roleList,
        type: "role",
        mode: SelectionMode.multiple
      },

    ]).init()

    this.myAside.add(this)
  }
  createChartAside() {
    this.myChartAside = null;
    this.myChartAside = new EchartsAside(this.elements.container.chartContainer).init({
      data: this.garbageStations,
      date: new Date(),
      dataController
    });
    this.myChartAside.add(this)
  }
  resetSelected() {
    for (let [k, v] of this.selectedDivisions) {
      v.Element.classList.remove('selected')
    }
    this.selectedDivisions.clear();


  }
  confirmSelect(data: Map<string, Array<string>>) {


    for (let [k, v] of this.garbageElements) {

      // 默认显示
      v.Element.style.display = 'block';

      for (let [key, val] of data) {
        if (key == 'role') {
          if (val.length && !val.includes(v.divisionId)) {
            v.Element.style.display = 'none';
          }
        }
        if (key == 'state') {
          if (val.length && !val.includes(v.state.value + "")) {
            v.Element.style.display = 'none';
          }
        }
      }

      if (this.zoomStatus == ZoomStatus.out) {

        this.zoomOut();
      }
      else if (this.zoomStatus == ZoomStatus.in) {

        this.zoomIn();
      }
    }
  }
  filerContent() {
    let str = this.elements.btns.searchInput.value;
    for (let [k, v] of this.garbageElements) {
      let div = v.Element;
      // console.log(div)
      if (str && !div.textContent.includes(str)) {
        div.style.display = 'none';
      } else {
        div.style.display = '';
      }
    }
  }
  // 放大
  zoomIn() {
    let _this = this;
    // console.log(this.garbageElements);
    for (let [k, v] of this.garbageElements) {
      let contentCard = v.Element;
      contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });

      contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });
      contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });
      contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });

      let container = contentCard.querySelector('.swiper-container') as HTMLDivElement;
      container.scrollLeft = 0;
      container.classList.add(ZoomStatus.in);

      let pagination = contentCard.querySelector('.swiper-pagination') as HTMLDivElement;

      if (v.swiper) {
        v.swiper.destroy();
        v.swiper = null
      }
      v.swiper = new Swiper(container, {
        pagination: {
          el: pagination,
          type: 'fraction'
        },
      })



    }

    this.zoomStatus = ZoomStatus.in;
  }
  // 缩小
  zoomOut() {
    for (let [k, v] of this.garbageElements) {
      let contentCard = v.Element;
      contentCard.querySelectorAll('.swiper-slide').forEach((element: HTMLElement) => {
        element.classList.remove(ZoomStatus.in);
        element.style.width = "";
      });
      contentCard.querySelectorAll('.content__title__badage').forEach((element: HTMLElement) => {
        element.classList.remove(ZoomStatus.in);
      });
      contentCard.querySelectorAll('.content__footer').forEach((element: HTMLElement) => {
        element.classList.remove(ZoomStatus.in);
      });

      contentCard.querySelectorAll('.content__img').forEach((element: HTMLElement) => {
        element.classList.remove(ZoomStatus.in);
      });

      let container = contentCard.querySelector('.swiper-container');
      container.classList.remove(ZoomStatus.in);



      if (v.swiper) {
        v.swiper.destroy();
        v.swiper = null
      }
    }

    this.zoomStatus = ZoomStatus.out;
  }
  showDetail(info: { id: string, index: number }, a: number) {
    let _this = this;
    let element = this.garbageElements.get(info.id);
    let imgs = element.imageUrls;
    this.activeElement = element;


    if (this.swiper) {
      this.swiper.destroy();
      this.swiper = null;
    };
    $(this.elements.others.originImg).fadeIn()
    this.originStatus = true;
    if (!this.swiper) {
      this.swiper = new Swiper(this.elements.others.originImg, {
        virtual: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
      })
    }
    this.swiper.virtual.removeAllSlides()
    this.swiper.virtual.cache = [];
    for (let i = 0; i < imgs.length; i++) {
      let url = this.dataController.getImageUrl(imgs[i]);
      this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img src="' + url +
        '" /></div>');
    }
    this.swiper.slideTo(info.index, 0);

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
    let myChart = echarts.init(this.elements.container.chartContainer)
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

let refreshed = false;

const user = (window.parent as NavigationWindow).User;
const http = (window.parent as NavigationWindow).Authentication;

console.log(user);
const service = new Service(http);
const type = user.WUser.Resources![0].ResourceType;
const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!);
const stationClient = new GarbageStationClient(type, dataController);

stationClient.init();



let MiniRefresh = Reflect.get(window, 'MiniRefresh')
let miniRefresh = new MiniRefresh({
  container: '#minirefresh',
  isLockX: false,
  down: {
    callback: () => {
      // 下拉事件

      refreshed = true;
      stationClient.init();
      miniRefresh.endDownLoading();
    }
  },
  up: {
    isAuto: false,
    isLock: true,
    callback: function () {
      // 上拉事件
      miniRefresh.endUpLoading(true);


    }
  }
});

