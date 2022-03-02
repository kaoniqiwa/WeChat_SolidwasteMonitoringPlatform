import { getQueryVariable, dateFormat, getAllDay } from '../../common/tool'

import { PagedList } from '../../data-core/model/page'
import { Service } from '../../data-core/repuest/service'
import { ResourceType } from '../../data-core/model/we-chat'
import { AsideControl } from './aside'
import { AsideListPage, AsideListPageWindow, SelectionMode } from './aside-list'
import { Language } from './language'
import {
  IEventHistory,
  IGarbageDrop,
  Paged,
} from './data-controllers/IController'
import { ControllerFactory } from './data-controllers/ControllerFactory'

import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { SwiperControl } from './data-controllers/modules/SwiperControl'
import {
  CameraImageUrl,
  EventRecord,
  GarbageDropEventRecord,
} from '../../data-core/model/waste-regulation/event-record'

import { NavigationWindow } from '.'
import { DataController } from './data-controllers/DataController'

declare var weui: any

export namespace EventHistoryPage {
  var date = new Date()
  var PageSize = 20
  var element = {
    date: document.getElementById('date')!,
    datePicker: document.getElementById('showDatePicker')!,
    aside: {
      backdrop: document.querySelector('.backdrop') as HTMLDivElement,
      iframe: document.getElementById('aside-iframe') as HTMLIFrameElement,
    },
    filterBtn: document.querySelector('#filter') as HTMLDivElement,
    totalRecordCount: document.getElementById('garbageDropTotalRecordCount')!,
    recordCount: document.getElementById('garbageDropRecordCount')!,
    GarbageDrop: {
      list: document.getElementById('garbageDrop') as HTMLDivElement,
    },
    GarbageDropHandle: {
      list: document.getElementById('garbageDropHandle') as HTMLDivElement,
    },
    GarbageDropTimeout: {
      list: document.getElementById('garbageDropTimeout') as HTMLDivElement,
    },
  }

  var MiniRefreshId = {
    GarbageDrop: 'garbageDropRefreshContainer',
    GarbageDropHandle: 'garbageDropHandleRefreshContainer',
    GarbageDropTimeout: 'garbageDropTimeoutRefreshContainer',
  }

  class Template {
    element: HTMLElement
    img: HTMLImageElement
    title: HTMLDivElement
    footer: HTMLDivElement
    remark: HTMLDivElement
    constructor() {
      this.element = document.getElementById('template') as HTMLElement
      this.img = this.element.getElementsByTagName('img')[0]
      this.title = this.element.getElementsByClassName(
        'title'
      )[0] as HTMLDivElement
      this.footer = this.element.getElementsByClassName(
        'footer-title'
      )[0] as HTMLDivElement
      this.remark = this.element.getElementsByClassName(
        'remark'
      )[0] as HTMLDivElement
      this.clear()
    }
    clear() {
      this.img.src = DataController.defaultImageUrl
      this.title.innerHTML = ''
      this.footer.innerHTML = ''
      this.remark.innerHTML = ''
    }
  }

  export class GarbageDropEvent {
    /**
     * autho:pmx
     */

    //记录所有的居委会
    asideControl: AsideControl
    asidePage?: AsideListPage

    parentElement: { [key: number]: HTMLDivElement } = {}
    miniRefresh: { [key: number]: MiniRefresh } = {}

    filter: {
      date: Date
      sourceId?: string
    }

