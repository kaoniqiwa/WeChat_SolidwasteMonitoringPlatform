import { EventTaskViewModel } from '../data-controllers/ViewModels'
import { Language } from '../language'

export abstract class EventTaskItem {
  outer: HTMLElement
  timer = {
    warn: 1000 * 60 * 10,
    timeout: 1000 * 60 * 30,
  }
  constructor(
    parent: HTMLElement,
    className: string,
    private template: string
  ) {
    this.outer = document.createElement('div')
    this.outer.className = className
    this.outer.innerHTML = this.template
    this.element = {
      content: this.outer.querySelector('.item-content') as HTMLDivElement,
      timeValue: this.outer.querySelector('.time .value') as HTMLSpanElement,
      time: this.outer.querySelector('.time') as HTMLDivElement,
      img: this.outer.querySelector('img') as HTMLImageElement,
      name: this.outer.querySelector('.name') as HTMLDivElement,
      address: this.outer.querySelector('.address') as HTMLDivElement,
      state: this.outer.querySelector('.state') as HTMLDivElement,
      btn: this.outer.querySelector('.btn-ok') as HTMLLinkElement,
    }
    this.element.btn.addEventListener('click', () => {
      if (this.btnOKClickedEvent && this.entity) {
        this.btnOKClickedEvent(this.entity)
      }
    })
    this.element.content.addEventListener('click', () => {
      if (this.contentClickedEvent && this.entity) {
        this.contentClickedEvent(this.entity)
      }
    })

    parent.appendChild(this.outer)
  }

  element: EventTaskItemElement

  btnOKClickedEvent?: (entity: EventTaskViewModel) => void

  contentClickedEvent?: (entity: EventTaskViewModel) => void

  entity?: EventTaskViewModel

  abstract getPicture(id: string): string

  set(entity: EventTaskViewModel): HTMLElement {
    this.entity = entity
    let endTime = this.entity.CreateTime
    endTime.setTime(this.entity.CreateTime.getTime() + this.timer.timeout)
    let now = new Date()
    let surplus = endTime.getTime() - now.getTime()

    if (surplus < this.timer.warn) {
      this.element.time.classList.add('warn')
    }
    let time = new Date(surplus)

    this.element.timeValue.innerHTML = time.getMinutes().toString()
    if (this.entity.SceneImageUrls && this.entity.SceneImageUrls.length > 0) {
      this.element.img.src = this.getPicture(
        this.entity.SceneImageUrls[0].ImageUrl
      )
    }
    this.element.name.innerHTML = this.entity.DestinationName
    this.element.address.innerHTML = this.entity.DestinationAddress

    this.element.state.innerHTML = Language.TaskType(this.entity.TaskType)

    this.outer.id = this.entity.Id
    return this.outer
  }
}

interface EventTaskItemElement {
  content: HTMLDivElement
  timeValue: HTMLSpanElement
  time: HTMLDivElement
  img: HTMLImageElement
  name: HTMLDivElement
  address: HTMLDivElement
  state: HTMLDivElement
  btn: HTMLLinkElement
}
