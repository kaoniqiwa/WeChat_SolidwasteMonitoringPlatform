import Swiper, { Pagination, Virtual } from 'swiper';
import { IImageUrl, IPictureController } from '../ViewModels';
import { VideoPlugin } from './VideoPlugin';

Swiper.use([Pagination, Virtual])

declare var $: any;

export class ImageController {

  swiper?: Swiper;
  originImg: HTMLDivElement;
  swiperStatus: boolean = false;
  originStatus: boolean = false;
  private img?: HTMLImageElement;
  constructor(selectors: string, private picture: IPictureController) {
    this.originImg = document.querySelector(selectors) as HTMLDivElement;
    this.init();
  }

  init() {
    let inited = false;
    this.swiper = new Swiper(this.originImg, {
      zoom: true,
      width: window.innerWidth,
      virtual: true,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      on: {
        touchEnd: (e, a) => {
          let path = ((a.composedPath && a.composedPath()) || a.path) as HTMLElement[];
          if (path) {
            for (let i = 0; i < path.length; i++) {
              if (path[i].className == "video-control") {
                this.onPlayControlClicked(this.imageUrls![this.swiper!.activeIndex], path[i] as HTMLDivElement, this.picture);
                return;
              }
              if (path[i].className == "tools" || path[i].className == "capturePicture") {
                return;
              }
              if (path[i].tagName == "IMG") {
                return;
              }
            }
          }
          $(this.originImg).fadeOut(() => {
            if (this.video) {
              this.video.destory();
              this.video = undefined;
            }
            this.originStatus = false;
          })

          this.swiper!.virtual.slides.length = 0;
          this.swiper!.virtual.cache = [];
          this.swiperStatus = false;
        }, init: (swiper: Swiper) => {

          if (this.video) {
            this.video.destory();
            this.video = undefined;
          }

        },
        slideChange: (swiper: Swiper) => {
          if (this.video) {
            this.video.destory();
            this.video = undefined;
          }
        }
      },

    });
  }


  imageUrls?: IImageUrl[];


  showDetail(selectors: { frameId?: string, imgId: string }, urls: IImageUrl[], video: boolean, index: number = 0) {
    this.imageUrls = urls;
    for (let i = 0; i < urls.length; i++) {

      let container = this.createSwiperContainer(selectors, urls[i], video);
      this.swiper!.virtual.appendSlide(container.outerHTML);
      // this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img id="' + selectors.imgId + '" src="' + urls[i].url +
      //     '" />' + (selectors.frameId ? '<img class="max-frame" id="' + selectors.frameId + '">' : '') + '</div>');
    }
    //this.swiper.slideTo(index);

    $(this.originImg).fadeIn(() => {
      this.originStatus = true;
    })
    this.swiperStatus = true;
  }

  createSwiperContainer(selector: { frameId?: string, imgId: string }, imageUrl: IImageUrl, video: boolean) {
    let container = document.createElement("div");
    container.className = "swiper-zoom-container";

    this.img = document.createElement("img");
    if (imageUrl.cameraName) {
      this.img.alt = imageUrl.cameraName;
    }
    this.img.id = selector.imgId;
    this.img.src = imageUrl.url;

    container.appendChild(this.img);

    if (selector.frameId) {
      let frame = document.createElement("img");
      frame.className = "max-frame";
      frame.id = selector.frameId;
      container.appendChild(frame);
    }
    if (video) {
      let control = document.createElement("div");
      control.className = "video-control";
      control.data = imageUrl;
      // let icon = document.createElement("img");
      // icon.src = "/img/player.png"
      // control.appendChild(icon);
      container.appendChild(control);
    }
    return container;
  }


  video?: VideoPlugin;

  onPlayControlClicked(index: IImageUrl, div: HTMLDivElement, picture: IPictureController) {
    if (this.video) {
      this.video.destory();
      this.video = undefined;
    }
    let img = div.data as IImageUrl;
    if (!img) {
      img = index;
    }

    let width = (document.querySelector(".swiper-slide.page") as HTMLDivElement).style.width;
    let wrapper_width = (document.querySelector(".swiper-wrapper.page") as HTMLDivElement).clientWidth;
    if (img.playback) {
      img.playback.then(x => {
        this.video = new VideoPlugin("", x.Url, x.WebUrl, picture);
        this.video.onFullscreenChanged = (is) => {
          let pagination = document.querySelector(".swiper-pagination.swiper-pagination-fraction") as HTMLDivElement;
          if (!pagination) return;

          if (is) {
            pagination.style.display = "none";
          }
          else {

            pagination.style.display = "";
          }
        }
        if (this.video.iframe) {
          this.video.autoSize();
          if (div.parentElement) {
            this.video.loadElement(div.parentElement, 'vod');
          }
        }
      })
    }
  }
}