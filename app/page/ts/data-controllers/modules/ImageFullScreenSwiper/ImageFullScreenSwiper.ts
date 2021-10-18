import Swiper, { Pagination } from 'swiper'
import { getElement } from '../../../../../common/tool'
import { IImageUrl } from '../../ViewModels'
import HtmlTemplate from './ImageFullScreenSwiper.html'
import './ImageFullScreenSwiper.less'

Swiper.use([Pagination])
export class ImageFullScreenSwiper {
  swiper?: Swiper

  selector: HTMLElement
  template = HtmlTemplate

  urls: IImageUrl[]

  constructor(selector: HTMLElement | string, urls: IImageUrl[]) {
    this.selector = getElement(selector)
    this.selector.innerHTML = this.template
    this.urls = urls

    this.load(urls)
  }

  load(urls: IImageUrl[]) {
    let wrapper = this.selector.querySelector(
      '.swiper-wrapper'
    ) as HTMLDivElement
    for (let i = 0; i < urls.length; i++) {
      wrapper.data = urls[i]
      let slide = document.createElement('div')
      slide.className = 'swiper-slide'

      let img = document.createElement('img')
      img.src = urls[i].url
      img.data = urls[i]
      slide.appendChild(img)

      wrapper.appendChild(slide)
    }

    let mask = this.selector.querySelector('.mask') as HTMLDivElement
    mask.addEventListener('click', () => {
      if (this.maskClicked) {
        this.maskClicked()
      }
    })
  }

  init() {
    this.swiper = new Swiper(
      this.selector.querySelector('.swiper-container') as HTMLDivElement,
      {
        pagination: {
          el: this.selector.querySelector('.swiper-pagination') as HTMLElement,
          type: 'fraction',
        },
        on: {
          init: (swiper: Swiper) => {
            if (this.indexChanged) {
              this.indexChanged(swiper.activeIndex)
            }
          },
          slideChangeTransitionEnd: (swiper: Swiper) => {
            if (this.indexChanged) {
              this.indexChanged(swiper.activeIndex)
            }
          },
        },
      }
    )
  }

  indexChanged?: (index: number) => void
  maskClicked?: () => void
}
