/**
        
*　　┏┓　　　┏┓+ +
*　┏┛┻━━━┛┻┓ + +
*　┃　　　　　　　┃ 　
*　┃　　　━　　　┃ ++ + + +
*  |  ████━████┃+
*　┃　　　　　　　┃ +
*　┃　　　┻　　　┃
*　┃　　　　　　　┃ + +
*　┗━┓　　　┏━┛
*　　　┃　　　┃　　　　　　　　　　　
*　　　┃　　　┃ + + + +
*　　　┃　　　┃
*　　　┃　　　┃ +  神兽保佑
*　　　┃　　　┃    代码无bug　　
*　　　┃　　　┃　　+　　　　　　　　　
*　　　┃　 　　┗━━━┓ + +
*　　　┃ 　　　　　　　┣┓
*　　　┃ 　　　　　　　┏┛
*　　　┗┓┓┏━┳┓┏┛ + + + +
*　　　　┃┫┫　┃┫┫
*　　　　┗┻┛　┗┻┛+ + + +
   pppmmmxxx
*/
import { dateFormat, getAllDay } from '../../common/tool'
import { Page, PagedList } from '../../data-core/model/page'
import {
  CameraImageUrl,
  GarbageDropEventRecord,
} from '../../data-core/model/waste-regulation/event-record'
import { Paged } from './data-controllers/IController'
import IObserver from './IObserver'

import MyTemplate, { GarbageDropData } from './myTemplate'
import { EventType } from '../../data-core/model/waste-regulation/event-number'

import $ from 'jquery'
import MyAside, { SelectionMode } from './myAside'
import { Language } from './language'
import { ResourceRole, ResourceType } from '../../data-core/model/we-chat'
import { NavigationWindow } from '.'

import weui from 'weui.js/dist/weui.js'
import 'weui'
import { IGarbageDrop } from './data-controllers/modules/IController/IGarbageDrop'
export default class GarbageDrop implements IObserver {
  elements: { [key: string]: HTMLElement } // 页面html元素收集器

  dropListTotal: GarbageDropEventRecord[] = [] // 拉取到的所有数据
  dropListChunk: GarbageDropEventRecord[] = [] // 每次拉取到的数据
  dropPage: Page | null = null
  parsedDropListTotal: Array<GarbageDropData> = []
  parsedDropListChunk: Array<GarbageDropData> = []
  appendType: string = 'chunk'

  eventType: EventType = EventType.GarbageDropAll // 筛选状态
  roleTypes: Array<string> = [] // 筛选区域
  roleList: ResourceRole[] = [] // 侧边栏数据

  miniRefresh?: MiniRefresh

  myAside: MyAside | null = null

  currentPage: Paged = {
    index: 1,
    size: 20,
  }

  private _date: Date = new Date()
  get date() {
    return this._date as Date
  }
  set date(val) {
    if (this.date) {
      // 重复选择当前日期，则直接返回
      // console.log(dateFormat(val, 'yyyy-MM-dd'));
      // console.log(dateFormat(this.date, 'yyyy-MM-dd'));
      if (dateFormat(val, 'yyyy-MM-dd') == dateFormat(this.date, 'yyyy-MM-dd'))
        return
    }

    this._date = val

    this.elements.date.innerHTML = dateFormat(val, 'yyyy年MM月dd日')

    // console.log('change date')
  }

  _showAside = false
  get showAside() {
    return this._showAside
  }
  set showAside(val) {
    this._showAside = val
    if (val) {
      if (this.myAside) {
        $(this.elements.asideContainer).show()
        setTimeout(() => {
          this.myAside?.slideIn()
        }, 1e2)
      }
    } else {
      setTimeout(() => {
        $(this.elements.asideContainer).hide()
      }, 3e2)
    }
  }

  update(args: { type: string;[key: string]: any }) {
    console.log('通知:', args)
    if (args) {
      if ('type' in args) {
        // if (args.type == 'weui-datePicker') {
        //   this.date = args.value;
        //   this.reset();
        //   this.createAside();
        //   this.miniRefresh!.resetUpLoading()
        // }
        if (args.type == 'my-aside') {
          if ('show' in args) {
            this.showAside = args.show
          }
          if ('filtered' in args) {
            // console.log('filtered', args.filtered);
            this.reset()

            let data: Map<string, Array<string>> = new Map()

            let filtered = args.filtered as Map<string, Set<HTMLElement>>
            for (let [k, v] of filtered) {
              let ids = [...v].map(
                (element) => element.getAttribute('id') || ''
              )
              data.set(k, ids)
            }
            // console.log('maped', data)
            if (data.has('role')) {
              this.roleTypes = data.get('role')!
            }
            if (data.has('state')) {
              this.eventType = Number(data.get('state')![0] ?? 0)
            }
          }
        }
      }
    }
  }

