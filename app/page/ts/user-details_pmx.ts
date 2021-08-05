import { getQueryVariable } from '../../common/tool'
import {
  ResourceRole,
  ResourceType,
  WeChatUser,
} from '../../data-core/model/we-chat'
import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
import { Service } from '../../data-core/repuest/service'
import { AsideControl } from './aside'
import { AsideListItem, AsideListPage, AsideListPageWindow } from './aside-list'
import { Language } from './language'
import MyAside, { MyAsideData, SelectionMode } from './myAside'
import $ from 'jquery'
import IObserver from './IObserver'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { SessionUser } from '../../common/session-user'
import { Division } from '../../data-core/model/waste-regulation/division'
import { GarbageStation } from '../../data-core/model/waste-regulation/garbage-station'
import { PagedList } from '../../data-core/model/page'

import '../css/user-details.css'

type ResourceName = keyof typeof ResourceType
type ResourceVal = {
  Id: string
  Name: string
}

class UserDetails implements IObserver {
  element = {
    asideContainer: document.querySelector('#aside-container') as HTMLElement,
    btn: {
      back: document.getElementById('back') as HTMLDivElement,
      delete: document.getElementById('delete') as HTMLLinkElement,
    },
    info: {
      name: document.getElementById('user-name') as HTMLDivElement,
      mobileNo: document.getElementById('user-mobileNo') as HTMLDivElement,
      gender: document.getElementById('user-gender') as HTMLDivElement,
      count: document.getElementById('user-resource') as HTMLDivElement,
      type: document.getElementById('user-resource-type') as HTMLDivElement,
    },
    iframe: {
      setUser: document.getElementById('iframe-set-user') as HTMLIFrameElement,
    },
    icons: document.querySelectorAll('.howell-icon-arrow2right'),
    link: {
      setUser: document.getElementById('link-set-user') as HTMLLinkElement,
    },
  }

  myAside!: MyAside

  _showAside = false
  get showAside() {
    return this._showAside
  }
  set showAside(val) {
    this._showAside = val
    if (val) {
      if (this.myAside) {
        $(this.element.asideContainer).show()
        setTimeout(() => {
          this.myAside?.slideIn()
          this.myAside.disabled = this.isCurrent
        }, 1e2)
      }
    } else {
      setTimeout(() => {
        $(this.element.asideContainer).hide()
      }, 3e2)
    }
  }

  asideSetUser: AsideControl

  resourceIds: string[] = []
  resourceType: ResourceType = ResourceType.GarbageStations
  resourceList: Map<ResourceName, Array<MyAsideData>> = new Map() // 传给myAside的数据

  constructor(
    private user: WeChatUser,
    private service: Service,
    private isCurrent = false
  ) {
    if (user.Resources && user.Resources.length > 0) {
      this.resourceType = user.Resources[0].ResourceType
      this.resourceIds = user.Resources.map((item) => item.Id)
    }

    this.asideSetUser = new AsideControl('aside-set-user')
    window.HideUserAside = (user) => {
      this.asideSetUser.Hide()
      if (user) {
        console.log(user)
        this.element.info.name.innerHTML = ''
        if (user.FirstName) {
          this.element.info.name.innerHTML = user.FirstName
        }
        if (user.LastName) {
          this.element.info.name.innerHTML += user.LastName
        }
        this.element.info.gender.innerHTML = Language.Gender(user.Gender)
      }
    }
  }

  update(args: { type: string; [key: string]: any }) {
    if (args) {
      if ('type' in args) {
        if (args.type == 'my-aside') {
          if ('show' in args) {
            this.showAside = args.show
          }
          if ('filtered' in args) {
            console.log('filtered', args.filtered)

            let data: Map<string, Array<string>> = new Map()

            let filtered = args.filtered as Map<string, Set<HTMLElement>>
            for (let [k, v] of filtered) {
              let ids = [...v].map(
                (element) => element.getAttribute('id') || ''
              )
              data.set(k, ids)
            }
            console.log('maped', data)
            this.confirmSelect(data)
          }
        }
      }
    }
  }

  init() {
    this.createContent()
    if (this.isCurrent && this.user.Resources!.length <= 1) return
    this.loadAsideData().then(() => {
      this.createAside()
    })
  }
  createContent() {
    // 主账号下
    if (this.isCurrent) {
      ;(
        this.element.info.name.parentElement?.querySelector(
          '.howell-icon-arrow2right'
        ) as HTMLElement
      ).style.visibility = 'visible'
      ;(
        this.element.info.gender.parentElement?.querySelector(
          '.howell-icon-arrow2right'
        ) as HTMLElement
      ).style.visibility = 'visible'

      if (this.resourceType == ResourceType.GarbageStations)
        (
          this.element.info.count.parentElement?.querySelector(
            '.howell-icon-arrow2right'
          ) as HTMLElement
        ).style.visibility = 'visible'
    } else {
      ;(
        this.element.info.count.parentElement?.querySelector(
          '.howell-icon-arrow2right'
        ) as HTMLElement
      ).style.visibility = 'visible'

      this.element.btn.delete.style.visibility = 'visible'
    }

    this.element.info.name.innerHTML = ''
    this.element.iframe.setUser.src =
      this.element.link.setUser.href + '?openid=' + this.user.OpenId

    if (this.user.FirstName) {
      this.element.info.name.innerHTML += this.user.FirstName
    }
    if (this.user.LastName) {
      this.element.info.name.innerHTML += this.user.LastName
    }
    if (this.isCurrent) {
      this.element.info.name.parentElement?.parentElement?.addEventListener(
        'click',
        () => {
          this.asideSetUser.Show()
        }
      )
      this.element.info.gender.parentElement?.parentElement?.addEventListener(
        'click',
        () => {
          this.asideSetUser.Show()
        }
      )
    }

    if (this.user.MobileNo) {
      this.element.info.mobileNo.innerHTML = this.user.MobileNo
    }
    if (this.user.Gender) {
      const language = Language.Gender(this.user.Gender)
      this.element.info.gender.innerHTML = language
    }
    if (this.user.Resources && this.user.Resources.length > 0) {
      const language = Language.ResourceType(
        this.user.Resources[0].ResourceType
      )
      this.element.info.type.innerHTML = language
      if (this.user.Resources.length == 1) {
        this.element.info.count.innerHTML = this.user.Resources[0].Name || ''
      } else {
        this.element.info.count.innerHTML =
          this.user.Resources.length.toString()
      }
    }

    this.element.info.count.parentElement?.parentElement?.addEventListener(
      'click',
      () => {
        console.log('click')
        this.showAside = true
      }
    )

    this.element.btn.back.addEventListener('click', () => {
      window.parent.HideUserAside()
    })
    this.element.btn.delete.addEventListener('click', () => {
      if (this.user.Id) {
        this.service.wechat.del(this.user.Id)
      }
      window.parent.HideUserAside(this.user.Id)
    })
  }

