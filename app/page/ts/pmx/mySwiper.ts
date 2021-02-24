import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types/swiper-options'


interface StorageOption {
    data: any;
    elements: {
        slides?:Array<HTMLElement>
    }
}

class mySwiper {
    private _swiper: Swiper;
    private _storage: StorageOption;
    private _target: HTMLDivElement;

    constructor(target: HTMLDivElement | string, options?: SwiperOptions) {


        if (typeof target == 'string') {
            this._target = target = document.querySelector(target) as HTMLDivElement;
        }
        
        this._target = target;
    
        this._storage = {
            data: {
                containerWidth: target.clientWidth,
                containerHeight: target.clientHeight,
                slideWidth: target.querySelector('.swiper-slide')?.clientWidth,
                slideHeight: target.querySelector('.swiper-slide')?.clientHeight,
            },
            elements: {
                slides:Array.from(target.querySelectorAll('.swiper-slide')) as HTMLElement[]
            }
        }



        this._swiper = new Swiper(target, Object.assign(
            {
                init: false,
                on: {
                    beforeDestroy: (swiper: Swiper) => {
                        // this.reset()
                    }
                }
            },
            options))

        console.log('myswiper', this._storage)

    }
    init() {
    }
    zoomOut() {
        console.log('缩小')

        if (Reflect.get(this._swiper, 'initialized')) {
            // 清除所有样式 removeAttribute('style)
            this._swiper.destroy(false, true)
        }


    }
    zoomIn() {
        console.log('放大')
        console.log('initialized', Reflect.get(this._swiper, 'initialized'))

        // 如果initialized为false，则调用init()
        if (!Reflect.get(this._swiper, 'initialized')) {
            this._target.scrollLeft = 0;
            this._target.style.overflow = 'hidden';

            // slides会自动设置宽度，根据比例手动设置高度
            let h = this._storage.data.containerWidth / this._storage.data.slideWidth * this._storage.data.slideHeight;
            this._storage.elements.slides?.forEach(item=>{
                item.style.height = h+'px'
            })
            this._swiper.init();

            // 必须设为false
            this._swiper.destroyed = false;
        }

    }
}


export default mySwiper;

