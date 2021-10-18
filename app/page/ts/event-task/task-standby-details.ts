import { dateFormat } from '../../../common/tool'
import { EventTask } from '../../../data-core/model/waste-regulation/event-task'
import { Language } from '../language'
import ItemTemplate from '../../event-task/task-standby-details.html'
import AsideModel from '../data-controllers/modules/AsideModel/AsideModel'
import { ImageController } from '../data-controllers/modules/ImageControl'
import {
  EventTaskViewModel,
  IImageUrl,
  IPictureController,
} from '../data-controllers/ViewModels'
import Swiper, { Pagination } from 'swiper'
import { CameraImageUrl } from '../../../data-core/model/waste-regulation/event-record'
import { Division } from '../../../data-core/model/waste-regulation/division'
import { VideoUrl } from '../../../data-core/model/waste-regulation/video-model'
import { ImageFullScreenSwiper } from '../data-controllers/modules/ImageFullScreenSwiper/ImageFullScreenSwiper'

Swiper.use([Pagination])

export class EventTaskStandbyDetails extends AsideModel {
  timer = {
    warn: 1000 * 60 * 10,
    timeout: 1000 * 60 * 30,
  }
  template = ItemTemplate
  // imageController: ImageController

  swiper?: Swiper
  fullscreenSwiper?: ImageFullScreenSwiper

  constructor(
    selector: HTMLElement | string,
    private picture: IPictureController,
    private live: (id: string) => Promise<VideoUrl>
  ) {
    super(selector, ItemTemplate)
    this.init()
    // this.imageController = new ImageController('picture', picture)
  }

  init() {
    super.init()

    this.element = {
      taskdetails: this.innerContainer.querySelector(
        '.task-details'
      ) as HTMLDivElement,
      fullscreenswiper: this.innerContainer.querySelector(
        '.full-screen-swiper'
      ) as HTMLDivElement,
      pictures: this.innerContainer.querySelector(
        '.picture .swiper-wrapper'
      ) as HTMLDivElement,
      type: this.innerContainer.querySelector('.type') as HTMLDivElement,

      camera: this.innerContainer.querySelector('.camera') as HTMLDivElement,
      station: this.innerContainer.querySelector('.station') as HTMLDivElement,
      division: this.innerContainer.querySelector(
        '.division'
      ) as HTMLDivElement,
      datetime: this.innerContainer.querySelector(
        '.datetime'
      ) as HTMLDivElement,
      timeout: this.innerContainer.querySelector('.timeout') as HTMLDivElement,
      btn: this.innerContainer.querySelector('.btn-ok') as HTMLLinkElement,
    }
    this.element.btn.addEventListener('click', () => {
      if (this.btnOKClickedEvent && this.entity) {
        this.btnOKClickedEvent(this.entity)
      }
    })
  }

  onInnerBackClicked = (create: boolean = false) => {
    let params = {
      details: false,
    }
    this.notify(params)
  }

  update(args: any): void {
    throw new Error('Method not implemented.')
  }

  element!: EventTaskDetailsElement

  btnOKClickedEvent?: (entity: EventTaskViewModel) => void

  entity?: EventTaskViewModel

  set(entity: EventTaskViewModel): HTMLElement {
    this.entity = entity
    this.element.type.innerHTML = Language.TaskType(this.entity.TaskType)
    this.element.camera
    this.element.station.innerHTML = this.entity.DestinationName

    if (this.entity.DivisionId) {
      let division_promise = this.entity.getDivision()
      division_promise.then((division?: Division) => {
        if (division) {
          this.element.division.innerHTML = division.Name
        }
      })
    }

    this.element.datetime.innerHTML = dateFormat(
      this.entity.CreateTime,
      'yyyy-MM-dd HH:mm:ss'
    )
    this.element.timeout.innerHTML = dateFormat(
      this.entity.CreateTime,
      'yyyy-MM-dd HH:mm:ss'
    )

    this.setSceneImageUrls(this.entity.SceneImageUrls)

    return this.outterContainer
  }

  setSceneImageUrls(urls?: CameraImageUrl[]) {
    if (!urls) return

    let datas = []
    for (let i = 0; i < urls.length; i++) {
      const item = urls[i]
      this.createImg(item)
      datas.push(this.convertToImageUrl(item))
    }

    this.fullscreenSwiper = new ImageFullScreenSwiper(
      this.element.fullscreenswiper,
      datas
    )
    this.fullscreenSwiper.init()
    this.fullscreenSwiper.maskClicked = () => {
      this.element.fullscreenswiper.classList.remove('slideIn')

      this.element.taskdetails.classList.remove('img-hidden')
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

    this.element.pictures.appendChild(slide)
  }

  onImageIndexChanged(index: number) {
    if (!this.entity || !this.entity.SceneImageUrls) return

    let item = this.entity.SceneImageUrls[index]
    this.element.camera.innerHTML = item.CameraName
  }

  onImageClicked() {
    this.element.fullscreenswiper.classList.add('slideIn')
    this.element.taskdetails.classList.add('img-hidden')
  }
}

interface EventTaskDetailsElement {
  taskdetails: HTMLDivElement
  fullscreenswiper: HTMLDivElement
  pictures: HTMLDivElement
  type: HTMLDivElement
  camera: HTMLDivElement
  station: HTMLDivElement
  division: HTMLDivElement
  datetime: HTMLDivElement
  timeout: HTMLDivElement
  btn: HTMLLinkElement
}
