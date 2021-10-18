import '../../../../css/aside.less'
import '../../../../css/header.less'
import IAside from '../../../IAside'
import { getElement } from '../../../../../common/tool'
import Template from './AsideModel.html'

export default class AsideModel extends IAside {
  elements!: {
    [key: string]: HTMLElement
  }
  outterContainer: HTMLElement
  innerContainer: HTMLDivElement = document.createElement('div')
  onInnerBackClicked?: () => void

  constructor(
    selector: HTMLElement | string,
    private innerHtml: string,
    template: string = Template
  ) {
    super()
    this.outterContainer =
      typeof selector == 'string' ? getElement(selector) : selector

    this.innerContainer.classList.add('aside-inner-container')
    this.innerContainer.innerHTML = template
  }

  init() {
    this.outterContainer.innerHTML = ''
    this.outterContainer.appendChild(this.innerContainer)
    this.elements = {
      mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
      innerBack: this.innerContainer.querySelector(
        '.inner-back'
      ) as HTMLDivElement,
      main: this.innerContainer.querySelector('.inner-main') as HTMLDivElement,
    }

    this.elements.main.innerHTML = this.innerHtml
    this.bindEvents()
  }

  private bindEvents() {
    if (this.elements.innerBack) {
      this.elements.innerBack.addEventListener('click', () => {
        if (this.onInnerBackClicked) {
          this.onInnerBackClicked()
        }
      })
    }
  }
  notify(args: any) {
    this.observerList.forEach((observer) => {
      observer.update(args)
    })
  }
}
