import setUserLabelTemplate from '../garbagestation/garbage-station-details-user-label-set.html'
import '../css/aside.less'
import '../css/header.less'
import '../css/garbagestation/userLabel.css'
import AsideModel from './data-controllers/modules/AsideModel/AsideModel'
import { GarbageStationViewModel } from './data-controllers/ViewModels'
import { UserLabel } from '../../data-core/model/user-stystem'
import { IGarbageStationController } from './data-controllers/modules/IController/IGarbageStationController'

export default class SetUserLabelAside extends AsideModel {
  get name() {
    return this.innerContainer.querySelector(
      '#user-label-name'
    ) as HTMLInputElement
  }

  get phoneNumber() {
    return this.innerContainer.querySelector(
      '#user-label-phone-number'
    ) as HTMLInputElement
  }

  get title() {
    return this.innerContainer.querySelector('.title') as HTMLDivElement
  }

  onInnerBackClicked = () => {
    this.notify({
      showUserLabel: false,
    })
  }
  constructor(
    selector: HTMLElement | string,
    private data: GarbageStationViewModel,
    private dataController: IGarbageStationController,
    private label: UserLabel
  ) {
    super(selector, setUserLabelTemplate)
  }

  init(key?: string) {
    super.init()

    this.title.innerHTML = '修改联系人'
    this.name.value = this.label.LabelName ?? ''
    this.phoneNumber.value = this.label.Content ?? ''

    let button = this.innerContainer.querySelector('.button') as HTMLLinkElement
    button.addEventListener('click', () => {
      this.set().then((x) => {
        if (x) {
          this.onInnerBackClicked()
        }
      })
    })

    if (key) {
      ;(function (_this, key) {
        let element = _this.innerContainer.querySelector('#' + key)
        if (element) {
          setTimeout(() => {
            ;(element as HTMLInputElement).focus()
          }, 500)
        }
      })(this, key)
    }
  }

  set() {
    if (!this.name.value) {
      alert('请填写联系人姓名')
      return new Promise<boolean>((x) => {
        return false
      })
    }
    if (!this.phoneNumber.value) {
      alert('请填写联系电话')
      return new Promise<boolean>((x) => {
        return false
      })
    }
    return this.dataController.userLabel.update(
      this.data.Id,
      this.name.value,
      this.phoneNumber.value
    )
  }
}