    defaultDivisionId = ''
    constructor(
      private type: ResourceType,
      private dataController: IGarbageDrop,
      private openId: string
    ) {
      this.parentElement[EventType.GarbageDrop] = element.GarbageDrop.list
      this.parentElement[EventType.GarbageDropHandle] =
        element.GarbageDropHandle.list
      this.parentElement[EventType.GarbageDropTimeout] =
        element.GarbageDropTimeout.list

      this.filter = {
        date: new Date(),
      }

      this.asideControl = new AsideControl('aside-content')
      this.asideControl.backdrop = element.aside.backdrop
      element.filterBtn.addEventListener('click', () => {
        this.asideControl.Show()
      })
    }
    loadAside() {
      element.aside.iframe.addEventListener('load', () => {
        this.createAside(this.type)
      })
    }
    async createAside(type: ResourceType) {
      let items = await this.dataController.getResourceRoleList()

      if (element.aside.iframe.contentWindow) {
        let currentWindow = element.aside.iframe
          .contentWindow as AsideListPageWindow
        this.asidePage = currentWindow.Page
        this.asidePage.canSelected = true
        this.asidePage.selectionMode = SelectionMode.single
        this.asidePage.view({
          title: Language.ResourceType(type),
          items: items.map((x) => {
            return {
              id: x.Id,
              name: x.Name!,
            }
          }),
          footer_display: true,
        })
        this.asidePage.confirmclicked = (selecteds) => {
          let selectedIds = []
          for (let id in selecteds) {
            selectedIds.push(id)
          }
          this.confirmSelect(selectedIds)
          this.asideControl.Hide()
        }
      }
    }

    confirmSelect(selectedIds?: string[]) {
      this.selectedIds = selectedIds
      console.log('confirmSelect')
      this.clean()
      this.miniRefresh[this.eventType].resetUpLoading()
    }

    convert(
      record: GarbageDropEventRecord,
      index: number,
      getImageUrl: (id: string) => string | undefined
    ) {
      let template = new Template()
      if (record.ImageUrl) {
        template.img.src = getImageUrl(record.ImageUrl) as string
      }
      if (record instanceof GarbageDropEventRecord) {
        let urls: CameraImageUrl[]
        if (record.Data.IsHandle) {
          urls = record.Data.HandleImageUrls
        } else if (record.Data.IsTimeout) {
          urls = record.Data.TimeoutImageUrls
        } else {
          urls = record.Data.DropImageUrls
        }
        if (urls && urls.length > 0) {
          template.img.src = getImageUrl(urls[0].ImageUrl) as string
        }
      }

      if (record.Data.StationName) {
        template.title.innerHTML = record.Data.StationName
      }
      if (record.Data.DivisionName) {
        template.footer.innerHTML = record.Data.DivisionName
      }

      template.remark.innerHTML = dateFormat(
        new Date(record.EventTime),
        'HH:mm:ss'
      )

      let item = document.createElement('div')
      item.id = record.EventId!
      item.setAttribute('divisionid', record.Data.DivisionId!)
      item.innerHTML = template.element.innerHTML
      item.getElementsByTagName('img')[0].addEventListener('load', function () {
        this.removeAttribute('data-src')
      })

      item
        .getElementsByTagName('img')[0]
        .addEventListener('error', function () {
          this.src = DataController.defaultImageUrl
          this.style.background = 'black'
        })

      item.addEventListener('click', () => {
        //window.parent.recordDetails = record;
        const url =
          './event-details.html?openid=' +
          this.openId +
          '&pageindex=' +
          index +
          '&eventtype=' +
          record.EventType
        // console.log(window.parent);
        window.parent.showOrHideAside(url)
        // const aside_details = document.getElementById("aside-details") as HTMLIFrameElement;
        // aside_details.src = url;
        // this.showOrHideDetailsAside();
        // if (window.parent.pageJump)
        //     window.parent.pageJump(url);
        // else {
        //     window.parent.document.location.href = url;
        // }
      })
      // this.garbageElements.set(record.EventId, {
      //     Element: item,
      //     id: record.EventId,
      //     divisionId: record.Data.DivisionId,
      // })
      return item
    }

    datas: Global.Dictionary<EventRecord> = {}

    getElementByDataType(type: EventType) {
      switch (type) {
        case EventType.GarbageDrop:
          return element.GarbageDrop.list
        case EventType.GarbageDropHandle:
          return element.GarbageDropHandle.list
        case EventType.GarbageDropTimeout:
          return element.GarbageDropTimeout.list
        default:
          return undefined
      }
    }

