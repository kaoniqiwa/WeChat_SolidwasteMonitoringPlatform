import setUserLabelTemplate from '../garbagestation/garbage-station-details-user-label-set.html'
import '../css/aside.less'
import '../css/header.less'
import '../css/garbagestation/userLabel.css'

import AsideModel from './data-controllers/modules/AsideModel/AsideModel'
import { GarbageStationViewModel } from './data-controllers/ViewModels'
import { IGarbageStationController } from './data-controllers/modules/IController/IGarbageStationController'
import detailsTemplate from '../garbagestation/garbage-station-details.html'
export default class CreateUserLabelAside extends AsideModel {
  get name() {
    return (
      this.innerContainer.querySelector('#user-label-name') as HTMLInputElement
    ).value
  }

  get phoneNumber() {
    return (
      this.innerContainer.querySelector(
        '#user-label-phone-name'
      ) as HTMLInputElement
    ).value
  }
  onInnerBackClicked = (create: boolean = false) => {
    let params = {
      showUserLabel: false,
      id: `user-label-${this.data.Id}`,
      mode: '',
    }
    if (create) {
      params.mode = 'create'
    }
    this.notify(params)
  }
  constructor(
    selector: HTMLElement | string,
    private data: GarbageStationViewModel,
    private dataController: IGarbageStationController
  ) {
    super(selector, setUserLabelTemplate, detailsTemplate)
  }

  init() {
    super.init()

    let button = this.innerContainer.querySelector('.button') as HTMLLinkElement
    button.addEventListener('click', () => {
      this.create().then((x) => {
        if (x) {
          this.onInnerBackClicked(x)
        }
      })
    })
  }

  create() {
    if (!this.name) {
      alert('请填写联系人姓名')
      return new Promise<boolean>((x) => false)
    }
    if (!this.phoneNumber) {
      alert('请填写联系电话')
      return new Promise<boolean>((x) => false)
    }
    return this.dataController.userLabel.create(
      this.data.Id,
      this.name,
      this.phoneNumber
    )
  }
}
