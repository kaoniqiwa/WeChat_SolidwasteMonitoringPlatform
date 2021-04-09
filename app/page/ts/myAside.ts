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
       */

import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import IAside from "./IAside";

// 理论上应脱离html文档，动态导入 aside.css，受项目配置限制，无法实现
//import "../css/aside.css"

interface MyAsideOptions {
    title: string;
    data: ResourceRole[];
}

export enum SelectionMode {
    single,
    multiple
}

export default class MyAside extends IAside {
    outterContainer: HTMLElement;// 装在侧边栏的外部容器
    elements: {
        [key: string]: any
    } = {

        }
    selectedItems: Set<HTMLDivElement> = new Set();// 方便删除元素
    // 使用数据拦截，实现数据单向绑定
    _title: string;
    get title() {
        return this._title;
    }
    set title(val) {
        if (this.elements.content && this.elements.content.title)
            this.elements.content.title.textContent = val;
        this._title = val;
    }
    _data: ResourceRole[];

    get data() {
        return this._data;

    }
    set data(val: ResourceRole[]) {
        if (this.elements.content && this.elements.content.asideMain) {
            // 一定要清
            this.elements.content.asideMain.innerHTML = '';
            let fragment = document.createDocumentFragment();
            val.forEach((item, index) => {
                let el: HTMLDivElement = document.createElement('div');
                el.className = 'inner-item';
                el.textContent = item.Name;
                el.setAttribute('id', item.Id)
                fragment.appendChild(el);
            })
            this.elements.content.asideMain.appendChild(fragment)
        }
        this._data = val;
    }

    // 理论上应使用 JSX，暂且用模板字符串方式
    template: string = `
    <div class="inner-mask"></div>
    <div class='inner-content'>
         <div class='inner-title'>
        </div>
        <div class='inner-main'>
            <div class='inner-item'></div>
        </div>
        <div class='inner-footer'>
            <div class='inner-btn inner-reset'>重置</div>
            <div class='inner-btn inner-confirm'>确认</div>
        </div>
    </div>
    `
    innerContainer: HTMLDivElement = document.createElement("div");

    constructor(selector: HTMLElement | string, private options: MyAsideOptions, private mode: SelectionMode) {
        super();
        this.outterContainer = typeof selector == "string" ? document.querySelector(selector) as HTMLElement : selector;

        this.innerContainer.classList.add("aside-inner-container");
        this.innerContainer.innerHTML = this.template;

    }
    init() {
        this.outterContainer.innerHTML = '';
        this.outterContainer.appendChild(this.innerContainer);

        this.elements = {
            mask: this.innerContainer.querySelector('.inner-mask') as HTMLDivElement,
            content: {
                innerContent: this.innerContainer.querySelector('.inner-content') as HTMLDivElement,
                title: this.innerContainer.querySelector('.inner-title'),
                asideMain: this.innerContainer.querySelector('.inner-main') as HTMLDivElement,
                asideTemplate: this.innerContainer.querySelector('#inner-template') as HTMLTemplateElement,
                asideItem: this.innerContainer.querySelector('.inner-item') as HTMLDivElement,
            },
            footer: {
                resetBtn: this.innerContainer.querySelector('.inner-reset') as HTMLDivElement,
                confirmBtn: this.innerContainer.querySelector('.inner-confirm') as HTMLDivElement
            }
        }

        this.title = this.options.title;


        this.data = [...this.options.data];

        this.bindEvents()

        return this;
    }
    bindEvents() {
        if (this.elements.content && this.elements.content.asideMain) {
            let _self = this;
            this.elements.content.asideMain.addEventListener('click', function (e: MouseEvent) {
                let target = e.target as HTMLDivElement;
                // 点击的是 inner-item 项
                if (target.classList.contains('inner-item')) {

                    // 单选模式
                    if (_self.mode == SelectionMode.single) {
                        if (_self.selectedItems.has(target)) {
                            _self.selectedItems.clear();
                            target.classList.remove('selected');
                        } else {
                            for (let item of _self.selectedItems.values()) {
                                item.classList.remove('selected')
                            }
                            _self.selectedItems = new Set([target])
                            target.classList.add('selected');
                        }
                    } else if (_self.mode == SelectionMode.multiple) {
                        if (_self.selectedItems.has(target)) {
                            _self.selectedItems.delete(target);
                        } else {
                            _self.selectedItems.add(target);
                        }
                        if (!target.classList.contains('selected')) {
                            target.classList.add('selected');
                        } else {
                            target.classList.remove('selected')
                        }
                    }


                }
                console.log(_self.selectedItems);
            })
        }
        if (this.elements.footer && this.elements.footer.resetBtn) {
            this.elements.footer.resetBtn.addEventListener('click', () => {
                for (let item of this.selectedItems.values()) {
                    item.classList.remove('selected')
                }
                this.selectedItems = new Set();
            })
        }
        if (this.elements.footer && this.elements.footer.confirmBtn) {
            this.elements.footer.confirmBtn.addEventListener('click', () => {
                this.notify({
                    selectedItems: this.selectedItems,
                    show: false
                })
                this.slideOut()
            })
        }
        if (this.elements.mask) {
            this.elements.mask.addEventListener('click', () => {
                this.notify({
                    show: false
                })
                this.slideOut()
            })
        }
    }
    slideIn() {
        this.elements.content.innerContent.classList.add('slideIn')
    }
    slideOut() {
        this.elements.content.innerContent.classList.remove('slideIn');
    }

}