  async loadAsideData() {
    switch (this.resourceType) {
      case ResourceType.County:
      case ResourceType.Committees:
        await this.loadAllDivision()
        break
      case ResourceType.GarbageStations:
        await this.loadAllGarbageStations()
    }

    console.log('aside data', this.resourceList)
  }

  async loadAllDivision() {
    let res = await this.service.division.list({})
    console.log('所有区域', res)
    let data = res.Data.map((item) => {
      let obj: MyAsideData = {
        Id: item.Id,
        Name: item.Name,
      }
      if (this.resourceIds.includes(item.Id)) {
        obj.isSelected = true
      }
      return obj
    })
    data.sort((a, b) => {
      return a.Name!.localeCompare(b.Name!)
    })
    this.resourceList.set(ResourceType[this.resourceType] as ResourceName, data)
  }

  async loadAllGarbageStations() {
    let res = await this.service.garbageStation.list({})
    console.log('所有厢房', res)
    let data = res.Data.map((item) => {
      let obj: MyAsideData = {
        Id: item.Id,
        Name: item.Name,
      }
      if (this.resourceIds.includes(item.Id)) {
        obj.isSelected = true
      }
      return obj
    })

    this.resourceList.set(ResourceType[this.resourceType] as ResourceName, data)
  }
  async createResource(Ids: string[]) {
    let res: PagedList<Division | GarbageStation> | null = null
    // 如果0个管辖范围，则忽略删除操作
    if (Ids.length == 0) {
      // alert('至少一个管辖范围!')

      // weui.toast('至少一个管辖范围!')
      return
    }
    if (
      this.resourceType == ResourceType.County ||
      this.resourceType == ResourceType.Committees
    ) {
      res = await this.service.division.list({ Ids })
    } else if (this.resourceType == ResourceType.GarbageStations) {
      res = await this.service.garbageStation.list({ Ids })
    }
    // console.log(Ids)
    let resources = res?.Data.map((item) => {
      let role = new ResourceRole()
      role.Id = item.Id
      role.Name = item.Name
      role.ResourceType = ResourceType.GarbageStations

      role.RoleFlags = 0
      role.AllSubResources = true
      role.Resources = []

      return role
    })
    this.user.Resources = resources

    // console.log(this.user)

    // 更新管辖范围
    this.service.wechat.set(this.user).then(() => {
      if (this.user.Resources && this.user.Resources.length > 0) {
        if (this.user.Resources.length == 1) {
          this.element.info.count.innerHTML = this.user.Resources[0].Name || ''
        } else {
          this.element.info.count.innerHTML =
            this.user.Resources.length.toString()
        }
      }
    })
  }
  confirmSelect(data: Map<string, Array<string>>) {
    for (let [k, v] of data) {
      console.log(k, v)
      this.createResource(v)
    }
  }

  createAside() {
    this.myAside = new MyAside(this.element.asideContainer, [
      {
        title: Language.ResourceType(this.resourceType!),
        data: this.resourceList.get(
          ResourceType[this.resourceType!] as ResourceName
        ),
        type: ResourceType[this.resourceType],
        mode:
          this.resourceType == ResourceType.GarbageStations
            ? SelectionMode.multiple
            : void 0,
        atLeastNum: 1,
      },
    ]).init()

    this.myAside.add(this)
  }
}

if (location.search) {
  let wechatUser = new SessionUser().WUser
  console.log('wechatUser', wechatUser)
  if (wechatUser.Resources && wechatUser.Resources.length > 0) {
    new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {
      const service = new Service(http)
      let childId = getQueryVariable('childId')
      if (childId) {
        try {
          wechatUser = await service.wechat.get(childId)
          console.log('childUser', wechatUser)
        } catch (ex) {
          console.error(ex)
        }
      }
      const page = new UserDetails(wechatUser, service, !childId)

      // if (childId) {
      //   page.element.btn.delete.style.display = "";
      //   page.element.icons.forEach((val, key) => {
      //     (val as HTMLElement).style.visibility = "hidden";
      //   });
      // }
      page.init()
    })
  }
}
