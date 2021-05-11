import Swiper from "swiper"




export class LoopPageControl {

  swiper!: Swiper;
  element: HTMLElement | null;

  callback?: (index: number, element: HTMLElement) => void;
  loaded?: (element: HTMLElement) => void;

  constructor(selectors: HTMLElement | string, events: {
    loaded?: (element: HTMLElement) => void,
    callback?: (index: number, element: HTMLElement) => void
  }) {
    if (typeof selectors === "string") {
      this.element = document.querySelector(selectors);
    }
    else {
      this.element = selectors;
    }
    this.callback = events.callback;
    this.loaded = events.loaded;
  }

  init(index: number = 0) {
    if (this.element) {
      this.swiper = new Swiper(this.element, {
        noSwiping: true,
        noSwipingSelector: 'img',
        initialSlide: index,
        on: {
          init: (sw: any) => {
            try {
              // console.log(sw);
              if (this.loaded) {
                this.loaded(sw.slides[sw.activeIndex]);
              }
            } catch (ex) {
              console.error(ex);
            }
          },
          slideChange: (sw: any) => {
            try {
              // console.log(sw);
              if (this.callback) {
                this.callback(sw.snapIndex, sw.slides[sw.activeIndex]);
              }
            } catch (ex) {
              console.error(ex);
            }
          }
        }
      })
    }
  }
}