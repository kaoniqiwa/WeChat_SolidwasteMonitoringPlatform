import { dateFormat, getElement } from '../../../../common/tool'

declare var weui: any
export default class DatePicker {
  date: Date
  picker: HTMLDivElement
  view: HTMLDivElement
  constructor(
    date: Date,
    element: {
      view: HTMLDivElement | string
      picker: HTMLDivElement | string
    }
  ) {
    this.date = date
    this.view = getElement(element.view) as HTMLDivElement
    this.picker = getElement(element.picker) as HTMLDivElement
    this.init()
  }

  load?: (date: Date) => void

  init() {
    try {
      this.picker.addEventListener('click', () => {
        weui.datePicker({
          start: new Date(2020, 12 - 1, 1),
          end: new Date(),
          onChange: function (result: any) {},
          onConfirm: (result: any) => {
            this.date = new Date(
              result[0].value,
              result[1].value - 1,
              result[2].value
            )

            if (this.load) {
              this.load(this.date)
            }
            this.view.innerHTML = dateFormat(this.date, 'yyyy年MM月dd日')
          },
          title: '请选择日期',
        })
      })
      this.view.innerHTML = dateFormat(this.date, 'yyyy年MM月dd日')
    } catch (ex) {
      console.error(ex)
    }
  }
}
