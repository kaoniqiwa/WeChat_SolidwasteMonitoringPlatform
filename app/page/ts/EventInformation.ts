import {
  dateFormat,
  getQueryVariable,
  getQueryVariable2,
} from '../../common/tool'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
import { SessionUser } from '../../common/session-user'
import { Language } from './language'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { NavigationWindow } from '.'
import { ImageController } from './data-controllers/modules/ImageControl'
import { DataController } from './data-controllers/DataController'
import {
  GarbageCountsParams,
  IDetailsEvent,
  IImage,
  OneDay,
  Paged,
} from './data-controllers/IController'
import { ControllerFactory } from './data-controllers/ControllerFactory'
import { Service } from '../../data-core/repuest/service'
import { LoopPageControl } from './data-controllers/modules/LoopPageControl'
import Swiper, { Pagination } from 'swiper'
import {
  CameraImageUrl,
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../data-core/model/waste-regulation/event-record'
import { IImageUrl } from './data-controllers/ViewModels'

Swiper.use([Pagination])

class GarbageDropImageUrl extends CameraImageUrl {
  constructor(url: CameraImageUrl, type: EventType) {
    super()
    this.CameraId = url.CameraId
    this.CameraName = url.CameraName
    this.ImageUrl = url.ImageUrl
    this.EventType = type
  }
  EventType: EventType
}

export namespace EventInformationPage {
  export class EventDetail {
    imageController: ImageController

    loopController: LoopPageControl

    pageIndex?: number
    template: HTMLTemplateElement
    paged?: Paged
    day?: OneDay
    isLoaded: boolean = false

    get PageIndex() {
      if (this.pageIndex == undefined && this.paged) {
        const strIndex = getQueryVariable('pageindex')
        if (strIndex) {
          this.pageIndex = parseInt(strIndex)
        }
      }
      return this.pageIndex
    }

    constructor(
      private dataController: IDetailsEvent,
      private user: SessionUser
    ) {
      if (window.parent) {
        this.day = (window.parent as NavigationWindow).Day
        this.paged = (window.parent as NavigationWindow).RecordPage
      }

      this.template = document.getElementById('template') as HTMLTemplateElement
      this.init()
      this.imageController = new ImageController(
        '#origin-img',
        this.dataController.picture
      )

      this.loopController = new LoopPageControl('#swiper-page', {
        callback: (index, element) => {
          if (this.isLoaded) {
            this.PageChange(index, element)
          }
        },
        loaded: (element: HTMLElement) => {
          this.loaded(element)
          this.isLoaded = true
        },
      })

      this.loopController.init(this.PageIndex)
    }

    async loaded(element: HTMLElement) {
      this.PageChange(this.PageIndex, element)
    }

    async PageChange(index: number | undefined, element: HTMLElement) {
      element.innerHTML = this.template.innerHTML
      if (index != undefined) {
        index += 1
      }
      const data = await this.getData(index, this.day)
      if (data) {
        this.fillDetail(data, element)
      }
    }

    init() {
      let btn = document.getElementsByClassName('back__btn')
      if (btn) {
        for (let i = 0; i < btn.length; i++) {
          btn[i].addEventListener('click', () => {
            window.parent.showOrHideAside()
            // location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
          })
        }
      }
      let wrapper = document.querySelector(
        '.swiper-wrapper.page'
      ) as HTMLDivElement
      if (this.paged) {
        for (let i = 0; i < this.paged.count!; i++) {
          let slide = document.createElement('div')
          slide.className = 'swiper-slide page'
          wrapper.appendChild(slide)
        }
      } else {
        let slide = document.createElement('div')
        slide.className = 'swiper-slide page'
        wrapper.appendChild(slide)
      }
    }

    async getData(pageIndex?: number, day?: OneDay) {
      const eventId = getQueryVariable('eventid')
      const strEventType = getQueryVariable('eventtype')
      const str_filter = getQueryVariable('filter')
      debugger
      let filter = { sourceIds: undefined }
      if (str_filter) {
        debugger
        filter = JSON.parse(base64decode(str_filter))
      }
      let eventType = EventType.IllegalDrop

      if (strEventType) {
        eventType = parseInt(strEventType)
      }

      if (eventId) {
        return await this.dataController.GetEventRecord(eventType, eventId)
      } else if (pageIndex != undefined && day) {
        return await this.dataController.GetEventRecord(
          eventType,
          pageIndex,
          day,
          filter.sourceIds
        )
      } else {
        return undefined
      }
    }

    fillEventRecord(
      item: IllegalDropEventRecord | MixedIntoEventRecord,
      element?: HTMLElement
    ) {
      let source: HTMLElement | Document = element ? element : document

      const police__type = source.getElementsByClassName('police__type'),
        camera__name = source.getElementsByClassName('camera__name'),
        station__name = source.getElementsByClassName('station__name'),
        rc__name = source.getElementsByClassName('rc__name'),
        police__time = source.getElementsByClassName('police__time'),
        detail_imgs = source.getElementsByClassName('detail_img')

      let btn = source.getElementsByClassName('back__btn')
      if (btn) {
        for (let i = 0; i < btn.length; i++) {
          btn[i].addEventListener('click', () => {
            window.parent.showOrHideAside()
            // location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
          })
        }
      }

      if (police__type) {
        for (let i = 0; i < police__type.length; i++) {
          ;(police__type[i] as HTMLSpanElement).innerText = Language.EventType(
            item.EventType
          )
        }
      }
      if (item.ResourceName && camera__name) {
        for (let i = 0; i < camera__name.length; i++) {
          ;(camera__name[i] as HTMLSpanElement).innerText = item.ResourceName
        }
      }

      if (station__name) {
        for (let i = 0; i < station__name.length; i++) {
          ;(station__name[i] as HTMLSpanElement).innerText =
            item.Data.StationName
        }
      }

      if (item.Data.DivisionName && rc__name) {
        for (let i = 0; i < rc__name.length; i++) {
          ;(rc__name[i] as HTMLSpanElement).innerText = item.Data.DivisionName
        }
      }

      if (police__time) {
        for (let i = 0; i < police__time.length; i++) {
          ;(police__time[i] as HTMLSpanElement).innerText = dateFormat(
            new Date(item.EventTime),
            'yyyy-MM-dd HH:mm:ss'
          )
        }
      }

      let url: string = DataController.defaultImageUrl
      if (item.ImageUrl) {
        if (item.ImageUrl.indexOf('?') >= 0) {
          url = item.ImageUrl
        } else {
          let resUrl = this.dataController.getImageUrl(item.ImageUrl)
          if (resUrl) {
            url = resUrl
          }
        }
      }

      if (detail_imgs) {
        for (let i = 0; i < detail_imgs.length; i++) {
          let detail_img = detail_imgs[i] as HTMLImageElement
          detail_img.src = url
          if (i > 3) {
            detail_img.loading = 'lazy'
          }
          detail_img.onload = () => {
            detail_img.removeAttribute('data-src')
            const frame = detail_img.parentElement!.querySelector(
              '.frame'
            ) as HTMLDivElement

            frame.style.width = detail_img.offsetWidth + 'px'
            frame.style.height = detail_img.offsetHeight + 'px'
            this.drawFrame(
              item,
              detail_img.offsetWidth,
              detail_img.offsetHeight,
              frame
            )
          }
          detail_img.addEventListener('click', () => {
            let selectors = {
              frameId: 'max-frame',
              imgId: 'max-img',
            }

            let time = new Date(item.EventTime)
            let interval = this.getEventTimeInterval(time)

            let url: IImageUrl = {
              url: detail_img.src,
              cameraName: item.ResourceName,
              cameraId: item.ResourceId!,
              playback: this.dataController.getVodUrl(
                item.ResourceId!,
                interval.begin,
                interval.end
              ),
            }

            this.imageController.showDetail(selectors, [url], true)
            let frame = document.getElementById(
              selectors.frameId
            ) as HTMLImageElement
            let img = document.getElementById(
              selectors.imgId
            ) as HTMLImageElement
            img.onload = () => {
              let url = this.drawFrame(
                item,
                img.naturalWidth,
                img.naturalHeight
              )!
              frame.src = url
            }

            // img.onload = () => {
            //     frame.style.width = img.offsetWidth + "px";
            //     frame.style.height = img.offsetHeight + "px";
            //     this.drawFrame1(frame, item, img);
            // }
            // img.addEventListener("touchmove", (e) => {

            //     // frame.style.scale = img.style.scale;
            //     frame.style.transform = img.style.transform;
            //     frame.style.transformBox = img.style.transformBox;
            //     frame.style.transformStyle = img.style.transformStyle;
            //     // frame.style.width = img.offsetWidth + "px";
            //     // frame.style.height = img.offsetHeight + "px";
            // })
          })
        }
      }
    }

    getEventTimeInterval(time: Date) {
      time.setSeconds(time.getSeconds() - 15)
      let begin = new Date(time.getTime())
      time.setSeconds(time.getSeconds() + 30)
      let end = new Date(time.getTime())
      return {
        begin: begin,
        end: end,
      }
    }

    fillGarbageFullEventRecord(
      item: GarbageFullEventRecord,
      element?: HTMLElement
    ) {
      let source: HTMLElement | Document = element ? element : document

      const police__type = source.getElementsByClassName('police__type'),
        camera__name = source.querySelector('.camera__name') as HTMLElement,
        station__name = source.getElementsByClassName('station__name'),
        rc__name = source.getElementsByClassName('rc__name'),
        police__time = source.getElementsByClassName('police__time')

      if (source instanceof HTMLElement) {
        source.id = item.EventId!
      }

      let btn = source.getElementsByClassName('back__btn')
      if (btn) {
        for (let i = 0; i < btn.length; i++) {
          btn[i].addEventListener('click', () => {
            window.parent.showOrHideAside()
            // location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
          })
        }
      }

      if (police__type) {
        for (let i = 0; i < police__type.length; i++) {
          ;(police__type[i] as HTMLSpanElement).innerText = Language.EventType(
            item.EventType
          )
        }
      }

      if (station__name) {
        for (let i = 0; i < station__name.length; i++) {
          ;(station__name[i] as HTMLSpanElement).innerText =
            item.Data.StationName
        }
      }

      if (item.Data.DivisionName && rc__name) {
        for (let i = 0; i < rc__name.length; i++) {
          ;(rc__name[i] as HTMLSpanElement).innerText = item.Data.DivisionName
        }
      }

      if (police__time) {
        for (let i = 0; i < police__time.length; i++) {
          ;(police__time[i] as HTMLSpanElement).innerText = dateFormat(
            new Date(item.EventTime),
            'yyyy-MM-dd HH:mm:ss'
          )
        }
      }

      let url: string = DataController.defaultImageUrl

      camera__name.innerHTML = ''
      if (item.Data.CameraImageUrls && item.Data.CameraImageUrls.length > 0) {
        console.log(item.Data.CameraImageUrls)
        let container = source.querySelector(
          '.swiper-container-img'
        ) as HTMLDivElement
        let wrapper = container.querySelector(
          '.swiper-wrapper'
        ) as HTMLDivElement
        let template = wrapper.querySelector(
          '.weui-form-preview__item'
        ) as HTMLDivElement
        let urls = new Array<IImageUrl>()
        let time = new Date(item.EventTime)
        let interval = this.getEventTimeInterval(time)
        for (let i = 0; i < item.Data.CameraImageUrls.length; i++) {
          let element = template
          if (i > 0) {
            element = template.cloneNode(true) as HTMLDivElement
            wrapper.appendChild(element)
          }

          const detail_img = element.querySelector(
            '.detail_img'
          ) as HTMLImageElement

          const imageUrl = item.Data.CameraImageUrls[i]
          url = this.dataController.getImageUrl(imageUrl.ImageUrl) as string
          urls.push({
            url: url,
            cameraName: imageUrl.CameraName,
            cameraId: imageUrl.CameraId,
            playback: this.dataController.getVodUrl(
              imageUrl.CameraId,
              interval.begin,
              interval.end
            ),
          })

          if (detail_img) {
            detail_img.src = url
            if (i > 3) {
              detail_img.loading = 'lazy'
            }

            detail_img.onload = () => {
              detail_img.removeAttribute('data-src')
            }
            detail_img.onerror = () => {
              // detail_img.src =
            }
            detail_img.addEventListener('click', () => {
              let selectors = {
                //frameId: "max-frame",
                imgId: 'max-img',
              }
              let index = 0
              let str = detail_img.getAttribute('index')
              if (str) {
                index = parseInt(str)
              }
              this.imageController.showDetail(selectors, urls, false, index)
            })

            detail_img.setAttribute('cameraName', imageUrl.CameraName)
            detail_img.setAttribute('cameraId', imageUrl.CameraId)
            detail_img.setAttribute('stationId', item.Data.StationId)
            detail_img.setAttribute('index', i.toString())
          }
        }
        console.log('swiper', Swiper)

        // new Swiper('.swiper-container-img', {
        //     pagination: {
        //         el: '.swiper-pagination-img', type: 'fraction'
        //     }
        // })
        let swiper = new Swiper(
          source.querySelector('.swiper-container-img') as HTMLElement,
          {
            on: {
              slideChange: async (sw) => {
                let img = sw.slides[sw.activeIndex].querySelector(
                  '.detail_img'
                ) as HTMLImageElement
                let cameraName = img.getAttribute('cameraName')
                // if (!cameraName || cameraName == "null") {
                //     let stationId = img.getAttribute("stationId");
                //     let cameraId = img.getAttribute("cameraId");
                //     if (stationId && cameraId) {
                //         let camera = await this.dataController.GetCamera(stationId, cameraId);
                //         cameraName = camera.Name;
                //     }
                // }
                let camera__name = source.querySelector(
                  '.camera__name'
                ) as HTMLElement
                if (cameraName) {
                  camera__name.innerHTML = cameraName
                }
              },
              init: async (sw) => {
                let img = sw.slides[sw.activeIndex].querySelector(
                  '.detail_img'
                ) as HTMLImageElement
                let cameraName = img.getAttribute('cameraName')
                // if (!cameraName || cameraName == "null") {
                //     let stationId = img.getAttribute("stationId");
                //     let cameraId = img.getAttribute("cameraId");
                //     if (stationId && cameraId) {
                //         let camera = await this.dataController.GetCamera(stationId, cameraId);
                //         cameraName = camera.Name;
                //     }
                // }
                let camera__name = source.querySelector(
                  '.camera__name'
                ) as HTMLElement
                if (cameraName) {
                  camera__name.innerHTML = cameraName
                }
              },
            },
            pagination: {
              el: '.swiper-pagination-img',
              type: 'fraction',
            },
          }
        )
      }
    }
    fillGarbageDropEventRecord(
      item: GarbageDropEventRecord,
      element?: HTMLElement
    ) {
      let source: HTMLElement | Document = element ? element : document

      const police__type = source.getElementsByClassName('police__type'),
        camera__name = source.querySelector('.camera__name') as HTMLElement,
        station__name = source.getElementsByClassName('station__name'),
        rc__name = source.getElementsByClassName('rc__name'),
        police__time = source.getElementsByClassName('police__time')

      if (source instanceof HTMLElement) {
        source.id = item.EventId!
      }

      let btn = source.getElementsByClassName('back__btn')
      if (btn) {
        for (let i = 0; i < btn.length; i++) {
          btn[i].addEventListener('click', () => {
            window.parent.showOrHideAside()
            // location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
          })
        }
      }

      if (police__type) {
        for (let i = 0; i < police__type.length; i++) {
          let text = '' //item.EventDescription;
          if (!text) {
            text = Language.EventType(item.EventType)
          }
          ;(police__type[i] as HTMLSpanElement).innerText = text
        }
      }

      if (station__name) {
        for (let i = 0; i < station__name.length; i++) {
          ;(station__name[i] as HTMLSpanElement).innerText =
            item.Data.StationName
        }
      }

      if (item.Data.DivisionName && rc__name) {
        for (let i = 0; i < rc__name.length; i++) {
          ;(rc__name[i] as HTMLSpanElement).innerText = item.Data.DivisionName
        }
      }

      if (police__time) {
        for (let i = 0; i < police__time.length; i++) {
          ;(police__time[i] as HTMLSpanElement).innerText = dateFormat(
            new Date(item.EventTime),
            'yyyy-MM-dd HH:mm:ss'
          )
        }
      }

      let url: string = DataController.defaultImageUrl

      camera__name.innerHTML = ''
      let imgUrls = new Array<GarbageDropImageUrl>()

      if (item.Data.DropImageUrls) {
        let url = item.Data.DropImageUrls.map((x) => {
          return new GarbageDropImageUrl(x, EventType.GarbageDrop)
        })
        imgUrls = imgUrls.concat(url)
      }
      if (item.Data.IsTimeout) {
        if (item.Data.TimeoutImageUrls) {
          let url = item.Data.TimeoutImageUrls.map((x) => {
            return new GarbageDropImageUrl(x, EventType.GarbageDropTimeout)
          })
          imgUrls = imgUrls.concat(url)
        }
      }
      if (item.Data.IsHandle) {
        if (item.Data.HandleImageUrls) {
          let url = item.Data.HandleImageUrls.map((x) => {
            return new GarbageDropImageUrl(x, EventType.GarbageDropHandle)
          })
          imgUrls = imgUrls.concat(url)
        }
      }

      if (imgUrls.length > 0) {
        console.log(imgUrls)
        let container = source.querySelector(
          '.swiper-container-img'
        ) as HTMLDivElement
        let wrapper = container.querySelector(
          '.swiper-wrapper'
        ) as HTMLDivElement
        let template = wrapper.querySelector(
          '.weui-form-preview__item'
        ) as HTMLDivElement
        let urls = new Array<IImageUrl>()
        let time = new Date(item.EventTime)
        let interval = this.getEventTimeInterval(time)
        for (let i = 0; i < imgUrls.length; i++) {
          let element = template
          if (i > 0) {
            element = template.cloneNode(true) as HTMLDivElement
            wrapper.appendChild(element)
          }

          const detail_img = element.querySelector(
            '.detail_img'
          ) as HTMLImageElement

          const imageUrl = imgUrls[i]
          url = this.dataController.getImageUrl(imageUrl.ImageUrl) as string
          urls.push({
            url: url,
            cameraName: imageUrl.CameraName,
            cameraId: imageUrl.CameraId,
            playback: this.dataController.getVodUrl(
              imageUrl.CameraId,
              interval.begin,
              interval.end
            ),
          })

          if (detail_img) {
            detail_img.src = url
            if (i > 3) {
              detail_img.loading = 'lazy'
            }

            detail_img.onload = () => {
              detail_img.removeAttribute('data-src')
            }
            detail_img.onerror = () => {
              // detail_img.src =
            }
            detail_img.addEventListener('click', () => {
              let selectors = {
                //frameId: "max-frame",
                imgId: 'max-img',
              }
              let index = 0
              let str = detail_img.getAttribute('index')
              if (str) {
                index = parseInt(str)
              }
              this.imageController.showDetail(selectors, urls, true, index)
            })

            detail_img.setAttribute('eventType', imageUrl.EventType.toString())
            detail_img.setAttribute('cameraName', imageUrl.CameraName)
            detail_img.setAttribute('cameraId', imageUrl.CameraId)
            detail_img.setAttribute('stationId', item.Data.StationId)
            detail_img.setAttribute('index', i.toString())
          }
        }
        console.log('swiper', Swiper)

        // new Swiper('.swiper-container-img', {
        //     pagination: {
        //         el: '.swiper-pagination-img', type: 'fraction'
        //     }
        // })
        let swiper = new Swiper(
          source.querySelector('.swiper-container-img') as HTMLElement,
          {
            on: {
              slideChange: async (sw) => {
                let img = sw.slides[sw.activeIndex].querySelector(
                  '.detail_img'
                ) as HTMLImageElement
                let cameraName = img.getAttribute('cameraName')
                // if (!cameraName || cameraName == "null") {
                //     let stationId = img.getAttribute("stationId");
                //     let cameraId = img.getAttribute("cameraId");
                //     if (stationId && cameraId) {
                //         let camera = await this.dataController.GetCamera(stationId, cameraId);
                //         cameraName = camera.Name;
                //     }
                // }
                let camera__name = source.querySelector(
                  '.camera__name'
                ) as HTMLElement
                if (cameraName) {
                  camera__name.innerHTML = cameraName
                }

                let eventType = img.getAttribute('eventType')
                let police__type = source.querySelector(
                  '.police__type'
                ) as HTMLElement
                if (eventType) {
                  police__type.innerHTML = Language.EventType(
                    parseInt(eventType)
                  )
                }
              },
              init: async (sw) => {
                let img = sw.slides[sw.activeIndex].querySelector(
                  '.detail_img'
                ) as HTMLImageElement
                let cameraName = img.getAttribute('cameraName')
                // if (!cameraName || cameraName == "null") {
                //     let stationId = img.getAttribute("stationId");
                //     let cameraId = img.getAttribute("cameraId");
                //     if (stationId && cameraId) {
                //         let camera = await this.dataController.GetCamera(stationId, cameraId);
                //         cameraName = camera.Name;
                //     }
                // }
                let camera__name = source.querySelector(
                  '.camera__name'
                ) as HTMLElement
                if (cameraName) {
                  camera__name.innerHTML = cameraName
                }
              },
            },
            pagination: {
              el: '.swiper-pagination-img',
              type: 'fraction',
            },
          }
        )
      }
    }

    fillDetail(
      item:
        | IllegalDropEventRecord
        | MixedIntoEventRecord
        | GarbageFullEventRecord
        | GarbageDropEventRecord,
      element?: HTMLElement
    ) {
      if (item instanceof GarbageFullEventRecord) {
        this.fillGarbageFullEventRecord(item, element)
      } else if (item instanceof GarbageDropEventRecord) {
        this.fillGarbageDropEventRecord(item, element)
      } else {
        this.fillEventRecord(item, element)
      }
    }

    drawFrame1(
      element: HTMLDivElement,
      item: IllegalDropEventRecord | MixedIntoEventRecord,
      img: HTMLImageElement
    ) {
      if (item && item.Data && item.Data.Objects) {
        const object = item.Data.Objects[0]
        element.style.position = 'absolute'
        let width = Math.abs(object.Polygon[1].X - object.Polygon[0].X)
        let height = Math.abs(object.Polygon[3].Y - object.Polygon[0].Y)
        let x = object.Polygon[0].X
        let y = object.Polygon[0].Y
        element.style.border = '1px solid red'

        element.style.width = width * 100 + '%'
        element.style.height = height * 100 + '%'

        element.style.top = y * 100 + '%'
        element.style.left = x * 100 + '%'
        element.parentElement!.style.position = 'absolute'
        element.parentElement!.style.pointerEvents = 'none'
      }
    }

    drawFrame2(
      item: IllegalDropEventRecord | MixedIntoEventRecord,
      img: HTMLImageElement
    ) {
      if (item && item.Data && item.Data.Objects) {
        const objects = item.Data.Objects

        const width = img.naturalWidth
        const height = img.naturalHeight

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.strokeStyle = 'red'
        ctx.drawImage(img, 0, 0, width, height)
        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i]
          if (!obj.Polygon) continue
          ctx.beginPath()
          const first = obj.Polygon[0]
          let x = first.X * width
          let y = first.Y * height

          ctx.moveTo(x, y)

          for (let j = obj.Polygon.length - 1; j >= 0; j--) {
            const point = obj.Polygon[j]
            x = point.X * width
            y = point.Y * height
            ctx.lineTo(x, y)
            ctx.stroke()
          }
          ctx.closePath()

          return ctx.canvas.toDataURL()
        }
      }
    }

    drawFrame(
      item: IllegalDropEventRecord | MixedIntoEventRecord,
      width: number,
      height: number,
      element?: HTMLDivElement
    ) {
      if (item && item.Data && item.Data.Objects) {
        const objects = item.Data.Objects

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.strokeStyle = 'red'
        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i]
          if (!obj.Polygon) continue
          ctx.beginPath()
          const first = obj.Polygon[0]
          let x = first.X * width
          let y = first.Y * height

          ctx.moveTo(x, y)

          for (let j = obj.Polygon.length - 1; j >= 0; j--) {
            const point = obj.Polygon[j]
            x = point.X * width
            y = point.Y * height
            ctx.lineTo(x, y)
            ctx.stroke()
          }
          ctx.closePath()

          if (element) {
            element.style.backgroundImage =
              "url('" + ctx.canvas.toDataURL() + "')"
          }
          return ctx.canvas.toDataURL()
        }
      }
    }
  }

  class Page {
    record?: EventDetail
    constructor() {}

    async run() {
      let client = new HowellHttpClient.HttpClient().login(async (http) => {
        let user = new SessionUser()

        let type = user.WUser.Resources![0].ResourceType
        let service = new Service(http)
        let dataController = ControllerFactory.Create(
          service,
          type,
          user.WUser.Resources!
        )

        this.record = new EventDetail(dataController, user)
      })
    }
  }

  let page = new Page()
  page.run()
}