    view(list: PagedList<GarbageDropEventRecord>) {
      for (let i = 0; i < list.Data.length; i++) {
        const data = list.Data[i]
        this.datas[data.EventId!] = data
        let item = this.convert(
          data,
          (list.Page.PageIndex - 1) * list.Page.PageSize + i,
          this.dataController.getImageUrl
        )

        this.parentElement[data.EventType].appendChild(item)
      }
      element.totalRecordCount.innerHTML = list.Page.TotalRecordCount.toString()
      if (list.Page.TotalRecordCount == 0) {
        element.recordCount.innerHTML = '0'
      } else {
        // console.log("Page", list.Page);
        element.recordCount.innerHTML = (
          list.Page.PageSize * (list.Page.PageIndex - 1) +
          list.Page.RecordCount
        ).toString()
      }
    }
    page: { [key: number]: Paged } = {}
    eventType: EventType = EventType.GarbageDrop
    selectedIds?: string[]
    async refresh(page: Paged, eventType: EventType) {
      console.log('refresh', page)
      const day = getAllDay(date)

      console.log(page)
      let data = await this.dataController.getGarbageDropEventList(
        day,
        page,
        eventType,
        this.selectedIds
      )

      console.log(data)

      if (data) {
        this.view(data)
        if (window.parent) {
          ;(window.parent as NavigationWindow).Day = getAllDay(date)
          ;(window.parent as NavigationWindow).RecordPage = {
            index: data.Page.PageIndex,
            size: data.Page.PageSize,
            count: data.Page.TotalRecordCount,
          }
        }
      }

      return data
    }

    clean() {
      this.page = {}
      this.parentElement[this.eventType].innerHTML = ''
    }

    createMiniRefresh(
      id: string,
      isAuto: boolean,
      down: (r: MiniRefresh) => void,
      up: (r: MiniRefresh) => void
    ) {
      return new MiniRefresh({
        container: '#' + id,
        down: {
          bounceTime: 0,
          callback: () => {
            down(this.miniRefresh[this.eventType])
          },
        },
        up: {
          isAuto: isAuto,
          callback: () => {
            up(this.miniRefresh[this.eventType])
          },
        },
      })
    }

    miniRefreshDown(r: MiniRefresh) {
      // 下拉事件
      this.clean()
      console.log('miniRefreshDown')

      r.endDownLoading()
      // r.resetUpLoading();
    }
    async miniRefreshUp(r: MiniRefresh) {
      {
        console.log('miniRefreshUp')
        let stop = true
        try {
          if (this.page[this.eventType]) {
            this.page[this.eventType].index++
          } else {
            this.page[this.eventType] = {
              index: 1,
              size: 20,
              count: 0,
            }
          }

          let data = await this.refresh(
            this.page[this.eventType],
            this.eventType
          )

          if (data) {
            stop = data.Page.PageIndex >= data.Page.PageCount
          } else {
            stop = true
          }
        } finally {
          console.log('stop', stop)
          r.endUpLoading(stop)
        }
      }
    }

    init() {
      element.GarbageDrop.list.innerHTML = ''
      element.GarbageDropHandle.list.innerHTML = ''
      element.GarbageDropTimeout.list.innerHTML = ''
      try {
        this.miniRefresh[EventType.GarbageDrop] = this.createMiniRefresh(
          MiniRefreshId.GarbageDrop,
          true,
          (r) => {
            this.miniRefreshDown(r)
          },
          (r) => {
            this.miniRefreshUp(r)
          }
        )
        this.miniRefresh[EventType.GarbageDropHandle] = this.createMiniRefresh(
          MiniRefreshId.GarbageDropHandle,
          false,
          (r) => {
            this.miniRefreshDown(r)
          },
          (r) => {
            this.miniRefreshUp(r)
          }
        )
        this.miniRefresh[EventType.GarbageDropTimeout] = this.createMiniRefresh(
          MiniRefreshId.GarbageDropTimeout,
          false,
          (r) => {
            this.miniRefreshDown(r)
          },
          (r) => {
            this.miniRefreshUp(r)
          }
        )
      } catch (error) {
        console.error(error)
      }
    }
  }

