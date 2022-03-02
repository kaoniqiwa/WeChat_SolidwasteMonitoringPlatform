console.log('hello')

declare var Swiper: any
// let navBar = ["垃圾落地", "满溢情况", "混合投放"]
// new Swiper(".swiper-container", {
//     on: {
//         slideChangeTransitionEnd: function (this: any) {
//             // console.log(this.activeIndex)
//             let activeIndex = this.activeIndex;
//             this.pagination.bullets[activeIndex].scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start',
//                 inline: 'nearest'
//             })
//         }
//     },
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//         renderBullet: function (index: number, className: string) {
//             return `
//                 <div class="${className}">${navBar[index]}</div>
//             `
//         }
//     },
// })

export class SwiperControl {
  navBar: string[]
  callback?: (index: number) => void
  selectors: {
    container: string
    pagination: string
  }
  initialSlide: number = 0
  constructor(opts: {
    selectors: {
      container: string
      pagination: string
    }
    navBar: string[]
    callback?: (index: number) => void
    initialSlide: number
  }) {
    this.selectors = opts.selectors
    this.navBar = opts.navBar
    this.callback = opts.callback
    this.initialSlide = opts.initialSlide
    this.init()
  }

  init() {
    new Swiper(this.selectors.container, {
      on: {
        init: () => {
          console.log('Swiper init')
          if (this.callback) {
            this.callback(this.initialSlide)
          }
        },
        slideChange: (sw: any) => {
          console.log(sw.activeIndex)
          if (sw.pagination.bullets) {
            let activeIndex = sw.activeIndex

            sw.pagination.bullets[activeIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            })
          }
          try {
            if (this.callback) {
              this.callback(sw.snapIndex)
            }
          } catch (ex) {
            console.error(ex)
          }
        },
      },
      pagination: {
        el: this.selectors.pagination,
        clickable: true,
        renderBullet: (index: number, className: string) => {
          return `
                        <div class="${className}">${this.navBar[index]}</div>            
                    `
        },
      },
      initialSlide: this.initialSlide,
    })
  }
}
