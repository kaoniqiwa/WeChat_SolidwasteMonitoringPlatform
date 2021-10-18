/**
        
*　　┏┓　　　┏┓+ +
*　┏┛┻━━━┛┻┓ + +
*　┃　　　　　　　┃ 　
*　┃　　　━　　　┃ ++ + + +
*  |  ████━████┃+
*　┃　　　　　　　┃ +
*　┃　　　┻　　　┃
*　┃　　　　　　　┃ + +
*　┗━┓　　　┏━┛
*　　　┃　　　┃　　　　　　　　　　　
*　　　┃　　　┃ + + + +
*　　　┃　　　┃
*　　　┃　　　┃ +  神兽保佑
*　　　┃　　　┃    代码无bug　　
*　　　┃　　　┃　　+　　　　　　　　　
*　　　┃　 　　┗━━━┓ + +
*　　　┃ 　　　　　　　┣┓
*　　　┃ 　　　　　　　┏┛
*　　　┗┓┓┏━┳┓┏┛ + + + +
*　　　　┃┫┫　┃┫┫
*　　　　┗┻┛　┗┻┛+ + + +
   pppmmmxxx
*/

import ISubject from './IAside'

import '../css/myAside.less'
import 'weui'
import $ from 'jquery'
import MyWeui from './myWeui'

export interface MyAsideData {
  Id: string
  Name?: string
  isSelected?: boolean
  [key: string]: any
}
// 构造函数参数类型
interface MyAsideOptions {
  title: string
  data?: MyAsideData[]
  type: string // 每块数据有不同的类型
  shrink?: boolean // 显示完整内容而不是滚动条显示
  mode?: SelectionMode // 单选模式或多选模式
  atLeastNum?: number // 至少被选中个数
}
// 内部类使用的数据结构
interface MyAsideObj {
  mode: SelectionMode
  atLeastNum: number
  title: string
}
export enum SelectionMode {
  single,
  multiple,
}

export default class MyAside extends ISubject {
  outterContainer: HTMLElement // 装载侧边栏的外部容器
  elements: { [key: string]: any } = {}

  // 返回给外部
  filterData: Map<string, Set<HTMLElement>> = new Map()

  // 内部使用
  filterObj: Map<string, MyAsideObj> = new Map()

  template: string = `
    <div class="inner-mask"></div>
    <div class='inner-page'>
        <div class='inner-main'></div>
        <div class='inner-footer'>
            <div class='inner-btn inner-reset'>重置</div>
            <div class='inner-btn inner-confirm'>确认</div>
        </div>
    </div>
    `
  // DOMParser
  innerContainer: HTMLDivElement = document.createElement('div')

