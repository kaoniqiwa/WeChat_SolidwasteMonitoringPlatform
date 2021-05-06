import Swiper,{Pagination,Virtual} from 'swiper';
import { IImageUrl } from '../ViewModels';

Swiper.use([Pagination,Virtual])

declare var $: any;

export class ImageController {

    swiper:  Swiper;
    originImg: HTMLDivElement;
    swiperStatus: boolean = false;
    originStatus: boolean = false;
    constructor(selectors: string) {
        this.originImg = document.querySelector(selectors) as HTMLDivElement;
        this.init();
    }

    init() {
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
                click: () => {

                    $(this.originImg).fadeOut(() => {
                        this.originStatus = false;
                    })

                    this.swiper.virtual.slides.length = 0;
                    this.swiper.virtual.cache = [];
                    this.swiperStatus = false;
                },
            },

        });
    }

    showDetail(selectors: { frameId?: string, imgId: string }, urls: IImageUrl[], index: number = 0) {
        for (let i = 0; i < urls.length; i++) {
            this.swiper.virtual.appendSlide('<div class="swiper-zoom-container"><img id="' + selectors.imgId + '" src="' + urls[i] +
                '" />' + (selectors.frameId ? '<img class="max-frame" id="' + selectors.frameId + '">' : '') + '</div>');
        }
        //this.swiper.slideTo(index);

        $(this.originImg).fadeIn(() => {
            this.originStatus = true;
        })
        this.swiperStatus = true;

    }
    hideDetail() {


    }
}