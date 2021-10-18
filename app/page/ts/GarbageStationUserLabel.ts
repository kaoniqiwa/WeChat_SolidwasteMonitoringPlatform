import userLabelTemplate from '../garbagestation/garbage-station-details-user-label.html'
import '../css/aside.less'
import '../css/header.less'
import '../css/garbagestation/userLabel.css'
import AsideModel from './data-controllers/modules/AsideModel/AsideModel'
import { GarbageStationViewModel } from './data-controllers/ViewModels'
import CreateUserLabelAside from './GarbageStationCreateUserLabel'
import IObserver from './IObserver'
import SetUserLabelAside from './GarbageStationSetUserLabel'
import { UserLabel } from '../../data-core/model/user-stystem'
import { IGarbageStationController } from './data-controllers/modules/IController/IGarbageStationController'

export default class UserLabelAside extends AsideModel implements IObserver {
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
  onInnerBackClicked = (remove: boolean = false) => {
    let params = {
      showUserLabel: false,
      id: `user-label-${this.data.Id}`,
      mode: '',
    }
    if (remove) {
      params.mode = 'remove'
    }
    this.notify(params)
  }

  get linkPhoneNumber() {
    return this.innerContainer.querySelector(
      '#user-label-phone-number-call'
    ) as HTMLLinkElement
  }
  get divGarbageStationName() {
    return this.innerContainer.querySelector(
      '.garbage-station-name'
    ) as HTMLDivElement
  }
  get divUserLabelName() {
    return this.innerContainer.querySelector(
      '.user-label-name'
    ) as HTMLDivElement
  }
  get divUserLabelPhoneNumber() {
    return this.innerContainer.querySelector(
      '.user-label-phone-number'
    ) as HTMLDivElement
  }
  get btnRemoveUserLabel() {
    return this.innerContainer.querySelector(
      '.user-label-delete'
    ) as HTMLDivElement
  }

  get divSetContainer() {
    return this.innerContainer.querySelector('#set-container') as HTMLDivElement
  }

  private _showUserLabel: boolean = false

  get showUserLabel() {
    return this._showUserLabel
  }
  set showUserLabel(val) {
    this._showUserLabel = val
    if (val) {
      this.divSetContainer.classList.add('slideIn')
    } else {
      this.divSetContainer.classList.remove('slideIn')
    }
  }

  label?: UserLabel

  constructor(
    selector: HTMLElement | string,
    private data: GarbageStationViewModel,
    private dataController: IGarbageStationController
  ) {
    super(selector, userLabelTemplate)
  }
  update(args: any): void {
    if (args) {
      if ('showUserLabel' in args) {
        this.showUserLabel = args.showUserLabel
      }
    }
    this.getData()
  }

  getData() {
    let promise = this.data.getUserLabel()
    promise.then((x) => {
      this.label = x
      this.linkPhoneNumber.href = 'tel:' + x.Content
      this.divUserLabelName.innerHTML = x.LabelName ?? ''
      this.divUserLabelPhoneNumber.innerHTML = x.Content ?? ''
      this.divGarbageStationName.innerHTML = this.data.Name
    })
  }

  init() {
    super.init()

    this.getData()

    this.eventRegist()
  }

  eventRegist() {
    let set = this.innerContainer.querySelectorAll('.info')
    set.forEach((x) => {
      x.addEventListener('click', (e) => {
        let target = (e.target as HTMLInputElement).querySelector('div[name]')
        if (target) {
          this.toSet(target.className)
        }
      })
    })
    this.btnRemoveUserLabel.style.display = ''
    this.btnRemoveUserLabel.addEventListener('click', () => {
      if (confirm('是否删除联系人')) {
        this.removeUserLabel().then((x) => {
          this.onInnerBackClicked(x)
        })
      }
    })
  }

  removeUserLabel() {
    return this.dataController.userLabel.remove(this.data.Id)
  }

  toSet(className: string) {
    if (this.label) {
      let set = new SetUserLabelAside(
        this.divSetContainer,
        this.data,
        this.dataController,
        this.label
      )
      set.init(className)
      set.add(this)
      this.showUserLabel = true
    }
  }
}