  constructor(
    selector: HTMLElement | string,
    private options: Array<MyAsideOptions>
  ) {
    super()
    this.outterContainer =
      typeof selector == 'string'
        ? (document.querySelector(selector) as HTMLElement)
        : selector

    this.innerContainer.classList.add('aside-inner-container')
    this.innerContainer.innerHTML = this.template

    this.elements = {
      mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
      content: {
        innerPage: this.innerContainer.querySelector(
          '.inner-page'
        ) as HTMLDivElement,
        innerMain: this.innerContainer.querySelector(
          '.inner-main'
        ) as HTMLDivElement,
      },
      footer: {
        resetBtn: this.innerContainer.querySelector(
          '.inner-reset'
        ) as HTMLDivElement,
        confirmBtn: this.innerContainer.querySelector(
          '.inner-confirm'
        ) as HTMLDivElement,
      },
    }
  }
  init() {
    this.outterContainer.innerHTML = ''
    this.outterContainer.appendChild(this.innerContainer)

    // 根据数据创建内容
    this.options.forEach((option) => {
      let card = document.createElement('div')
      card.className = 'inner-card'

      option.mode = option.mode ?? SelectionMode.single
      option.atLeastNum = option.atLeastNum ?? 0

      this.filterData.set(option.type, new Set())

      this.filterObj.set(option.type, {
        mode: option.mode,
        atLeastNum: option.atLeastNum,
        title: option.title,
      })

      card.setAttribute('select-mode', option.mode + '')

      if (option.shrink === false) card.classList.add('no-shrink')

      let div_title = document.createElement('div')
      div_title.className = 'inner-title'
      div_title.textContent = option.title
      card.appendChild(div_title)

      let div_content = document.createElement('div')
      div_content.className = 'inner-content'
      card.appendChild(div_content)

      let fragment = document.createDocumentFragment()
      if (option.data) {
        option.data.forEach((val) => {
          let div_item = document.createElement('div')
          div_item.setAttribute('type', option.type)
          div_item.textContent = val.Name ?? ''
          div_item.setAttribute('id', val.Id)
          div_item.className = 'inner-item'

          if (val.isSelected) {
            div_item.classList.add('selected')
            this.filterData.get(option.type)?.add(div_item)
          }

          fragment.appendChild(div_item)
        })
      }

      div_content.appendChild(fragment)

      this.elements.content.innerMain.appendChild(card)
    })

    this.bindEvents()

    return this
  }
  notify(args: any) {
    this.observerList.forEach((observer) => {
      observer.update(args)
    })
  }
  bindEvents() {
    if (this.elements.content && this.elements.content.innerMain) {
      this.elements.content.innerMain.addEventListener('click', (e: Event) => {
        this.itemClick(e)
      })
    }
    if (this.elements.footer?.resetBtn) {
      this.elements.footer.resetBtn.addEventListener('click', () => {
        this.cancleClick()
      })
    }
    if (this.elements.footer?.confirmBtn) {
      this.elements.footer.confirmBtn.addEventListener('click', () => {
        this.confirmClick()
      })
    }
    if (this.elements.mask) {
      this.elements.mask.addEventListener('click', () => {
        this.maskClick()
      })
    }
  }
  itemClick(e: Event) {
    if (this.disabled) return
    let target = e.target as HTMLElement
    // 点击的是 inner-item 项
    if (target.classList.contains('inner-item')) {
      let type = target.getAttribute('type') ?? ''

      let mode = this.filterObj.get(type)?.mode ?? SelectionMode.single

      // 单选模式
      if (mode == SelectionMode.single) {
        if (this.filterData.has(type)) {
          let mySet = this.filterData.get(type)!
          if (mySet?.has(target)) {
            mySet.clear()
            target.classList.remove('selected')
          } else {
            // 虽然单选只有一个
            for (let item of mySet.values()) {
              item.classList.remove('selected')
            }
            mySet.clear()
            mySet.add(target)
            target.classList.add('selected')
          }
        }
      } else if (mode == SelectionMode.multiple) {
        if (this.filterData.has(type)) {
          let mySet = this.filterData.get(type)!

          if (mySet.has(target)) {
            mySet.delete(target)
          } else {
            mySet.add(target)
          }
          if (!target.classList.contains('selected')) {
            target.classList.add('selected')
          } else {
            target.classList.remove('selected')
          }
        }
      }
    }
  }
  confirmClick() {
    // console.log(this.filterObj)
    for (let [k, v] of this.filterObj) {
      // v.atLeastNum为0表示没有数量限制
      if (v.atLeastNum > 0) {
        // 选中个数小于要求的个数,则创建提示框
        if (this.filterData.get(k)?.size! < v.atLeastNum) {
          let $textToast = $(MyWeui.warnToast())
          $textToast
            .find('.weui-toast__content')
            .get(0).textContent = `至少选择${v.atLeastNum}个${v.title}`
          if ($textToast.css('display') != 'none') return
          $textToast.fadeIn(100)

          setTimeout(function () {
            $textToast.fadeOut(100)
          }, 1000)
          return
        }
      }
    }
    this.notify({
      show: false,
      filtered: this.filterData,
      type: 'my-aside',
    })
    this.slideOut()
  }
  cancleClick() {
    for (let [k, v] of this.filterData) {
      ;[...v].forEach((item) => {
        item.classList.remove('selected')
      })
      v.clear()
    }
  }
  maskClick() {
    this.notify({
      show: false,
      type: 'my-aside',
    })
    this.slideOut()
  }
  slideIn() {
    this.elements.content.innerPage.classList.add('slideIn')
  }
  slideOut() {
    this.elements.content.innerPage.classList.remove('slideIn')
  }

  private _disabled = false
  get disabled() {
    return this._disabled
  }
  set disabled(val: boolean) {
    if (this._disabled === val) return
    this._disabled = val
    if (this._disabled) {
      this.elements.content.innerPage.classList.add('disabled')
    } else {
      this.elements.content.innerPage.classList.remove('disabled')
    }
  }
}
