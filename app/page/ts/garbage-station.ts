import { NavigationWindow } from ".";
import { OnlineStatus } from "../../data-core/model/waste-regulation/camera";
import { Flags, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationGarbageCountStatistic, GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { Service } from "../../data-core/repuest/service";
import { AsideControl } from "./aside";
import { AsideListPage, AsideListPageWindow, SelectionMode } from "./aside-list";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { DataController } from "./data-controllers/DataController";
import { IGarbageStationController, Paged, StatisticNumber } from "./data-controllers/IController";
import { Language } from "./language";
import Swiper, { Virtual, Pagination, } from 'swiper';
import $ from 'jquery';
import MyAside from './myAside';
import EchartsAside from "./echartsAside";
import { GarbageStationViewModel, IActiveElement, IImageUrl } from "./data-controllers/ViewModels";
import { CandlestickOption } from "./echart";

import '../css/header.less'


import '../css/garbagestations.css';
import "weui";

import 'minirefresh';
import 'minirefresh/dist/debug/minirefresh.css'
import "swiper/swiper.less";
import "swiper/components/pagination/pagination.less"
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
import { VideoUrl } from "../../data-core/model/waste-regulation/video-model";
import { VideoPlugin } from "./data-controllers/modules/VideoPlugin";
import { Page, PagedList } from "../../data-core/model/page";
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



// 使用简单的观察者模式，实现 GarbageStationClient 和 myAside 类的通信
class GarbageStationClient implements IObserver {
  candlestickOption: CandlestickOption = new CandlestickOption()


  content: HTMLElement | null = null;
  template: HTMLTemplateElement | null = null;
  asideTemplate: HTMLTemplateElement | null = null;
  asideMain?: HTMLDivElement;

  GarbageStationNumberStatistic: Map<string, GarbageStationNumberStatistic> = new Map();
  garbageElements: Map<string, any> = new Map();
  garbageElementsDivision: Map<string, any> = new Map();

  btnDivision?: HTMLDivElement;
  imgDivision?: HTMLDivElement;
  searchInput?: HTMLInputElement;
  btnSearch?: HTMLElement;
  originImg?: HTMLDivElement;
  hwBar?: HTMLDivElement

  zoomStatus: ZoomStatus = ZoomStatus.out;
  swiper: Swiper | null = null;
  swiperStatus: boolean = false;
  originStatus: boolean = false;
  activeIndex?: number;
  activeElement?: IActiveElement;


  selectedDivisions: Map<string, any> = new Map();

  private customElement = document.createElement('div');

  dataController: IGarbageStationController;
  type: ResourceType;
  garbageStations: GarbageStationViewModel[] = [];//接口请求到的所有数据

  garbageStationsChunk: GarbageStationViewModel[] = [];//按页请求的数据
  garbageStationsTotal: GarbageStationViewModel[] = [];//按页请求的数据
  dropPage: Page | null = null;


  // 将筛选后的数据分页
  start: number = 0;
  end: number = 0;
  offset: number = 20;

  eventTypes: Array<string> = [];
  roleTypes: Array<string> = []; // 筛选区域

  garbageDropTitle = '垃圾落地';
  garbageDropState = '999'


  roleList: ResourceRole[] = [];
  myAside: MyAside | null = null;

  myChartAside: EchartsAside | null = null;
  myChartOptions?: {
    date: Date,
    data: Array<GarbageStationGarbageCountStatistic>
  }


  _showAside = false;
  get showAside() {
    return this._showAside
  }
  set showAside(val) {
    this._showAside = val;
    if (val) {
      if (this.myAside) {
        $(this.elements.container.asideContainer).show();
        setTimeout(() => {
          this.myAside?.slideIn()
        }, 1e2);
      }

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
    count: document.querySelector('#count') as HTMLDivElement,
    container: {
      hwContainer: document.querySelector('#hw-container') as HTMLDivElement,

      chartContainer: document.querySelector<HTMLElement>('#chart-container') as HTMLDivElement,

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

  miniRefresh?: MiniRefresh;
  currentPage: Paged = {
    index: 1,
    size: 20,
  }
  constructor(type: ResourceType, dataController: IGarbageStationController
  ) {
    this.type = type;
    this.dataController = dataController;

    this.miniRefresh = new MiniRefresh({
      container: '#minirefresh',
      isLockX: false,
      down: {
        callback: () => {
          // 下拉事件
          this.miniRefreshDown();
        }
      },
      up: {
        isAuto: false,
        callback: () => {

          console.log('miniRefreshUp');
          this.miniRefreshUp()

        }
      }
    });

  }
  update(args: any) {
    if (args) {
      if ('show' in args) {
        this.showAside = args.show;
      }
      if ('showChart' in args) {
        this.showChart = args.showChart
      }
      if ('filtered' in args) {
        this.reset();

        // console.log('filtered', args.filtered)
        let data: Map<string, Array<string>> = new Map();

        let filtered = args.filtered as Map<string, Set<HTMLElement>>;
        for (let [k, v] of filtered) {
          let ids = [...v].map(element => element.getAttribute('id') || '');
          data.set(k, ids);
        }
        console.log(data)
        // this.confirmSelect(data);

        if (data.has('role')) {
          this.roleTypes = data.get('role')!;

        }
        if (data.has('state')) {
          this.eventTypes = data.get('state')!;
        }
      }
    }
  }
  init() {


    // 侧边栏数据仅请求一次
    this.loadAsideData().then(() => {
      this.createAside();
    })
    this.loadAllData().then(async () => {
      this.reset()
      // this.loadData();
      // this.createChartAside();
      // this.createContent();
    })
    this.bindEvents();

  }

  // 下拉刷新重新创建整个页面
  async miniRefreshDown() {

    await this.loadAllData();
    this.reset()
    this.createAside();
    // this.createChartAside();
    this.miniRefresh!.endDownLoading();
  }
  async miniRefreshUp() {

    let stop = false;

    console.log('drop page', this.dropPage)
    // 不是第一次请求
    if (this.dropPage) {
      if (this.dropPage.PageIndex >= this.dropPage.PageCount) {
        stop = true;

      } else {
        stop = false
        this.currentPage.index++;
      }

    }
    if (!stop) {
      this.loadData();
      this.createContent();
    }
    console.log('stop', stop);
    this.miniRefresh!.endUpLoading(stop);

    // this.miniRefresh!.endUpLoading(true);
  }
  async loadAllData() {
    // 拉取厢房数据,该接口只能拉取所有数据
    this.garbageStations = await this.dataController.getGarbageStationList();
    console.log('原始数据', this.garbageStations)
  }

  async loadAsideData() {
    this.roleList = await this.dataController.getResourceRoleList();
    // console.log('侧边栏筛选数据', this.roleList)
  }
  reset() {
    $(this.elements.others.originImg).hide();
    this.zoomStatus = ZoomStatus.out;
    this.elements.btns.imgIcon.className = "howell-icon-list";
    this.elements.btns.searchInput.value = "";

    this.elements.container.hwContainer.innerHTML = "";
    this.currentPage.index = 1;
    this.eventTypes = [];
    this.garbageStationsTotal = []
    this.dropPage = null;
    this.miniRefresh!.resetUpLoading();
  }
  createContent() {
    console.log('createContent')
    let _this = this;
    // 模板内容
    let tempContent = this.elements.others.template?.content as DocumentFragment;

    let len = this.garbageStationsChunk.length;
    for (let i = 0; i < len; i++) {
      const v = this.garbageStationsChunk[i];

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
      let currentGarbageTime = v.NumberStatistic!.CurrentGarbageTime! >> 0;
      // currentGarbageTime = Math.random() * 90 >> 0;
      // console.log('currentGarbageTime', currentGarbageTime)
      let hour = Math.floor(currentGarbageTime / 60);
      let minute = currentGarbageTime - hour * 60;

      (info.querySelector('.constDrop') as HTMLElement).classList.remove('hidden')
      if (currentGarbageTime == 0) {
        (info.querySelector('.constDrop') as HTMLElement).classList.add('hidden');
      }
      // let hour2 = hour.toString().padStart(2, '0');
      // let minute2 = minute.toString().padStart(2, '0');

      let illegalDrop = info.querySelector('.illegalDrop-number') as HTMLSpanElement;
      let mixedInto = info.querySelector('.MixedInto-number') as HTMLSpanElement;

      v.NumberStatistic?.TodayEventNumbers!.forEach(eventNumber => {
        if (eventNumber.EventType == EventType.IllegalDrop) {
          illegalDrop.textContent = eventNumber.DayNumber.toString()
        } else if (eventNumber.EventType == EventType.MixedInto) {
          mixedInto.textContent = eventNumber.DayNumber.toString()
        }
      });


      (info.querySelector('.constDrop-number') as HTMLElement).textContent = `${hour == 0 ? minute + "分钟" : hour + "小时" + minute + "分钟"}`;

      title_bandage.classList.remove('red');
      title_bandage.classList.remove('green');
      title_bandage.classList.remove('orange');
      let states = v.StationState as Flags<StationState>;
      title_bandage.textContent = "";//states.value.toString()
      if (states.contains(StationState.Error)) {

        title_bandage.textContent += Language.StationState(StationState.Error);
        title_bandage.classList.add('red');
      }
      else if (states.contains(StationState.Full)) {
        title_bandage.textContent += Language.StationState(StationState.Full);
        title_bandage.classList.add('orange');
      }
      else {
        title_bandage.textContent += Language.StationState(StationState.Normal);
        title_bandage.classList.add('green');
      }
      this.createFooter(v.Id, v.DivisionId);

      let wrapper = info.querySelector('.content__img .swiper-wrapper') as HTMLDivElement;
      let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement;
      let imageUrls: Array<IImageUrl> = [];

      this.dataController.getCameraList(v.Id, (cameraId: string, url?: string) => {
        let img = document.getElementById(cameraId) as HTMLImageElement;
        if (!img) return
        img.src = url!

        img.onerror = () => {
          img.src = DataController.defaultImageUrl;
        }

      }).then(cameras => {
        cameras.forEach((camera, index) => {

          imageUrls.push({
            cameraName: camera.Name,
            url: camera.ImageUrl!,
            cameraId: camera.Id,
            preview: camera.getPreviewUrl()
          })
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
          _this.myChartAside!.id = currentTarget.id!;// 触发绘图
          _this.showChart = true;
        }

      })

      this.garbageElements.set(v.Id, {
        Element: content_card,
        id: v.Id,
        divisionId: v.DivisionId,
        imageUrls: imageUrls,
        state: v.StationState,
        currentGarbageTime: currentGarbageTime
      })

      this.elements.container.hwContainer?.appendChild(info)
    }
  }
  loadData() {
    console.log('load data')
    let res = this.fetch(this.eventTypes, this.roleTypes, this.currentPage);

    this.garbageStationsChunk = res.Data;

    this.garbageStationsTotal = [...this.garbageStationsTotal, ...this.garbageStationsChunk]
    this.dropPage = res.Page;


    this.elements.count.textContent = this.garbageStationsTotal.length + "/" + this.dropPage!.TotalRecordCount;

  }
  // 这里模拟请求服务器数据
  fetch(eventTypes: string[], roleTypes: string[], paged: Paged) {

    console.log('eventTypes', eventTypes)
    console.log('roltTypes', roleTypes)
    /**
     *   垃圾落地集合中包含 正常/异常/满溢状态
     *   如果筛选的条件是垃圾落地和正常，那么筛选出垃圾落地后，再筛选正常会有重复的正常出现
     * 
     */
    let size = paged.size;
    let index = paged.index;

    let eventData: GarbageStationViewModel[] = [];
    if (eventTypes.length == 0) {
      eventData = this.garbageStations;
    }
    else {
      for (let i = 0; i < eventTypes.length; i++) {
        let type = eventTypes[i];
        let filtered = this.garbageStations.filter(item => {
          let stationState = (item.StationState as Flags<StationState>);
          // console.log(stationState, type)
          // 垃圾落地筛选条件
          if (type == this.garbageDropState) {
            let currentGarbageTime = (item.NumberStatistic?.CurrentGarbageTime!) >> 0;
            return currentGarbageTime > 0
          } else {
            // Flag<StationState>字段筛选
            if (stationState.value == StationState.Normal) {
              return stationState.value == Number(type)
            } else {
              return stationState.contains(Number(type))
            }
          }

        })

        eventData.push(...filtered)
      }
    }

    let resData: GarbageStationViewModel[] = []

    let roleData: GarbageStationViewModel[] = [];

    if (roleTypes.length == 0) {
      roleData = eventData;
    } else {
      // 居委会筛选是并集关系
      for (let i = 0; i < roleTypes.length; i++) {
        let type = roleTypes[i];
        let filtered = eventData.filter(item => {
          return item.DivisionId == type
        })
        roleData.push(...filtered)
      }
    }

    resData = Array.from(new Set(roleData));// 去重
    console.log('筛选后的数据', resData)

    // 将数据按垃圾落地先排序，默认升序排序
    resData.sort((a, b) => {
      let a_time = a.NumberStatistic!.CurrentGarbageTime! >> 0;
      let b_time = b.NumberStatistic!.CurrentGarbageTime! >> 0;
      return (a_time - b_time)
    })
    resData.reverse();// 降序



    // 数据筛选后，切割数据
    let data: GarbageStationViewModel[] = [];
    data = resData.slice((index - 1) * size, index * size)


    let PageIndex = index;
    let PageSize = size;
    let PageCount = Math.ceil(resData.length / size)
    let RecordCount = data.length
    let TotalRecordCount = resData.length


    let page: Page = {
      PageIndex,
      PageSize,
      PageCount,
      RecordCount,
      TotalRecordCount
    }
    let res: PagedList<GarbageStationViewModel> = {
      Page: page,
      Data: data
    }
    console.log(res)
    return res;
  }
  bindEvents() {
    console.log('bind event');
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



    this.elements.others.originImg.addEventListener('click', function (e) {

      let path = ((e.composedPath && e.composedPath()) || e.path) as HTMLElement[];
      if (path) {
        for (let i = 0; i < path.length; i++) {
          // if (path[i].className == "video-control") {
          //   this.onPlayControlClicked(element.imageUrls![this.swiper!.activeIndex], path[i] as HTMLDivElement);
          //   return;
          // }
          if (path[i].className == "tools") {
            e.stopPropagation();
            return;
          }
        }
      }


      _this.activeIndex = _this.swiper!.activeIndex;
      if (_this.activeElement!.swiper) {
        _this.activeElement!.swiper.slideTo(_this.activeIndex, 0)
      } else {
        (_this.activeElement!.Element!.querySelector(`.swiper-slide:nth-of-type(${_this.activeIndex + 1})`) as HTMLElement).scrollIntoView({
          block: 'nearest',
          behavior: 'auto',
          inline: 'nearest'
        });
      }

      $(this).fadeOut();
      _this.originStatus = false;

    })
  }

  // 创建居委会banner
  createFooter(id: string, divisionId: string) {
    let p = this.dataController.getDivision(divisionId);
    p.then(division => {
      let info = document.getElementById(id) as HTMLDivElement;

      let content_footer = info.querySelector('.content__footer .division-name') as HTMLDivElement;
      content_footer.innerHTML = division.Name;
    });
  }
  toggle() {
    this.showAside = !this.showAside;
  }
  createAside() {
    let type = this.type + 1 > 3 ? 3 : this.type + 1;

    this.myAside = null;
    this.myAside = new MyAside(this.elements.container.asideContainer, [
      {
        title: '状态',
        data: [
          {
            Name: Language.StationState(StationState.Normal),
            Id: StationState.Normal.toString()
          },
          {
            Name: Language.StationState(StationState.Full),
            Id: StationState.Full.toString()
          },
          {
            Name: Language.StationState(StationState.Error),
            Id: StationState.Error.toString()
          },
          {
            Name: this.garbageDropTitle,
            Id: this.garbageDropState
          }

        ],
        type: 'state',
        shrink: false,
        mode: SelectionMode.multiple
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

          //剔除 垃圾落地 筛选项
          let arr = val.filter(item => {
            return item !== '3'
          })

          if (arr.length && !arr.includes(v.state.value + "")) {
            v.Element.style.display = 'none';
          }

          if (val.includes('3')) {
            if (v.currentGarbageTime <= 0) {
              v.Element.style.display = 'none';
            }
          }
        }
      }

    }

    if (this.zoomStatus == ZoomStatus.out) {

      // this.zoomOut();
    }
    else if (this.zoomStatus == ZoomStatus.in) {

      // this.zoomIn();
    }
  }
  filerContent() {
    let str = this.elements.btns.searchInput.value;
    for (let [k, v] of this.garbageElements) {
      let div = v.Element;
      // console.log(div)
      if (str && !div.textContent!.includes(str)) {
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
      (Array.from(contentCard.querySelectorAll('.content__img')) as HTMLElement[]).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });

      (Array.from(contentCard.querySelectorAll('.swiper-slide')) as HTMLElement[]).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });
      (Array.from(contentCard.querySelectorAll('.content__title__badage')) as HTMLElement[]).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in);
      });
      (Array.from(contentCard.querySelectorAll('.content__footer')) as HTMLElement[]).forEach((element: HTMLElement) => {
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
      let inited = false;
      this.swiper = new Swiper(this.elements.others.originImg, {
        virtual: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        on: {
          init: (swiper: Swiper) => {

            if (this.video) {
              this.video.destory();
              this.video = undefined;
            }

            setTimeout(() => {
              inited = true;
              let btn = swiper.el.querySelector('.swiper-slide-active .video-control') as HTMLDivElement;
              btn.addEventListener("click", (e) => {
                this.onPlayControlClicked(element.imageUrls[swiper.activeIndex], btn);
                e.stopPropagation();
              });
            }, 100);
          },
          click: (swiper: Swiper, e) => {

          },
          slideChange: (swiper: Swiper) => {
            if (inited == false) return;

            if (this.video) {
              this.video.destory();
              this.video = undefined;
            }


            setTimeout(() => {
              let btn = swiper.el.querySelector('.swiper-slide-active .video-control') as HTMLDivElement;
              btn.addEventListener("click", (e) => {
                this.onPlayControlClicked(element.imageUrls[swiper.activeIndex], btn);
                e.stopPropagation();
              });
            }, 100);

            // btn.addEventListener("click", (e)=>{
            //   debugger;
            //   e.stopPropagation();
            // })
          }
        }
      });
    }
    this.swiper.virtual.removeAllSlides()
    this.swiper.virtual.cache = [];
    for (let i = 0; i < imgs.length; i++) {

      let container = this.createSwiperContainer(imgs[i])

      this.swiper.virtual.appendSlide(container.outerHTML);

      // this.swiper.virtual.appendSlide('<div class="swiper-zoom-container">' +
      //   '<div><a onclick="return false"><i class="howell-icon-real-play"></i></a></div>'
      //   + '<img src="' + url +
      //   '" /></div>');
    }
    this.swiper.slideTo(info.index, 0);

  }

  video?: VideoPlugin;
  tools?: PlayerTools;

  onPlayControlClicked(index: IImageUrl, div: HTMLDivElement) {
    if (this.video) {
      this.video.destory();
      this.video = undefined;
    }
    let img = div.data as IImageUrl;
    if (!img) {
      img = index;
    }
    if (img.preview) {
      img.preview.then(x => {
        this.video = new VideoPlugin(img.cameraName!, x.Url, x.WebUrl);
        this.video.onFullscreenChanged = (is) => {
          let pagination = document.querySelector(".swiper-pagination.swiper-pagination-fraction") as HTMLDivElement;
          if (!pagination) return;

          if (is) {
            pagination.style.display = "none"
          }
          else {
            pagination.style.display = "";
          }
        }
        if (this.video.iframe) {
          this.video.autoSize();

        }
        if (div.parentElement) {
          this.video.loadElement(div.parentElement, 'live');
        }
      })
    }
  }


  createSwiperContainer(imageUrl: IImageUrl) {
    let container = document.createElement("div");
    container.className = "swiper-zoom-container";

    let img = document.createElement("img");
    img.src = this.dataController.getImageUrl(imageUrl.url)!;
    container.appendChild(img);

    let control = document.createElement("div");
    control.className = "video-control";
    control.style.marginTop = "-5%";
    control.data = imageUrl;
    // let icon = document.createElement("i");
    // icon.className = "howell-icon-real-play"
    // control.appendChild(icon);

    container.appendChild(control);

    return container;
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


