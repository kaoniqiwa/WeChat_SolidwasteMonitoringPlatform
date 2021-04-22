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

import { HttpResponse } from "../../data-core/model/response";
import { Flags, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { ResourceRole, ResourceType } from "../../data-core/model/we-chat";
import ISubject from "./ISubject";

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

export default class MyAside extends ISubject {
    outterContainer: HTMLElement;// 装在侧边栏的外部容器
    elements: {
        [key: string]: any
    } = {

        }
    selectedItems: Set<HTMLDivElement> = new Set();// 方便删除元素

    selectedFilter: Set<HTMLDivElement> = new Set();
    // 使用数据拦截，实现数据单向绑定
    _title: string;
    get title() {
        return this._title;
    }
    set title(val) {
        if (this.elements.content && this.elements.content.roleTitle)
            this.elements.content.roleTitle.textContent = val;
        this._title = val;
    }
    _data: ResourceRole[];

    get data() {
        return this._data;

    }
    set data(val: ResourceRole[]) {
        if (this.elements.content && this.elements.content.roleContent) {
            // 一定要清
            this.elements.content.roleContent.innerHTML = '';
            let fragment = document.createDocumentFragment();
            val.forEach((item, index) => {
                let el: HTMLDivElement = document.createElement('div');
                el.className = 'inner-item';
                el.textContent = item.Name;
                el.setAttribute('id', item.Id)
                fragment.appendChild(el);
            })
            this.elements.content.roleContent.appendChild(fragment)
        }
        this._data = val;
    }

    // 理论上应使用 JSX，暂且用模板字符串方式
    template: string = `
    <div class="inner-mask"></div>
    <div class='inner-content'>
        <div class='inner-title'>筛选</div>
        <div class='inner-main' id='filter-content'>
            <div class='inner-item normal1' data-state='0'>正常</div>
            <div class='inner-item full1' data-state='1'>满溢</div>
            <div class='inner-item error1' data-state='2'>异常</div>
        </div>
        <div class='inner-title' id="role-title"> </div>
        <div class='inner-main' id='role-content'>
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
                roleTitle: this.innerContainer.querySelector('#role-title'),
                roleContent: this.innerContainer.querySelector('#role-content') as HTMLDivElement,
                filterContent: this.innerContainer.querySelector('#filter-content') as HTMLDivElement,

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
        let _self = this;
        if (this.elements.content && this.elements.content.roleContent) {

            this.elements.content.roleContent.addEventListener('click', function (e: MouseEvent) {
                let target = e.target as HTMLDivElement;
                // 点击的是 inner-item 项
                if (target.classList.contains('inner-item')) {

                    // 单选模式
                    if (_self.mode == SelectionMode.single) {
                        if (_self.selectedItems.has(target)) {
                            _self.selectedItems.clear();
                            target.classList.remove('selected');
                        } else {
                            // 虽然单选只有一个
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
            })
        }
        if (this.elements.footer && this.elements.footer.resetBtn) {
            this.elements.footer.resetBtn.addEventListener('click', () => {
                for (let item of this.selectedItems.values()) {
                    item.classList.remove('selected')
                }
                this.selectedItems = new Set();

                for (let item of this.selectedFilter.values()) {
                    item.classList.remove('selected')
                }
                this.selectedFilter = new Set();

            })
        }
        if (this.elements.footer && this.elements.footer.confirmBtn) {
            this.elements.footer.confirmBtn.addEventListener('click', () => {
                this.notify({
                    selectedItems: this.selectedItems,
                    selectedFilter: this.selectedFilter,
                    show: false,

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
        if (this.elements.content.filterContent) {
            this.elements.content.filterContent.addEventListener('click', function (e: MouseEvent) {
                let target = e.target as HTMLDivElement;
                // 点击的是 inner-item 项
                if (target.classList.contains('inner-item')) {

                    if (_self.mode == SelectionMode.single) {
                        if (_self.selectedFilter.has(target)) {
                            _self.selectedFilter.clear();
                            target.classList.remove('selected');
                        } else {
                            for (let item of _self.selectedFilter.values()) {
                                item.classList.remove('selected')
                            }
                            _self.selectedFilter = new Set([target])
                            target.classList.add('selected');
                        }
                    } else if (_self.mode == SelectionMode.multiple) {
                        if (_self.selectedFilter.has(target)) {
                            _self.selectedFilter.delete(target);
                        } else {
                            _self.selectedFilter.add(target);
                        }
                        if (!target.classList.contains('selected')) {
                            target.classList.add('selected');
                        } else {
                            target.classList.remove('selected')
                        }

                    }


                }
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