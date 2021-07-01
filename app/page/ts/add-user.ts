import { SessionUser } from '../../common/session-user'
import {
  Division,
  DivisionType,
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
import { Language } from './language'

let $ = Reflect.get(window, '$')

// "MobileNo 18221662092 has already existed."
enum ExceptionMsg {
  MobileNo = '手机号',
}

type ExceptionKey = 'MobileNo'

interface IAddUser {
  id: string
  username: string
  gender: GenderType
  divisionType: DivisionType[]
  division: Division
}

class AddUser {}

abstract class UserCreater {
  myData: Map<string, Division> = new Map()
  garbageStations: Map<string, GarbageStation> = new Map()

  abstract get language(): string
  resourceType: ResourceType = ResourceType.GarbageStations

  selectedData: Map<string, any> = new Map()
  myUser = new WeChatUser()

  constructor(private user: SessionUser, private service: Service) {
    this.element.info.ugender.selectedIndex = -1
  }
  element = {
    info: {
      uname: document.querySelector('#uname') as HTMLInputElement,
      uphone: document.querySelector('#uphone') as HTMLInputElement,
      ugender: document.querySelector('#ugender') as HTMLSelectElement,
      type: document.querySelector('#type')!,
      ruleArea: document.querySelector('#area > span') as HTMLSpanElement,

      $toast: $('#toast'),
      $warnToast: $('#warnToast'),
      $textToast: $('#textToast'),
      $toastContent: $('#textToast .weui-toast__content'),
    },
    btn: {
      area: document.querySelector('#area')!,
      back: document.getElementById('back') as HTMLDivElement,
      addBtn: document.getElementById('addBtn') as HTMLDivElement,
    },
    aside: {
      backdrop: document.querySelector('.backdrop') as HTMLDivElement,
      asideContent: document.querySelector('.aside-content') as HTMLDivElement,
      asideTitle: document.querySelector('.aside-title') as HTMLHeadElement,
      asideMain: document.querySelector('.aside-main') as HTMLDivElement,
      asideResourceRole: document.querySelector(
        '#aside-resource-role'
      ) as HTMLSelectElement,
      asideTemplate: document.querySelector(
        '#aside-template'
      ) as HTMLTemplateElement,
      footerReset: document.querySelector('.footer-reset') as HTMLDivElement,
      footerConfirm: document.querySelector(
        '.footer-confirm'
      ) as HTMLDivElement,
    },
  }
  abstract loadData(resourceId: string): Promise<void>
  init() {
    this.createMain()

    this.createAside()
    this.loadAside()
    this.bindEvents()
  }
  createMain() {
    this.element.info.type.innerHTML = this.language

    // 性别默认未知
    //this.myUser.Gender = Number(this.element.info.ugender.value);
    //this.myUser.CanCreateWeChatUser = this.resourceType + 1 == 2
  }
  createAside() {
    if (!this.user.WUser.Resources) return
    this.element.aside.asideResourceRole.innerHTML = ''
    this.user.WUser.Resources.map((x) => {
      let option = document.createElement('option')
      option.innerHTML = x.Name ?? ''
      option.value = x.Id
      this.element.aside.asideResourceRole.appendChild(option)
    })

    //this.element.aside.asideResourceRole.value = this.user.WUser.Resources[0].Id
    //this.element.aside.asideTitle.innerHTML = this.language
  }
  loadAside() {
    this.element.aside.asideMain!.innerHTML = ''
    let tempContent = this.element.aside.asideTemplate
      ?.content as DocumentFragment
    for (let [k, v] of this.myData) {
      // 不能在 documentFragment 上添加任何事件
      let info = tempContent.cloneNode(true) as DocumentFragment
      let div = info.querySelector('div.aside-item') as HTMLDivElement
      div!.textContent = v.Name
      div.setAttribute('id', v.Id)
      this.element.aside.asideMain.appendChild(info)
      debugger
      if (this.selectedData.has(v.Id)) {
        div.classList.add('selected')
      }
    }
    document.querySelectorAll('.aside-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (!e.target) return
        let target = e.target as HTMLDivElement
        if (target.classList.contains('selected')) {
          target.classList.remove('selected')
          this.selectedData.delete(target.id)
        } else {
          // 街道下面的居委会只能选择一个
          if (this.resourceType == ResourceType.County) {
            // for (let [k, v] of this.selectedData) {
            //   v.Element.classList.remove('selected')
            // }
            // this.selectedData.clear()
          }
          target.classList.add('selected')
          this.selectedData.set(target.id, {
            Element: target,
            id: target.id,
            name: target.textContent,
            resourceType: this.resourceType + 1,
          })
        }
      })
    })
  }
  bindEvents() {
    let self = this

    this.element.aside.asideResourceRole.addEventListener('change', (e) => {
      let id = (e.target as HTMLSelectElement).value
      console.log(id)
      this.loadData(id).then((x) => {
        this.loadAside()
      })
    })

    this.element.info.uname.addEventListener('change', function () {
      self.myUser.LastName = this.value
    })
    this.element.info.uphone.addEventListener('change', function () {
      self.myUser.MobileNo = this.value
    })
    this.element.info.ugender.addEventListener('change', function () {
      self.myUser.Gender = Number(this.value)
    })
    this.element.btn.area.addEventListener('click', () => {
      this.showOrHideAside()
    })
    this.element.btn.back.addEventListener('click', () => {
      window.parent?.HideUserAside()
    })
    this.element.aside.backdrop.addEventListener('click', () => {
      this.showOrHideAside()
    })

    this.element.aside.footerReset.addEventListener('click', () => {
      this.resetSelected()
    })
    this.element.aside.footerConfirm.addEventListener('click', () => {
      this.confirmSelect()
    })
    this.element.btn.addBtn.addEventListener('click', () => {
      this.createUser()
    })
  }

  loadDivisionList(ParentId: string) {
    // 将数组 map 化返回
    let mapedDivisions = new Map()
    var req = new GetDivisionsParams()
    req.ParentId = ParentId

    return this.service.division.list(req).then((x) => {
      let divisions = x.Data.sort((a, b) => {
        return a.Name.localeCompare(b.Name)
      })

      divisions.forEach((division) => {
        mapedDivisions.set(division.Id, division)
      })
      return mapedDivisions
    })
  }
  LoadGarbageStation(DivisionId: string) {
    const request = new GetGarbageStationsParams()
    request.DivisionId = DivisionId
    let mapedStations = new Map()
    return this.service.garbageStation.list(request).then((x) => {
      x.Data.forEach((data) => {
        mapedStations.set(data.Id, data)
      })

      return mapedStations
    })
  }
  showOrHideAside() {
    if (this.element.aside.asideContent.classList.contains('active')) {
      this.element.aside.asideContent.classList.remove('active')
      this.element.aside.backdrop.classList.remove('active')
    } else {
      this.element.aside.asideContent.classList.add('active')
      this.element.aside.backdrop.classList.add('active')
    }
  }

  resetSelected() {
    for (let [k, v] of this.selectedData) {
      v.Element.classList.remove('selected')
    }
    this.selectedData.clear()
  }
  confirmSelect() {
    this.element.info.ruleArea.textContent = '添加'

    let selectedIds = []

    let name = ''
    for (let v of this.selectedData.values()) {
      selectedIds.push(v.id)
      if (!name) {
        name = v.name
      }
    }

    if (this.selectedData.size > 1) {
      this.element.info.ruleArea.textContent = this.selectedData.size.toString()
    } else {
      this.element.info.ruleArea.textContent = name
    }

    let Resources = []
    for (let [k, v] of this.selectedData) {
      let role = new ResourceRole()
      role.Name = v.name
      role.Id = v.id
      role.RoleFlags = 0
      role.AllSubResources = true
      role.ResourceType = v.resourceType
      Resources.push(role)
    }
    this.myUser.Resources = Resources

    this.showOrHideAside()
  }
  createUser() {
    if (!this.myUser.LastName) {
      this.showTextToast('请填写姓名')
      return
    }
    if (!this.myUser.MobileNo) {
      this.showTextToast('请填写手机号')
      return
    }
    let reg = /(1[3|4|5|6|7|8])[\d]{9}/
    if (!reg.test(this.myUser.MobileNo)) {
      this.showTextToast('请填写正确手机号')
      return false
    }
    if (!this.myUser.Resources || this.myUser.Resources.length == 0) {
      this.showTextToast('请选择管辖范围')
      return
    }

    this.service.wechat
      .create(this.myUser)
      .then((res: any) => {
        console.log('then', res)
        if (res.FaultCode == 0) {
          //this.showToast();
          window.parent?.HideUserAside('true')
        }
      })
      .catch((err) => {
        this.showWarnToast(err)
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
  showWarnToast(err: any) {
    let $warnToast = this.element.info.$warnToast

    let data = err.response.data
    console.log(data)
    if (data.FaultCode == 400) {
      let msg = data.InnerException.Message as string
      let reg = /(?<key>\w+)\s(?<value>\w+)\s(?<status>has already existed.)/

      let res = msg.match(reg)
      let content = ''
      if (res && res.groups) {
        let key = res.groups.key as ExceptionKey
        content += ExceptionMsg[key]
        let val = res.groups.value
        // content += val;
        content += '已存在!'
      }
      console.log(content)
      // weui-toast__content
      $warnToast.find('.weui-toast__content').text(content)
    }

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
class CountyUserCreater extends UserCreater {
  /**
   *
   */
  constructor(user: SessionUser, service: Service) {
    super(user, service)
    this.myUser.CanCreateWeChatUser = true
    this.resourceType = ResourceType.County
  }

  get language() {
    return Language.ResourceType(ResourceType.Committees)
  }
  async loadData(resourceId: string) {
    this.myData = await this.loadDivisionList(resourceId)
  }
}
class CommitteesCreater extends UserCreater {
  /**
   *
   */
  constructor(user: SessionUser, service: Service) {
    super(user, service)
    this.myUser.CanCreateWeChatUser = false
    this.resourceType = ResourceType.Committees
  }

  get language() {
    return Language.ResourceType(ResourceType.GarbageStations)
  }

  async loadData(resourceId: string) {
    this.myData = await this.LoadGarbageStation(resourceId)
  }
}

if (location.search) {
  const client = new HowellHttpClient.HttpClient()

  client.login((http: HowellAuthHttp) => {
    if (client.user.WUser.Resources) {
      const user = new SessionUser()
      const service = new Service(http)

      let type = client.user.WUser.Resources[0].ResourceType

      let page: UserCreater

      switch (type) {
        case ResourceType.County:
          page = new CountyUserCreater(client.user, service)
          break
        case ResourceType.Committees:
          page = new CommitteesCreater(client.user, service)
          break
        case ResourceType.GarbageStations:
          return
        default:
          return
      }

      // 数据请求完成，初始化页面
      page.loadData(client.user.WUser.Resources[0].Id).then(() => {
        page.init()
      })
    }
  })
}