  export class Page {
    initDatePicker() {
      try {
        element.datePicker.addEventListener('click', () => {
          weui.datePicker({
            start: new Date(2020, 12 - 1, 1),
            end: new Date(),
            onChange: function (result: any) {},
            onConfirm: (result: any) => {
              date = new Date(
                result[0].value,
                result[1].value - 1,
                result[2].value
              )

              console.log(result, date)
              this.loadData()
              this.viewDatePicker(date)
            },
            title: '请选择日期',
          })
        })
      } catch (ex) {
        console.error(ex)
      }
    }
    viewDatePicker(date: Date) {
      element.date.innerHTML = dateFormat(date, 'yyyy年MM月dd日')
    }
    loadNavigation() {
      var navigation = document.getElementById('navigation')!
      var lis = navigation.getElementsByTagName('li')
      for (let i = 0; i < lis.length; i++) {
        lis[i].addEventListener('click', function () {
          let selected = navigation.getElementsByClassName('selected')
          if (selected && selected.length > 0) {
            selected[0].className = ''
          }
          this.className = 'selected'

          let tabs = document.getElementsByClassName('tab')
          for (let i = 0; i < tabs.length; i++) {
            ;(tabs[i] as HTMLElement).style.display = ''
          }

          let tab = document.getElementById(this.getAttribute('tab')!)!
          tab.style.display = 'block'
        })
      }
    }

    loadData() {
      if (this.record) {
        this.record.clean()
        console.log('loadData')
        this.record.miniRefresh[this.record.eventType].resetUpLoading()
      }
    }

    record?: GarbageDropEvent

    getEventTypeByIndex(index: number) {
      switch (index) {
        case 0:
          return EventType.GarbageDrop
        case 1:
          return EventType.GarbageDropTimeout
        case 2:
          return EventType.GarbageDropHandle
        default:
          return EventType.GarbageDrop
      }
    }

    SwiperControlChanged(index: number) {
      if (this.record) {
        // console.log("SwiperControlChanged")
        this.record.eventType = this.getEventTypeByIndex(index)
        this.record.clean()
        this.record.miniRefresh[this.record.eventType].resetUpLoading()
      }
    }
    getSwiperIndex(type: EventType) {
      switch (type) {
        case EventType.GarbageDropTimeout:
          return 1
        case EventType.GarbageDropHandle:
          return 2
        case EventType.GarbageDrop:
        default:
          return 0
      }
    }

    initSwiper() {
      let eventType = EventType.GarbageDrop
      // console.log(window.location.href);
      let strEventType = getQueryVariable('eventtype')
      // console.log(strEventType)
      if (strEventType) {
        eventType = parseInt(strEventType)
      }

      let swiper = new SwiperControl({
        selectors: {
          container: '.swiper-container',
          pagination: '.swiper-pagination',
        },
        navBar: ['垃圾滞留', '处置超时', '处置完成'],
        callback: (index) => {
          this.SwiperControlChanged(index)
        },
        initialSlide: this.getSwiperIndex(eventType),
      })
    }

    init() {
      this.viewDatePicker(new Date())

      const eventId = getQueryVariable('eventid')
      // if (eventId) {
      //     new HowellHttpClient.HttpClient().login2(() => {
      //         new PushEventDetail().init(eventId);
      //     });
      // }
      // else {

      this.loadNavigation()
      this.initDatePicker()

      const user = (window.parent as NavigationWindow).User
      const http = (window.parent as NavigationWindow).Authentication
      // console.log(http);
      const type = user.WUser.Resources![0].ResourceType
      const service = new Service(http)
      const dataController = ControllerFactory.Create(
        service,
        type,
        user.WUser.Resources!
      )

      this.record = new GarbageDropEvent(
        type,
        dataController,
        user.WUser.OpenId!
      )
      this.record.init()
      this.record.loadAside()

      this.initSwiper()
      // }
    }
  }
}
// console.log("User", (window.parent as NavigationWindow).User);
// console.log("Auth", (window.parent as NavigationWindow).Authentication);

const page = new EventHistoryPage.Page()
page.viewDatePicker(new Date())
page.init()