  // 构造函数只负责初始化
  constructor(
    private dataController: IGarbageDrop,
    private openId: string | null,
    private type: ResourceType,
    private myTemplate: MyTemplate
  ) {
    this.elements = {
      date: document.querySelector('#date') as HTMLDivElement,
      count: document.querySelector('#count') as HTMLDivElement,
      contentContainer: document.querySelector(
        '.card-container'
      ) as HTMLDivElement,
      template: document.querySelector('template') as HTMLTemplateElement,
      filterBtn: document.querySelector('#filter') as HTMLDivElement,
      showDatePicker: document.querySelector(
        '#showDatePicker'
      ) as HTMLDivElement,
      asideContainer: document.querySelector('#aside-container') as HTMLElement,
    }
    this.miniRefresh = new MiniRefresh({
      container: '#miniRefresh',
      down: {
        callback: () => {
          console.log('miniRefreshDown')
          this.miniRefreshDown()
        },
      },
      up: {
        isAuto: true, // 自动触发callback回调
        callback: () => {
          console.log('miniRefreshUp')
          this.miniRefreshUp()
        },
      },
    })
    this.elements.contentContainer.innerHTML = ''
    this.elements.date.innerHTML = dateFormat(this.date, 'yyyy年MM月dd日')
  }

  init() {
    this.loadAsideData().then(() => {
      this.createAside()
    })

    this.bindEvents()
  }

  bindEvents() {
    window.addEventListener('message', function (e) {
      if (e && e.data) {
        try {
          let data = JSON.parse(e.data)
          let div = document.getElementById(data.eventId) as HTMLElement
          let processor = div.querySelector('.processor') as HTMLElement
          processor.innerHTML = data.processor
        } catch (error) { }
      }
    })

    this.elements.showDatePicker.addEventListener('click', () => {
      this.showDatePicker()
    })
    this.elements.filterBtn.addEventListener('click', () => {
      this.toggle()
    })
      ; (this.elements.contentContainer as any).addEventListener(
        'click-card',
        (e: CustomEvent) => {
          // console.log(e)
          let str_filter = ''

          if (this.roleTypes && this.roleTypes.length > 0) {
            let filter = { sourceIds: this.roleTypes }

            str_filter = '&filter=' + base64encode(JSON.stringify(filter))
          }

          let index = e.detail.index

          const url = `./event-details.html?openid=${this.openId
            }&pageindex=${index}&eventtype=${this.eventType ?? ''}${str_filter}`
          console.log(url)
          window.parent.showOrHideAside(url)
        }
      )
  }
  showDatePicker() {
    weui.datePicker({
      start: new Date(2020, 12 - 1, 1),
      end: new Date(),
      onChange: (result: any) => { },
      onConfirm: (result: any) => {
        let date = new Date(
          result[0].value,
          result[1].value - 1,
          result[2].value
        )
        this.date = date

        this.reset()
        this.createAside()
      },
      title: '请选择日期',
    })
  }
  toggle() {
    this.showAside = !this.showAside
  }
  createContent() {
    this.parseData()
    // console.log('解析后的本次数据', this.parsedDropListChunk)
    // console.log('解析后的所有数据', this.parsedDropListTotal)

    if (this.appendType == 'chunk') {
      this.myTemplate.dataChunk = this.parsedDropListChunk
    } else if (this.appendType == 'total') {
      this.elements.contentContainer.innerHTML = ''
      this.myTemplate.dataTotal = this.parsedDropListTotal
    }

    let templateId: string = ''
    let div = document.createElement('div')
    div.id = 'GarbageDropTemplate'

    this.elements.contentContainer.appendChild(div)

    // 剪切 fragment 的子节点，导致fragment.childNode = []
    div.appendChild(this.myTemplate.fragment)

    this.elements.count.textContent =
      this.dropListTotal.length + '/' + this.dropPage!.TotalRecordCount
  }

