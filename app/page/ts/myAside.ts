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

import { HttpResponse } from "../../data-core/model/response";
import { Flags, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import ISubject from "./ISubject";

import "../css/myAside.css"

interface MyAsideOptions {
  title: string;
  data: any[];
  type: string;
  shrink?: boolean;
  mode?: SelectionMode
}

export enum SelectionMode {
  single,
  multiple
}

export default class MyAside extends ISubject {
  outterContainer: HTMLElement;// 装在侧边栏的外部容器
  elements: {
    [key: string]: any
  } = {

    }
  filter: Map<string, Set<HTMLElement>> = new Map();
  filterMode: Map<string, number> = new Map();

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
  innerContainer: HTMLDivElement = document.createElement("div");

  constructor(selector: HTMLElement | string, private options: Array<MyAsideOptions>) {
    super();
    this.outterContainer = typeof selector == "string" ? document.querySelector(selector) as HTMLElement : selector;

    this.innerContainer.classList.add("aside-inner-container");
    this.innerContainer.innerHTML = this.template;


    this.elements = {
      mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
      content: {
        innerPage: this.innerContainer.querySelector('.inner-page') as HTMLDivElement,
        innerMain: this.innerContainer.querySelector('.inner-main') as HTMLDivElement,
      },
      footer: {
        resetBtn: this.innerContainer.querySelector('.inner-reset') as HTMLDivElement,
        confirmBtn: this.innerContainer.querySelector('.inner-confirm') as HTMLDivElement
      }
    }

  }
  init() {
    this.outterContainer.innerHTML = '';
    this.outterContainer.appendChild(this.innerContainer);

    // 根据数据创建内容
    this.options.forEach(option => {
      let card = document.createElement('div');
      card.className = 'inner-card';

      card.setAttribute('select-mode', option.mode + '')
      if (option.shrink === false)
        card.classList.add('no-shrink');

      let div_title = document.createElement('div');
      div_title.className = 'inner-title';
      div_title.textContent = option.title;
      card.appendChild(div_title);

      let div_content = document.createElement('div');
      div_content.className = 'inner-content';
      card.appendChild(div_content);

      option.data.forEach(val => {
        let div_item = document.createElement('div');
        div_item.setAttribute('type', option.type);
        div_item.textContent = val.Name;
        div_item.setAttribute('id', val.Id);
        div_item.className = 'inner-item'
        div_content.appendChild(div_item)
      })

      this.filter.set(option.type, new Set());
      this.filterMode.set(option.type, option.mode ?? 0);
      this.elements.content.innerMain.appendChild(card)
    })
    this.bindEvents()

    return this;
  }
  bindEvents() {
    let _self = this;
    if (this.elements.content && this.elements.content.innerMain) {

      this.elements.content.innerMain.addEventListener('click', function (e: MouseEvent) {
        let target = e.target as HTMLDivElement;
        // 点击的是 inner-item 项
        if (target.classList.contains('inner-item')) {

          let type = target.getAttribute('type');
          let mode = _self.filterMode.get(type) ?? 0;
          // 单选模式
          if (mode == SelectionMode.single) {
            if (_self.filter.has(type)) {
              let mySet = _self.filter.get(type);


              if (mySet.has(target)) {
                mySet.clear();
                target.classList.remove('selected');
              } else {
                // 虽然单选只有一个
                for (let item of mySet.values()) {
                  item.classList.remove('selected')
                }
                mySet.clear();
                mySet.add(target)
                target.classList.add('selected');
              }
            }
          } else if (mode == SelectionMode.multiple) {
            if (_self.filter.has(type)) {
              let mySet = _self.filter.get(type);

              if (mySet.has(target)) {
                mySet.delete(target);
              } else {
                mySet.add(target);
              }
              if (!target.classList.contains('selected')) {
                target.classList.add('selected');
              } else {
                target.classList.remove('selected')
              }

            }
          }

        }
      })
    }
    if (this.elements.footer && this.elements.footer.resetBtn) {
      this.elements.footer.resetBtn.addEventListener('click', () => {
        for (let [k, v] of this.filter) {
          [...v].forEach(item => {
            item.classList.remove('selected')
          })
          v.clear()
        }

      })
    }
    if (this.elements.footer && this.elements.footer.confirmBtn) {
      this.elements.footer.confirmBtn.addEventListener('click', () => {
        this.notify({
          show: false,
          filtered: this.filter,
          type: 'my-aside',
        })
        this.slideOut()
      })
    }
    if (this.elements.mask) {
      this.elements.mask.addEventListener('click', () => {
        this.notify({
          show: false,
          type: 'my-aside',
        })
        this.slideOut()
      })
    }
  }
  slideIn() {
    this.elements.content.innerPage.classList.add('slideIn')
  }
  slideOut() {
    this.elements.content.innerPage.classList.remove('slideIn');
  }

}