import AsideModel from '../../ts/data-controllers/modules/AsideModel/AsideModel'
import Template from './event-task-history-list.html'
import DatePicker from '../../ts/data-controllers/modules/DatePicker'
import { SwiperControl } from '../../ts/data-controllers/modules/SwiperControl'
import { IEventTaskController } from '../../ts/data-controllers/modules/IController/IEventTaskController'
import { TaskStatus } from '../../../data-core/model/waste-regulation/event-task'
import { getElement } from '../../../common/tool'
import { EventTaskHistoryItem } from './event-task-history-item'
import { EventTaskViewModel } from '../../ts/data-controllers/ViewModels'

export class EventTaskHistoryListPage extends AsideModel {
  readonly currentClassName = 'event-task-history-container'
  innerElements = {
    navigation: [
      {
        id: 'event-task-history-complated',
        name: '完成任务',
      },
      {
        id: 'event-task-history-timeout',
        name: '超时完成任务',
      },
      {
        id: 'event-task-history-incomplated',
        name: '未完成任务',
      },
    ],
  }
  datePicker: DatePicker
  constructor(
    selector: HTMLElement | string,
    private dataController: IEventTaskController
  ) {
    super(selector, Template)

    this.init()

    this.createElement()
    this.datePicker = new DatePicker(new Date(), {
      view: '.date',
      picker: 'showDatePicker',
    })
  }

  private eventRegist() {
    this.onInnerBackClicked = () => {
      this.notify({ history: false })
    }
  }

  createElement() {
    this.elements = {}
    this.elements['header'] = this.innerContainer.querySelector(
      `.inner-bar .right`
    ) as HTMLDivElement
    // flex-direction:row-reverse;
    this.elements.header.style.flexDirection = 'row-reverse'
    let dateText = document.createElement('div')
    dateText.className = 'date'
    //dateText.innerText = dateFormat(this.datePicker.date, 'yyyy年MM月dd日')

    this.elements.header.appendChild(dateText)
  }
  initSwiper() {
    let swiper = new SwiperControl({
      selectors: {
        container: `.${this.currentClassName} .swiper-container`,
        pagination: `.${this.currentClassName} .swiper-pagination`,
      },
      navBar: this.innerElements.navigation.map((x) => x.name), // ['可接任务', '已接任务', '完成任务'],
      callback: (index) => {
        this.loadData(this.innerElements.navigation[index].id, {
          timeout: index == 1,
          finished: index == 2,
        })
      },
      initialSlide: 0,
    })
  }
  loadNavigation() {
    var navigation = this.innerContainer.querySelector(
      '#event-task-history-navigation'
    )!
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

  init() {
    super.init()
    this.initSwiper()
    this.loadNavigation()
    this.eventRegist()
  }

  loadData(elementId: string, state: { timeout: boolean; finished: boolean }) {
    let date = this.datePicker ? this.datePicker.date : new Date()
    let data = this.dataController.Daily(date, state.timeout, state.finished)
    if (!data) return
    data.then((x) => {
      let selector = getElement(elementId)
      selector.innerHTML = ''
      for (let i = 0; i < x.Data.length; i++) {
        const item = x.Data[i]

        let template = new EventTaskHistoryItem(selector, this.dataController)
        if (!template) return

        template.contentClickedEvent = (entity: EventTaskViewModel) => {
          this.ItemContentClickedEvent(entity)
        }

        let t = template.set(item)

        selector.appendChild(t)
      }
    })
  }

  ItemContentClickedEvent(entity: EventTaskViewModel) {}
}
