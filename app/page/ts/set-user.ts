import { SessionUser } from '../../common/session-user'
import {
  Division,
  GetDivisionsParams,
} from '../../data-core/model/waste-regulation/division'
import {
  GarbageStation,
  GetGarbageStationsParams,
} from '../../data-core/model/waste-regulation/garbage-station'
import {
  GenderType,
  ResourceRole,
  ResourceType,
  WeChatUser,
} from '../../data-core/model/we-chat'
import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
import { Service } from '../../data-core/repuest/service'

let $ = Reflect.get(window, '$')

class UserSetter {
  myData: Map<string, Division> = new Map()
  garbageStations: Map<string, GarbageStation> = new Map()

  language: string = ''
  resourceType: ResourceType = ResourceType.GarbageStations

  selectedData: Map<string, any> = new Map()
  myUser = new WeChatUser()

  constructor(private user: SessionUser, private service: Service) {
    this.myUser = user.WUser
  }
  element = {
    info: {
      uname: document.querySelector('#uname') as HTMLInputElement,
      ugender: document.querySelector('#ugender') as HTMLSelectElement,

      $toast: $('#toast'),
      $warnToast: $('#warnToast'),
      $textToast: $('#textToast'),
      $toastContent: $('#textToast .weui-toast__content'),
    },
    btn: {
      back: document.getElementById('back') as HTMLDivElement,
      setBtn: document.getElementById('setBtn') as HTMLDivElement,
    },
  }
  init() {
    this.createMain()

    this.bindEvents()
  }
  createMain() {
    let firstName = this.user.WUser.FirstName ? this.user.WUser.FirstName : ''
    let lastName = this.user.WUser.LastName ? this.user.WUser.LastName : ''

    this.element.info.uname.value = firstName + lastName
    if (this.user.WUser.Gender) {
      if (this.user.WUser.Gender < 0) {
        this.element.info.ugender.selectedIndex = -1
      } else {
        this.element.info.ugender.value = this.user.WUser.Gender!.toString()
      }
    } else {
      this.element.info.ugender.selectedIndex = -1
    }

    // 性别默认未知
    this.myUser.Gender = Number(this.element.info.ugender.value)
    this.myUser.CanCreateWeChatUser = this.resourceType + 1 == 2
    // this.myUser.Id =this.user.WUser.Id;
  }
  bindEvents() {
    let self = this

    this.element.info.uname.addEventListener('change', function () {
      self.myUser.LastName = this.value
    })
    this.element.info.ugender.addEventListener('change', function () {
      self.myUser.Gender = Number(this.value)
    })
    this.element.btn.setBtn.addEventListener('click', () => {
      this.updateUser()
    })
    this.element.btn.back.addEventListener('click', () => {
      window.parent?.HideUserAside()
    })
  }

  updateUser() {
    if (!this.myUser.LastName) {
      this.showTextToast('请填写姓名')
      return
    }
    console.log(this.myUser)

    this.service.wechat.set(this.myUser).then((res: any) => {
      console.log('updated', res)
      if (res.data.FaultCode == 0) {
        //this.showToast();
        window.parent?.HideUserAside(this.myUser)
      } else {
        this.showWarnToast()
      }
    })
  }
  showToast() {
    let $toast = this.element.info.$toast

    if ($toast.css('display') != 'none') return
    $toast.fadeIn(100)
    setTimeout(function () {
      $toast.fadeOut(100)
    }, 1000)
  }
  showWarnToast() {
    let $warnToast = this.element.info.$warnToast

    if ($warnToast.css('display') != 'none') return
    $warnToast.fadeIn(100)
    setTimeout(function () {
      $warnToast.fadeOut(100)
    }, 1000)
  }
  showTextToast(msg: string) {
    let $textToast = this.element.info.$textToast
    let $toastContent = this.element.info.$toastContent
    $toastContent.html(msg)

    if ($textToast.css('display') != 'none') return
    $textToast.fadeIn(100)
    setTimeout(function () {
      $textToast.fadeOut(100, function () {
        $toastContent.html('howell')
      })
    }, 1000)
  }
}

if (location.search) {
  const client = new HowellHttpClient.HttpClient()
  client.login((http: HowellAuthHttp) => {
    const user = new SessionUser()
    const service = new Service(http)
    const page = new UserSetter(client.user, service)

    page.init()
  })
}
