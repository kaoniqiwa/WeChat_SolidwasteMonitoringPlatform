import { dateFormat, getAllDay } from "../../common/tool";
import { Page, PagedList } from "../../data-core/model/page";
import { CameraImageUrl, GarbageDropEventRecord } from "../../data-core/model/waste-regulation/event-record";
import { IGarbageDrop, Paged } from "./data-controllers/IController";
import IObserver from "./IObserver";

import MyTemplate from "./myTemplate";
import { EventType } from "../../data-core/model/waste-regulation/event-number";

import $ from 'jquery';
import MyAside, { SelectionMode } from "./myAside";
import { Language } from "./language";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import { NavigationWindow } from ".";


export interface GarbageDropData {
  EventType?: EventType;
  EventName?: string;
  imageUrls?: string[];
  StationName?: string;
  StationId?: string;
  DivisionName?: string;
  DivisionId?: string;
  EventTime?: string | Date;
  EventId?: string;
  index?: number
}
export default class GarbageDrop implements IObserver {

  elements: { [key: string]: HTMLElement };// 页面html元素收集器

  dropListTotal: GarbageDropEventRecord[] = [];// 拉取到的所有数据
  dropListChunk: GarbageDropEventRecord[] = []; // 每次拉取到的数据
  dropPage: Page = null;
  parsedDropListTotal: Array<GarbageDropData> = [];
  parsedDropListChunk: Array<GarbageDropData> = [];
  appendType: string = 'chunk';

  eventType: EventType = void 0;// 筛选状态
  roleTypes: Array<string> = []; // 筛选区域
  roleList: ResourceRole[] = [];// 侧边栏数据

  miniRefresh: MiniRefresh;

  myAside: MyAside;

  currentPage: Paged = {
    index: 1,
    size: 20,
  }

  private _date: Date;
  get date() {
    return this._date
  }
  set date(val) {
    if (this.date) {
      // 重复选择当前日期，则直接返回
      console.log(dateFormat(val, 'yyyy-MM-dd'));
      console.log(dateFormat(this.date, 'yyyy-MM-dd'));
      if (dateFormat(val, 'yyyy-MM-dd') == dateFormat(this.date, 'yyyy-MM-dd')) return
    }

    this._date = val;

    this.elements.date.innerHTML = dateFormat(val, "yyyy年MM月dd日");

    console.log('change date')

  }


  _show = false;
  get show() {
    return this._show
  }
  set show(val) {
    this._show = val;
    if (val) {
      if (this.myAside) {
        $(this.elements.asideContainer).show();
        setTimeout(() => {
          this.myAside?.slideIn()
        }, 1e2);
      }

    }
    else {
      setTimeout(() => {
        $(this.elements.asideContainer).hide();
      }, 3e2);
    }

  }


  update(args: { type: string, [key: string]: any }) {
    console.log('通知:', args)
    if (args) {
      if ('type' in args) {
        if (args.type == 'weui-datePicker') {
          this.date = args.value;
          this.reset();
          this.createAside();
          this.miniRefresh.resetUpLoading()
        }
        if (args.type == 'my-aside') {
          if ('show' in args) {
            this.show = args.show;
          }
          if ('filtered' in args) {
            console.log('filtered', args.filtered);
            this.reset();

            let data: Map<string, Array<string>> = new Map();

            let filtered = args.filtered as Map<string, Set<HTMLElement>>;
            for (let [k, v] of filtered) {
              let ids = [...v].map(element => element.getAttribute('id'));
              data.set(k, ids);
            }
            console.log('maped', data)
            if (data.has('role')) {
              this.roleTypes = data.get('role');

            }
            if (data.has('state')) {
              this.eventType = Number(data.get('state')[0]);
            }
            this.miniRefreshUp()

          }
        }
      }

    }
  }

  // 构造函数只负责初始化
  constructor(private dataController: IGarbageDrop, private openId: string, private type: ResourceType, private myTemplate: MyTemplate) {

    this.elements = {
      date: document.querySelector('#date') as HTMLDivElement,
      count: document.querySelector('#count') as HTMLDivElement,
      contentContainer: document.querySelector('.card-container'),
      template: document.querySelector('template') as HTMLTemplateElement,
      filterBtn: document.querySelector('#filter') as HTMLDivElement,
      asideContainer: document.querySelector('#aside-container') as HTMLElement,
    }
    // 触发 set date()
    this.date = new Date();


  }
  // 数据请求放入其他方法中
  init() {
    this.elements.contentContainer.innerHTML = '';

    this.miniRefresh = new MiniRefresh({
      container: "#miniRefresh",
      down: {
        callback: () => {
          console.log('refresh down');
          this.miniRefreshDown();
        }
      },
      up: {
        isAuto: true,// 自动触发callback回调
        callback: () => {
          console.log('refresh up');
          this.miniRefreshUp()
        }
      }
    })



    this.loadAsideData().then(() => {
      this.createAside()
    })

    this.bindEvents();
  }


