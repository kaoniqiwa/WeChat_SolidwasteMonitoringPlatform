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
}
export default class GarbageDrop implements IObserver {
  private _date: Date;

  dropListTotal: GarbageDropEventRecord[] = [];// 拉取到的所有数据
  dropListChunk: GarbageDropEventRecord[] = []; // 每次拉取到的数据
  dropPage: Page = null;
  parsedDropListTotal: Array<GarbageDropData> = [];
  parsedDropListChunk: Array<GarbageDropData> = [];
  appendType: string = 'chunk';
  eventType: EventType = void 0;//EventType.GarbageDropHandle;
  roleTypes: Array<string> = [];
  // refreshed = false;
  roleList: ResourceRole[];

  miniRefresh: MiniRefresh;

  myAside: MyAside;

  currentPage: Paged = {
    index: 1,
    size: 20,
  }

  get date() {
    return this._date
  }
  set date(val) {
    if (this.date) {
      console.log(dateFormat(val, 'yyyy-MM-dd'));
      console.log(dateFormat(this.date, 'yyyy-MM-dd'));
      if (dateFormat(val, 'yyyy-MM-dd') == dateFormat(this.date, 'yyyy-MM-dd')) return
    }

    this._date = val;

    this.elements.date.innerHTML = dateFormat(val, "yyyy年MM月dd日");

    console.log('change date')

    this.reset();

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

  elements = {
    date: document.querySelector('#date') as HTMLDivElement,
    count: document.querySelector('#count') as HTMLDivElement,
    contentContainer: document.querySelector('.card-container'),
    template: document.querySelector('template') as HTMLTemplateElement,
    filterBtn: document.querySelector('#filter') as HTMLDivElement,
    asideContainer: document.querySelector('#aside-container') as HTMLElement,
  }
  constructor(private dataController: IGarbageDrop, private openId: string, private type: ResourceType, private myTemplate: MyTemplate) {


    this.elements.contentContainer.innerHTML = '';


    this.miniRefresh = new MiniRefresh({
      container: "#miniRefresh",
      down: {
        callback: () => {


          this.miniRefreshDown();
        }
      },
      up: {
        isAuto: false,
        callback: () => {
          console.log('refresh up');

          this.miniRefreshUp()
        }
      }
    })

    this.date = new Date();
    this.bindEvents();

  }
  // 观察者模式接受通知
  update(args: { type: string, [key: string]: any }) {
    console.log('通知:', args)
    if (args) {
      if ('type' in args) {
        if (args.type == 'weui-datePicker') {
          this.date = args.value;
        }
        if (args.type == 'my-aside') {
          if ('show' in args) {
            this.show = args.show;
          }
          if ('filtered' in args) {
            console.log('filtered', args.filtered)
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

            this.reset();
          }
        }
      }

    }
  }

  bindEvents() {
    console.log('bind event')
    let _this = this;
    this.elements.filterBtn.addEventListener('click', () => {
      console.log('clicked');
      this.toggle()
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

  async miniRefreshDown() {
    this.reset();
    await this.loadData();
    this.createContent();
    this.miniRefresh.endDownLoading();
  }
  async miniRefreshUp() {
    let stop = false;

    console.log('drop page', this.dropPage)
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
      if (!this.myAside) {
        console.log('create aside');
        this.createAside()
      }
    }
    console.log('stop', stop);
    this.miniRefresh.endUpLoading(stop);
  }
  reset() {
    console.log('reset')
    this.dropPage = null;
    this.currentPage.index = 1;
    this.elements.contentContainer.innerHTML = '';
    this.parsedDropListTotal = [];
    this.dropListTotal = [];
    this.miniRefresh.resetUpLoading();
  }
  async loadData() {
    const day = getAllDay(this.date);
    console.log('current-page', this.currentPage);
    console.log('event-type', this.eventType)

    this.roleList = await this.dataController.getResourceRoleList();
    console.log('侧边栏筛选数据', this.roleList)

    let data = await this.dataController.getGarbageDropEventList(day, this.currentPage, this.eventType, this.roleTypes);
    this.dropListTotal = [...this.dropListTotal, ...data.Data]
    this.dropListChunk = data.Data;
    this.dropPage = data.Page;
    console.log('本次请求的数据', this.dropListChunk)
    console.log('本次请求的页面信息', this.dropPage);
    console.log('至今请求到的所有数据', this.dropListTotal)

  }
  parseData() {
    let data = this.dropListChunk;
    this.parsedDropListChunk = [];

    for (let v of data) {
      let obj: GarbageDropData = Object.create(null, {});
      obj.EventId = v.EventId;
      obj.EventType = v.EventType;
      obj.EventName = Language.EventTypeFilter(v.EventType);

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
      }
      this.parsedDropListChunk.push(obj)
    }
    this.parsedDropListTotal = [...this.parsedDropListTotal, ...this.parsedDropListChunk];
  }
  createAside() {
    this.myAside = null;
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
        title: Language.ResourceType(this.type),
        data: this.roleList,
        type: "role",
        mode: SelectionMode.multiple
      },

    ]).init()

    this.myAside.add(this)
  }
}