import { dateFormat, getAllDay } from '../../common/tool'
import { OneDay, Paged } from './data-controllers/IController'
import IAside from './IAside'
import MyTemplate, { GarbageDropData } from './myTemplate'

import echartDetailAsideTemplate from '../garbagestation/garbage-station-echartDetailAside.html'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../data-core/model/waste-regulation/event-record'
import { Page } from '../../data-core/model/page'
import { Language } from './language'
import { NavigationWindow } from '.'

import '../css/myChartDetailAside.less'
import { IGarbageStationController } from './data-controllers/modules/IController/IGarbageStationController'

export default class EchartsDetailAside extends IAside {
  day!: OneDay

  private _id: string = ''
  get id() {
    return this._id
  }
  set id(val) {
    this._id = val
  }

  private _type?: EventType

  get type() {
    return this._type
  }
  set type(val) {
    this._type = val
    let txtContent = ''
    if (this.elements.desc) {
      switch (val) {
        case undefined:
          txtContent = '垃圾滞留'
          break
        case EventType.IllegalDrop:
          txtContent = '垃圾落地'
          break
        case EventType.MixedInto:
          txtContent = '混合投放'
          break
        default:
          txtContent = ''
      }
      this.elements.desc.textContent = txtContent
    }
  }

  private _date!: Date
  get date() {
    return this._date
  }
  set date(val) {
    this._date = val
    this.day = getAllDay(val)
    if (this.elements?.date) {
    }
    this.elements.date.textContent = dateFormat(val, 'yyyy-MM-dd')
  }
  outterContainer: HTMLElement
  innerContainer: HTMLDivElement = document.createElement('div')
  template = echartDetailAsideTemplate
  elements!: {
    [key: string]: HTMLElement
  }
  dropListTotal: Array<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | GarbageDropEventRecord
  > = [] // 拉取到的所有数据
  dropListChunk: Array<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | GarbageDropEventRecord
  > = [] // 每次拉取到的数据
  dropPage: Page | null = null
  parsedDropListTotal: Array<GarbageDropData> = []
  parsedDropListChunk: Array<GarbageDropData> = []
  myTemplate!: MyTemplate

  currentPage: Paged = {
    index: 1,
    size: 20,
  }

  eventType?: EventType = void 0 // 筛选状态

