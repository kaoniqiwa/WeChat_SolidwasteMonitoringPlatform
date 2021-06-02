/**
 *  pmx
 */

import weui from 'weui.js/dist/weui.js';
import "weui";
import "../css/myDatePicker.less"
import ISubject from './IAside';

interface MyWeuiOptions {
  type: string;
  el: string; // 触发功能的元素选择器
}
export default class MyWeui extends ISubject {
  static parser = new DOMParser();

  // selectors: Map<string, HTMLElement | null> = new Map(
  // );

  // date: Date;
  options: Array<MyWeuiOptions> = []
  constructor(options: Array<MyWeuiOptions>) {
    super();
    // options.forEach(option => {
    //   this.selectors.set(option.type, document.querySelector(option.el) as HTMLElement)
    // })

    // this.bindEvent()
  }
  // bindEvent() {
  //   for (let [k, v] of this.selectors) {
  //     if (v) {

  //       v.addEventListener('click', Reflect.get(this, k).bind(this))
  //     }
  //   }
  // }
  datePicker() {
    weui.datePicker({
      start: new Date(2020, 12 - 1, 1),
      end: new Date(),
      onChange: (result: any) => {

      },
      onConfirm: (result: any) => {
        let date = new Date(result[0].value, result[1].value - 1, result[2].value);
        this.notify({
          type: 'weui-datePicker',
          value: date
        })

      },
      title: '请选择日期'
    });
  }
  alert() {
    weui.alert('普通的alert');
    this.notify({
      type: 'weui-alert',
      value: '普通的alert'
    })

  }
  static toast() {
    let html = `
    <div id="toast" style="display: none">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
        <p class="weui-toast__content">已完成</p>
      </div>
    </div>
    `
    return this.generate(html, '#toast');
  }
  static warnToast() {
    let html = `
      <div id="warnToast" style="display: none">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-icon-warn weui-icon_toast"></i>
          <p class="weui-toast__content">获取链接失败</p>
        </div>
      </div>
    `

    return this.generate(html, '#warnToast');

  }
  static textToast() {
    let html = `
    <div id="textToast" style = "display: none" >
      <div class="weui-mask_transparent" > </div>
      <div class="weui-toast weui-toast_text" >
          <p class="weui-toast__content" > 文字提示 < /p>
      </div>
    </div>
   `
    return this.generate(html, '#textToast');

  }
  static generate(content: string, selector: string) {
    let el = document.body.querySelector(selector) as HTMLElement;
    if (!el) {
      let htmlDoc = this.parser.parseFromString(content, 'text/html');
      el = htmlDoc.querySelector(selector) as HTMLDivElement;
      document.body.appendChild(el);
    }
    return el
  }
  notify(args: any) {
    this.observerList.forEach(observer => {
      observer.update(args)
    })
  }
}