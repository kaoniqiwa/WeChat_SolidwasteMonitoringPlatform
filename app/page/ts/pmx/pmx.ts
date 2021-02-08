import mySwiper from './mySwiper';




interface StorageOption {
  data?: any;
  elements?: any;
}

class PMX {
  private _storage: StorageOption;
  private swiper: mySwiper;

  constructor(selector: string) {
    this._storage = {
      elements: {
        target: document.querySelector(selector),
        zoomOut: document.querySelector(`${selector} .zoomOut`),
        zoomIn: document.querySelector(`${selector} .zoomIn`),
      }
    }
    this.swiper = new mySwiper(`${selector} .swiper-container`, {
    })

    this.init();

  }
  init() {
    this.bindEvents();
  }
  show() {

  }
  bindEvents() {
    this._storage.elements.zoomOut.addEventListener("click", this.zoomOut.bind(this))
    this._storage.elements.zoomIn.addEventListener("click", this.zoomIn.bind(this))
  }
  zoomOut() {

    this.swiper.zoomOut();
  }
  zoomIn() {

    this.swiper.zoomIn();
  }
}
let demo01 = new PMX('#demo01');
let demo02 = new PMX('#demo02');