  bindEvents() {
    console.log('bind event')
    let _this = this;
    this.elements.filterBtn.addEventListener('click', () => {
      console.log('clicked');
      this.toggle()
    })
    this.elements.contentContainer.addEventListener('click-card', (e: CustomEvent) => {
      console.log(e)
      let index = e.detail.index;
      const url = `./event-details.html?openid=o5th-6js1-VRO7d1j7Jy9nkGZocg&pageindex=${index}&eventtype=${this.eventType ?? 0}`
      console.log(url)
      window.parent.showOrHideAside(url);

    })
  }
  toggle() {
    this.show = !this.show;
  }
  createContent() {
    this.parseData();
    console.log('解析后的本次数据', this.parsedDropListChunk)
    console.log('解析后的所有数据', this.parsedDropListTotal)

    if (this.appendType == 'chunk') {
      this.myTemplate.dataChunk = this.parsedDropListChunk;
    } else if (this.appendType == 'total') {
      this.elements.contentContainer.innerHTML = '';
      this.myTemplate.dataTotal = this.parsedDropListTotal;
    }

    // 剪切 fragment 的子节点，导致fragment.childNode = []
    this.elements.contentContainer.appendChild(this.myTemplate.fragment);


    this.elements.count.textContent = this.dropListTotal.length + "/" + this.dropPage.TotalRecordCount;
  }

  /**
   *  下拉后重置状态，重新请求数据，重新创建页面
   */
  async miniRefreshDown() {
    this.reset();
    await this.loadData();
    this.createContent();
    this.createAside()
    this.miniRefresh.endDownLoading();
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
      await this.loadData();
      this.createContent();
    }
    console.log('stop', stop);
    this.miniRefresh.endUpLoading(stop);
  }
  /**
   *  切换日期/更改筛选条件/下拉 需要重置数据
   */
  reset() {
    console.log('reset called')
    this.eventType = void 0;
    this.roleTypes = []
    this.dropPage = null;
    this.currentPage.index = 1;
    this.elements.contentContainer.innerHTML = '';
    this.parsedDropListTotal = [];
    this.dropListTotal = [];
  }
  async loadData() {
    const day = getAllDay(this.date);
    console.log('current-page', this.currentPage);
    console.log('event-type', this.eventType)

    let data = await this.dataController.getGarbageDropEventList(day, this.currentPage, this.eventType, this.roleTypes);
    this.dropListTotal = [...this.dropListTotal, ...data.Data]
    this.dropListChunk = data.Data;
    this.dropPage = data.Page;
    console.log('本次请求的数据', this.dropListChunk)
    console.log('本次请求的页面信息', this.dropPage);
    console.log('至今请求到的所有数据', this.dropListTotal)


    if (window.parent) {
      (window.parent as NavigationWindow).Day = getAllDay(this.date);
      (window.parent as NavigationWindow).RecordPage = {
        index: data.Page.PageIndex,
        size: data.Page.PageSize,
        count: data.Page.TotalRecordCount

      }
    }


  }
  async loadAsideData() {
    this.roleList = await this.dataController.getResourceRoleList();
    console.log('侧边栏筛选数据', this.roleList)
  }
  parseData() {
    let data = this.dropListChunk;
    this.parsedDropListChunk = [];

    for (let i = 0; i < data.length; i++) {
      let v = data[i];
      let obj: GarbageDropData = Object.create(null, {});
      obj.EventId = v.EventId;
      obj.EventType = v.EventType;
      obj.EventName = Language.EventTypeFilter(v.EventType);
      obj.index = (this.dropPage.PageIndex - 1) * this.dropPage.PageSize + i

      let imageUrls = [];
      if (v.Data) {
        if (!v.Data.IsHandle && !v.Data.IsTimeout) {
          imageUrls = v.Data.DropImageUrls
        } else if (v.Data.IsHandle && !v.Data.IsTimeout) {
          imageUrls = v.Data.HandleImageUrls;
        } else if (!v.Data.IsHandle && v.Data.IsTimeout) {
          imageUrls = v.Data.TimeoutImageUrls
        }
        obj.StationName = v.Data.StationName;
        obj.StationId = v.Data.StationId;

        obj.DivisionName = v.Data.DivisionName;
        obj.DivisionId = v.Data.DivisionId;

        obj.EventTime = v.EventTime;
        obj.imageUrls = imageUrls.map(url => {
          return this.dataController.getImageUrl(url.ImageUrl)
        })
        // console.log(imageUrls, obj.imageUrls)
      }
      this.parsedDropListChunk.push(obj)
    }
    this.parsedDropListTotal = [...this.parsedDropListTotal, ...this.parsedDropListChunk];
  }
  createAside() {
    this.myAside = null;
    let type = this.type + 1 > 3 ? 3 : this.type + 1;
    this.myAside = new MyAside(this.elements.asideContainer, [
      {
        title: '状态',
        data: [
          {
            Name: Language.EventTypeFilter(EventType.GarbageDrop),
            Id: EventType.GarbageDrop
          },
          {
            Name: Language.EventTypeFilter(EventType.GarbageDropTimeout),
            Id: EventType.GarbageDropTimeout
          },
          {
            Name: Language.EventTypeFilter(EventType.GarbageDropHandle),
            Id: EventType.GarbageDropHandle
          },

        ],
        type: 'state',
        shrink: false,
        // mode: SelectionMode.single
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
}