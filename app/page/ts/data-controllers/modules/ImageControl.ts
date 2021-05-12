import Swiper, { Pagination, Virtual } from 'swiper';
import { IImageUrl } from '../ViewModels';
import { VideoPlugin } from './VideoPlugin';

Swiper.use([Pagination, Virtual])

declare var $: any;

export class ImageController {

  swiper?: Swiper;
  originImg: HTMLDivElement;
  swiperStatus: boolean = false;
  originStatus: boolean = false;
  private img?: HTMLImageElement;
  constructor(selectors: string) {
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
        click: (e, a) => {

          let path = ((a.composedPath && a.composedPath()) || a.path) as HTMLElement[];          
          if (path) {
            for (let i = 0; i < path.length; i++) {
              if (path[i].className == "video-control") {
                this.onPlayControlClicked(this.imageUrls![this.swiper!.activeIndex], path[i] as HTMLDivElement);
                return;
              }
              if (path[i].className == "tools") {                
                return;
              }
            }
          }
          $(this.originImg).fadeOut(() => {
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


  showDetail(selectors: { frameId?: string, imgId: string }, urls: IImageUrl[], index: number = 0) {
    this.imageUrls = urls;
    for (let i = 0; i < urls.length; i++) {

      let container = this.createSwiperContainer(selectors, urls[i]);
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

  createSwiperContainer(selector: { frameId?: string, imgId: string }, imageUrl: IImageUrl) {
    let container = document.createElement("div");
    container.className = "swiper-zoom-container";

    this.img = document.createElement("img");
    this.img.id = selector.imgId;
    this.img.src = imageUrl.url;
    
    container.appendChild(this.img);

    if (selector.frameId) {
      let frame = document.createElement("img");
      frame.className = "max-frame";
      frame.id = selector.frameId;
      container.appendChild(frame);
    }

    let control = document.createElement("div");
    control.className = "video-control";
    control.data = imageUrl;
    let icon = document.createElement("i");
    icon.className = "howell-icon-real-play"
    control.appendChild(icon);

    container.appendChild(control);

    return container;
  }


  video?: VideoPlugin;
  onPlayControlClicked(index: IImageUrl, div: HTMLDivElement) {
    if (this.video) {
      this.video.destory();
      this.video = undefined;
    }
    let img = div.data as IImageUrl;
    if (!img) {
      img = index;
    }
    if (img.playback) {
      img.playback.then(x => {
        this.video = new VideoPlugin("", x.Url, x.WebUrl);
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