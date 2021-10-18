import { SessionUser } from '../../../common/session-user'
import { getAllDay, getElement } from '../../../common/tool'
import { TaskStatus } from '../../../data-core/model/waste-regulation/event-task'
import { HowellAuthHttp } from '../../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../../data-core/repuest/http-client'
import { Service } from '../../../data-core/repuest/service'
import { ControllerFactory } from '../data-controllers/ControllerFactory'
import { OneDay } from '../data-controllers/IController'
import { IEventTaskController } from '../data-controllers/modules/IController/IEventTaskController'
import { SwiperControl } from '../data-controllers/modules/SwiperControl'
import { ToastMessage } from '../data-controllers/modules/ToastMessage'
import { EventTaskViewModel } from '../data-controllers/ViewModels'
import IObserver from '../IObserver'
import { EventTaskHistoryListPage } from '../../event-task/event-task-history/event-task-history-list'
import { ComplateEventTaskItem } from './task-complate-item'
import { HandleEventTaskItem } from './task-handle-item'
import { EventTaskStandbyDetails } from './task-standby-details'
import { StandbyEventTaskItem } from './task-standby-item'

class EventTaskListPage implements IObserver {
  date: Date

  elements = {
    navigation: [
      {
        id: 'standby',
        name: '可接任务',
      },
      {
        id: 'handle',
        name: '已接任务',
      },
      {
        id: 'finished',
        name: '完成任务',
      },
    ],
    history: getElement('showHistory'),
    container: {
      details: getElement('event-task-details-container') as HTMLDivElement,
      history: getElement('event-task-history-container') as HTMLDivElement,
    },
  }

  /** 提示信息 */
  message!: ToastMessage

  history?: EventTaskHistoryListPage

  //#region showDetails
  private _showDetails: boolean = false
  public get showDetails(): boolean {
    return this._showDetails
  }
  public set showDetails(v: boolean) {
    this._showDetails = v
    if (v) {
      this.elements.container.details.classList.add('slideIn')
    } else {
      this.elements.container.details.classList.remove('slideIn')
    }
  }
  //#endregion

  //#region showHistory

  private _showHistory: boolean = false
  public get showHistory(): boolean {
    return this._showHistory
  }
  public set showHistory(v: boolean) {
    this._showHistory = v
    if (v) {
      this.elements.container.history.classList.add('slideIn')
    } else {
      this.elements.container.history.classList.remove('slideIn')
    }
  }

  //#endregion

  constructor(private dataController: IEventTaskController) {
    this.date = new Date()
  }

  update(args: any): void {
    if (args) {
      if ('details' in args) {
        this.showDetails = args.details
      }
      if ('history' in args) {
        this.showHistory = args.history
      }
    }
  }
  //#region Init
  /** 注册事件 */
  eventRegist() {
    this.elements.history.addEventListener('click', () => {
      if (!this.history) {
        this.history = new EventTaskHistoryListPage(
          this.elements.container.history,
          this.dataController
        )
        this.history.init()
        this.history.add(this)
      }
      this.showHistory = true
    })
  }

  /** 初始化提示信息 */
  initMessage() {
    this.message = new ToastMessage({
      id: 'EventTaskListPageMessage',
      parent: document.body,
      message: '任务接受成功',
      autoHide: true,
    })
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

  initSwiper() {
    let swiper = new SwiperControl({
      selectors: {
        container: '.swiper-container',
        pagination: '.swiper-pagination',
      },
      navBar: this.elements.navigation.map((x) => x.name), // ['可接任务', '已接任务', '完成任务'],
      callback: (index) => {
        this.loadData(this.elements.navigation[index].id, index + 1)
      },
      initialSlide: 0,
    })
  }
  init() {
    this.initMessage()
    this.initSwiper()
    this.loadNavigation()
    this.eventRegist()
  }
  //#endregion
  loadData(elementId: string, status: TaskStatus) {
    let day = getAllDay(this.date)
    let data = EventTaskFactory.GetEventTaskList(
      status,
      this.dataController,
      day
    )
    if (!data) return
    data.then((x) => {
      let selector = getElement(elementId)
      selector.innerHTML = ''
      for (let i = 0; i < x.Data.length; i++) {
        const item = x.Data[i]

        let template = EventTaskFactory.CreateItemTemplate(
          status,
          selector,
          this.dataController,
          this.message
        )
        if (!template) return

        template.contentClickedEvent = (entity: EventTaskViewModel) => {
          this.ItemContentClickedEvent(entity)
        }

        let t = template.set(item)

        selector.appendChild(t)
      }
    })
  }

  ItemContentClickedEvent(entity: EventTaskViewModel) {
    let details = new EventTaskStandbyDetails(
      'event-task-details-container',
      this.dataController.picture,
      this.dataController.getLiveUrl.bind(this.dataController)
    )
    details.set(entity)
    details.add(this)
    this.showDetails = true
  }
}

const user = new SessionUser()

// console.log(user)
if (user.WUser.Resources) {
  const type = user.WUser.Resources![0].ResourceType

  new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {
    const service = new Service(http)
    const dataController = ControllerFactory.Create(
      service,
      type,
      user.WUser.Resources!
    )
    const page = new EventTaskListPage(dataController as IEventTaskController)
    page.init()
    page.loadData('standby', TaskStatus.handle)
  })
}

class EventTaskFactory {
  static CreateItemTemplate(
    status: TaskStatus,
    parent: HTMLElement,
    controller: IEventTaskController,
    message: ToastMessage
  ) {
    switch (status) {
      case TaskStatus.handle:
        return new StandbyEventTaskItem(parent, controller, message)
      case TaskStatus.handling:
        return new HandleEventTaskItem(parent, controller, message)
      case TaskStatus.handed:
        return new ComplateEventTaskItem(parent, controller, message)
      default:
        break
    }
  }

  static GetEventTaskList(
    status: TaskStatus,
    controller: IEventTaskController,
    day: OneDay
  ) {
    switch (status) {
      case TaskStatus.handle:
        return controller.getAvailableEventTaskList(day)
      case TaskStatus.handling:
        return controller.getEventTaskList(day, true, false)
      case TaskStatus.handed:
        return controller.getEventTaskList(day, true, true)
      default:
        break
    }
  }
}
