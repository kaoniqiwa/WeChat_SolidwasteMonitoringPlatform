import ItemTemplate from './task-details.html'

import Swiper, { Pagination } from 'swiper'
import AsideModel from '../ts/data-controllers/modules/AsideModel/AsideModel'
import { ImageFullScreenSwiper } from '../ts/data-controllers/modules/ImageFullScreenSwiper/ImageFullScreenSwiper'
import {
  EventTaskViewModel,
  IImageUrl,
  IPictureController,
} from '../ts/data-controllers/ViewModels'
import { VideoUrl } from '../../data-core/model/waste-regulation/video-model'
import { Language } from '../ts/language'
import { CameraImageUrl } from '../../data-core/model/waste-regulation/event-record'
import { getElement } from '../../common/tool'

Swiper.use([Pagination])

export abstract class EventTaskDetails extends AsideModel {
  timer = {
    warn: 1000 * 60 * 10,
    timeout: 1000 * 60 * 30,
  }
  template = ItemTemplate
  // imageController: ImageController

  swiper?: Swiper
  fullscreenSwiper?: ImageFullScreenSwiper

  imageIndexChangedEvent?: (sender: HTMLElement, args: CameraImageUrl) => void

  constructor(
    selector: HTMLElement | string,
    private picture: IPictureController,
    private live: (id: string) => Promise<VideoUrl>
  ) {
    super(selector, ItemTemplate)
    this.init()
    // this.imageController = new ImageController('picture', picture)
    this.html = {
      list: this.innerContainer.querySelector(
        '.details-list'
      ) as HTMLDivElement,
      fullscreenswiper: this.innerContainer.querySelector(
        '.full-screen-swiper'
      ) as HTMLDivElement,
      taskdetails: this.innerContainer.querySelector(
        '.task-details'
      ) as HTMLDivElement,
      pictures: this.innerContainer.querySelector(
        '.picture .swiper-wrapper'
      ) as HTMLDivElement,
      items: {},
    }
  }

  init() {
    super.init()
  }

  onInnerBackClicked = (create: boolean = false) => {
    let params = {
      details: {
        show: false,
        entity: this.entity,
      },
    }
    this.notify(params)
  }

  private html: IEventTaskDetailsElement

  _items?: EventTaskDetailItems
  public get items(): EventTaskDetailItems | undefined {
    return this._items
  }
  public set items(v: EventTaskDetailItems | undefined) {
    this._items = v
    for (const key in v) {
      if (Object.prototype.hasOwnProperty.call(v, key)) {
        let item = document.createElement('div')
        item.className = 'weui-form-preview__item'

        let name = document.createElement('label')
        name.className = 'weui-form-preview__label'
        name.innerHTML = v[key].name
        item.appendChild(name)

        let value = document.createElement('span')
        value.className = 'weui-form-preview__value'
        value.id = v[key].value.id
        value.classList.add(v[key].value.className)
        value.innerHTML = v[key].value.innerHTML
        item.appendChild(value)
        this.html.items[key] = item
        this.html.list.appendChild(item)
      }
    }
  }

  abstract entity?: EventTaskViewModel

  setSceneImageUrls(urls?: CameraImageUrl[]) {
    if (!urls) return

    let datas = []
    for (let i = 0; i < urls.length; i++) {
      const item = urls[i]
      this.createImg(item)
      datas.push(this.convertToImageUrl(item))
    }

    this.fullscreenSwiper = new ImageFullScreenSwiper(
      this.html.fullscreenswiper,
      datas
    )
    this.fullscreenSwiper.init()
    this.fullscreenSwiper.maskClicked = () => {
      this.html.fullscreenswiper.classList.remove('slideIn')

      this.html.taskdetails.classList.remove('img-hidden')
    }

    this.swiper = new Swiper('.picture', {
      pagination: {
        el: '.task-details .picture .swiper-pagination',
        type: 'fraction',
      },
      on: {
        init: (swiper: Swiper) => {
          this.onImageIndexChanged(swiper.activeIndex)
        },
        slideChangeTransitionEnd: (swiper: Swiper) => {
          this.onImageIndexChanged(swiper.activeIndex)
        },
      },
    })
  }

  convertToImageUrl(url: CameraImageUrl) {
    let result: IImageUrl = {
      cameraId: url.CameraId,
      cameraName: url.CameraName,
      url: this.picture.get(url.ImageUrl),
      preview: this.live(url.CameraId),
    }
    return result
  }

  createImg(item: CameraImageUrl) {
    let slide = document.createElement('div')
    slide.className = 'swiper-slide'

    let img = document.createElement('img')
    img.src = this.picture.get(item.ImageUrl)
    img.data = item
    img.addEventListener('click', (evt: Event) => {
      if (!evt.target) return

      console.log(evt.target.data)
      this.onImageClicked()
    })
    slide.appendChild(img)

    this.html.pictures.appendChild(slide)
  }

  onImageIndexChanged(index: number) {
    if (!this.entity || !this.entity.SceneImageUrls) return

    if (!this.items) return

    let item = this.entity.SceneImageUrls[index]

    for (const key in this.html.items) {
      if (Object.prototype.hasOwnProperty.call(this.html.items, key)) {
        const element = this.html.items[key]
        if (this.items[key].value.changeFromImage) {
          element.innerHTML = item.CameraName
          if (this.imageIndexChangedEvent) {
            this.imageIndexChangedEvent(element, item)
          }
        }
      }
    }

    this.html.items.camera.innerHTML = item.CameraName
  }

  onImageClicked() {
    this.html.items.fullscreenswiper.classList.add('slideIn')
    this.html.items.taskdetails.classList.add('img-hidden')
  }
}

interface IEventTaskDetailsElement {
  taskdetails: HTMLDivElement
  list: HTMLDivElement
  pictures: HTMLDivElement
  fullscreenswiper: HTMLDivElement
  items: IEventTaskDetailItemElements
}

interface IEventTaskDetailItemElements {
  [key: string]: HTMLElement
}

interface EventTaskDetailItems {
  [key: string]: EventTaskDetailItem
}

interface EventTaskDetailItem {
  name: string
  value: {
    id: string
    className: string
    innerHTML: string
    changeFromImage: boolean
  }
}
