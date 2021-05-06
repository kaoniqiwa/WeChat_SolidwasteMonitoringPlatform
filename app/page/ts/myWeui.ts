/**
 *  pmx
 */
import weui from 'weui.js';
import "weui";
import "../css/myDatePicker.less"
import ISubject from './ISubject';

interface MyWeuiOptions {
  type: string;
  el: string; // 触发功能的元素选择器
}
export default class MyWeui extends ISubject {
  selectors: Map<string, HTMLElement | null> = new Map(
    // [
    //   ['datePicker', null],
    //   ['toast', null],
    //   ['alert', null]
    // ]
  );

  date: Date;
  options: Array<MyWeuiOptions> = []
  constructor(options: Array<MyWeuiOptions>) {
    super();
    options.forEach(option => {
      this.selectors.set(option.type, document.querySelector(option.el) as HTMLElement)
    })

    this.bindEvent()
  }
  bindEvent() {
    for (let [k, v] of this.selectors) {
      if (v) {
        v.addEventListener('click', this[k].bind(this))
      }
    }
  }
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
  toast() {
    weui.toast('操作成功', {
      duration: 3000,
      className: 'custom-classname',
      callback: function () { console.log('close') }
    });
    this.notify({
      type: 'weui-toast',
      value: 'toast'
    })
  }
}