  constructor(
    selector: HTMLElement | string,
    private dataController: IGarbageStationController
  ) {
    super()
    this.outterContainer =
      typeof selector == 'string'
        ? (document.querySelector(selector) as HTMLElement)
        : selector

    this.innerContainer.classList.add('echartdetail-inner-container')
    this.innerContainer.innerHTML = this.template

    this.outterContainer.innerHTML = ''
    this.outterContainer.appendChild(this.innerContainer)

    this.elements = {
      count: this.innerContainer.querySelector('#count') as HTMLDivElement,
      date: this.innerContainer.querySelector('#date') as HTMLDivElement,
      desc: this.innerContainer.querySelector('#desc') as HTMLDivElement,
      contentContainer: this.innerContainer.querySelector(
        '.card-container'
      ) as HTMLDivElement,
      innerBack: this.innerContainer.querySelector(
        '.inner-back'
      ) as HTMLDivElement,
      showDatePicker: this.innerContainer.querySelector(
        '#showDatePicker'
      ) as HTMLDivElement,
    }
    this.myTemplate = new MyTemplate()
  }
  init() {
    this.bindEvents()
  }
  bindEvents() {
    if (this.elements.innerBack) {
      this.elements.innerBack.addEventListener('click', () => {
        this.notify({
          showDetail: false,
        })
        this.reset()
      })
    }

    // if (this.elements.showDatePicker) {
    //   this.elements.showDatePicker.addEventListener('click', () => {
    //     // this.showDatePicker()
    //   })
    // }

    ;(this.elements.contentContainer as any).addEventListener(
      'click-card',
      (e: CustomEvent) => {
        const user = (window.parent as NavigationWindow).User
        let openId = user.WUser.OpenId
        // console.log(openId)
        // console.log(e)
        let index = e.detail.index
        let eventId = e.detail.eventId
        let eventType = e.detail.eventType

        const url = `./event-details.html?openid=${openId}&eventtype=${eventType}&eventId=${eventId}`
        // const url = './event-details.html?openid=o5th-6js1-VRO7d1j7Jy9nkGZocg&pageindex=0&eventtype=0'
        console.log(url)
        window.parent.showOrHideAside(url)
      }
    )
  }
  async render() {
    await this.loadData()
    if (
      this.type == EventType.IllegalDrop ||
      this.type == EventType.MixedInto
    ) {
      this.myTemplate.bindTo(
        '.echartdetail-inner-container #HistoryDropTemplate'
      )
    } else if (this.type == undefined) {
      this.myTemplate.bindTo(
        '.echartdetail-inner-container #GarbageDropTemplate'
      )
    }
    this.createContent()
  }
  private async loadData() {
    let data = await this.dataController.GetEventRecordByGarbageStation(
      this.id,
      this.currentPage,
      this.type,
      this.day
    )

    this.dropListChunk = data!.Data
    this.dropListTotal = [...this.dropListTotal, ...this.dropListChunk]

    this.dropPage = data!.Page

    console.log(data)
    console.log('本次请求的数据', this.dropListChunk)

    if (window.parent) {
      ;(window.parent as NavigationWindow).Day = getAllDay(this.date)
      ;(window.parent as NavigationWindow).RecordPage = {
        index: data!.Page.PageIndex,
        size: data!.Page.PageSize,
        count: data!.Page.TotalRecordCount,
      }
    }
  }
  createContent() {
    this.parseData()
    console.log('解析后的本次数据', this.parsedDropListChunk)
    console.log('解析后的所有数据', this.parsedDropListTotal)

    console.log('dropListTotal', this.dropListTotal)

    this.elements.contentContainer.innerHTML = ''

    // 使用css切换不同的模板
    let templateId: string = ''
    if (
      this.type == EventType.IllegalDrop ||
      this.type == EventType.MixedInto
    ) {
      templateId = 'HistoryDropTemplate'
    } else {
      templateId = 'GarbageDropTemplate'
    }
    let div = document.createElement('div')
    div.id = templateId

    this.elements.contentContainer.appendChild(div)

    this.myTemplate.dataTotal = this.parsedDropListTotal

    // 剪切 fragment 的子节点，导致fragment.childNode = []
    div.appendChild(this.myTemplate.fragment)

    this.elements.count.textContent =
      this.dropListTotal.length + '/' + this.dropPage!.TotalRecordCount
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

      let imageUrls: string[] = []
      if (v.ImageUrl) imageUrls.push(v.ImageUrl)

      if ('DropImageUrls' in v.Data) {
        v.Data.DropImageUrls &&
          imageUrls.push(...v.Data.DropImageUrls.map((item) => item.ImageUrl))
        v.Data.HandleImageUrls &&
          imageUrls.push(...v.Data.HandleImageUrls.map((item) => item.ImageUrl))
        v.Data.TimeoutImageUrls &&
          imageUrls.push(
            ...v.Data.TimeoutImageUrls.map((item) => item.ImageUrl)
          )
      }

      obj.StationName = v.Data.StationName
      obj.StationId = v.Data.StationId

      obj.DivisionName = v.Data.DivisionName!
      obj.DivisionId = v.Data.DivisionId!
      if (
        this.type == EventType.IllegalDrop ||
        this.type == EventType.MixedInto
      ) {
        obj.EventTime = v.EventTime ? v.EventTime.format('HH:mm:ss') : ''
      } else {
        obj.EventTime = v.EventTime
          ? v.EventTime.format('yyyy-MM-dd HH:mm:ss')
          : ''
      }

      obj.imageUrls = imageUrls.map((url) => {
        return this.dataController.getImageUrl(url) as string
      })
      this.parsedDropListChunk.push(obj)
    }
    this.parsedDropListTotal = [
      ...this.parsedDropListTotal,
      ...this.parsedDropListChunk,
    ]
  }

  reset() {
    console.log('reset调用')
    // this.eventType = void 0;
    // this.roleTypes = [];
    this.dropPage = null
    // this.currentPage.index = 1;
    this.elements.contentContainer.innerHTML = ''
    this.parsedDropListTotal = []
    this.dropListTotal = []
    // this.miniRefresh!.resetUpLoading();// 会触发一次miniRefreshUp
  }

  notify(args: any) {
    this.observerList.forEach((observer) => {
      observer.update(args)
    })
  }
}