  /**
   *  下拉后重置状态，重新请求数据，重新创建页面
   */
  async miniRefreshDown() {
    this.reset()
    await this.loadData()
    this.createContent()
    this.createAside()
    this.miniRefresh!.endDownLoading()
  }
  async miniRefreshUp() {
    let stop = false

    console.log('drop page', this.dropPage)
    // 不是第一次请求
    if (this.dropPage) {
      if (this.dropPage.PageIndex >= this.dropPage.PageCount) {
        stop = true
      } else {
        stop = false
        this.currentPage.index++
      }
    }
    if (!stop) {
      console.log('请求数据')
      await this.loadData()
      this.createContent()
    }
    console.log('stop', stop)
    this.miniRefresh!.endUpLoading(stop)
  }
  /**
   *  切换日期/更改筛选条件/下拉 需要重置数据
   */
  reset() {
    console.log('reset调用')
    this.eventType = EventType.GarbageDropAll
    this.roleTypes = []
    this.dropPage = null
    this.currentPage.index = 1
    this.elements.contentContainer.innerHTML = ''
    this.parsedDropListTotal = []
    this.dropListTotal = []
    this.miniRefresh!.resetUpLoading() // 会触发一次miniRefreshUp
  }
  async loadData() {
    const day = getAllDay(this.date)
    // console.log('current-page', this.currentPage);
    // console.log('event-type', this.eventType)

    // this.garbageStations = await this.dataController.getGarbageStationList();

    // console.log('roletypes', this.roleTypes)

    let data = await this.dataController.getGarbageDropEventList(
      day,
      this.currentPage,
      this.eventType,
      this.roleTypes
    )
    this.dropListChunk = data!.Data
    console.log(data)
    console.log('本次请求的数据', this.dropListChunk)

    this.dropListTotal = [...this.dropListTotal, ...this.dropListChunk]
    this.dropPage = data!.Page
    console.log('本次请求的数据筛选后', this.dropListChunk)
    // console.log('本次请求的页面信息', this.dropPage);
    // console.log('至今请求到的所有数据', this.dropListTotal)

    if (window.parent) {
      ; (window.parent as NavigationWindow).Day = getAllDay(this.date)
        ; (window.parent as NavigationWindow).RecordPage = {
          index: data!.Page.PageIndex,
          size: data!.Page.PageSize,
          count: data!.Page.TotalRecordCount,
        }
    }
  }
  async loadAsideData() {
    this.roleList = await this.dataController.getResourceRoleList()
    // console.log('侧边栏筛选数据', this.roleList)
  }
  parseData() {
    let data = this.dropListChunk
    this.parsedDropListChunk = []

    for (let i = 0; i < data.length; i++) {
      let v = data[i]
      let obj: GarbageDropData = Object.create(null, {})
      obj.EventId = v.EventId!
      obj.EventType = v.EventType
      obj.EventName = Language.EventTypeFilter(v.EventType)
      obj.index = (this.dropPage!.PageIndex - 1) * this.dropPage!.PageSize + i

      obj.ProcessorName = v.Data.ProcessorName ?? ''
      obj.RecordNo = v.Data.RecordNo ?? ''
      let imageUrls: CameraImageUrl[] = []
      if (v.Data) {
        v.Data.DropImageUrls && imageUrls.push(...v.Data.DropImageUrls)
        v.Data.HandleImageUrls && imageUrls.push(...v.Data.HandleImageUrls)
        v.Data.TimeoutImageUrls && imageUrls.push(...v.Data.TimeoutImageUrls)

        obj = Object.assign(obj, v.Data)
        // console.log(imageUrls)
        obj.StationName = v.Data.StationName
        obj.StationId = v.Data.StationId

        obj.DivisionName = v.Data.DivisionName!
        obj.DivisionId = v.Data.DivisionId!

        obj.EventTime = v.EventTime!.format('HH:mm:ss')
        obj.TaskTime = "0分钟"
        let takeMinutes = 0

        let time = {
          dorp: new Date(v.Data.DropTime),
          handle: v.Data.HandleTime ? new Date(v.Data.HandleTime) : undefined,
          process: v.Data.ProcessTime ? new Date(v.Data.ProcessTime) : undefined
        }
        if (v.Data.TakeMinutes) {
          takeMinutes = v.Data.TakeMinutes
        }
        else if (time.process) {
          takeMinutes = (time.process.getTime() - time.dorp.getTime()) / 1000 / 60
        }
        else if (time.handle) {
          takeMinutes = (time.handle.getTime() - time.dorp.getTime()) / 1000 / 60
        }
        else {
          takeMinutes = (new Date().getTime() - time.dorp.getTime()) / 1000 / 60
        }
        let hour = Math.floor(takeMinutes / 60)
        let minute = Math.ceil(takeMinutes % 60)

        if (hour == 0) {
          obj.TaskTime = minute + '分钟'
        } else {
          obj.TaskTime = hour + '小时' + minute + '分钟'
        }
        obj.imageUrls = imageUrls.map((url) => {
          return this.dataController.getImageUrl(url.ImageUrl) as string
        })

        // console.log(imageUrls, obj.imageUrls)
      }
      this.parsedDropListChunk.push(obj)
    }
    this.parsedDropListTotal = [
      ...this.parsedDropListTotal,
      ...this.parsedDropListChunk,
    ]
  }
  createAside() {
    let type = this.type + 1 > 3 ? 3 : this.type + 1
    this.myAside = new MyAside(this.elements.asideContainer, [
      {
        title: '状态',
        data: [
          {
            Name: Language.GarbageDropEventType(EventType.GarbageDrop),
            Id: EventType.GarbageDrop.toString(),
          },
          {
            Name: Language.GarbageDropEventType(EventType.GarbageDropTimeout),
            Id: EventType.GarbageDropTimeout.toString(),
          },
          {
            Name: Language.GarbageDropEventType(EventType.GarbageDropHandle),
            Id: EventType.GarbageDropHandle.toString(),
          },
        ],
        type: 'state',
        shrink: false,
        // mode: SelectionMode.single
      },

      {
        title: Language.ResourceType(type),
        data: this.roleList,
        type: 'role',
        mode: SelectionMode.multiple,
      },
    ]).init()

    this.myAside.add(this)
  }
}
