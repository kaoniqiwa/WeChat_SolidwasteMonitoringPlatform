import { SessionUser } from '../../common/session-user'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { HowellUri } from '../../data-core/model/waste-regulation/howell-url'
import { ResourceType, WeChatUser } from '../../data-core/model/we-chat'
import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
import { Service } from '../../data-core/repuest/service'
import { ControllerFactory } from './data-controllers/ControllerFactory'
import { OneDay, Paged } from './data-controllers/IController'

export interface NavigationWindow extends Window {
  User: SessionUser
  Authentication: HowellAuthHttp
  RecordPage?: Paged
  Day?: OneDay
  Querys?: any
  pageChange: (index: number, params?: any) => void
}

export enum NavigationWindowIndex {
  none = -1,
  data = 0,
  task = 1,
  history = 2,
  garbage_station = 3,
  garbage_drop = 4,
  user = 5,
}

// 命名空间编译成自执行函数
namespace Navigation {
  window.recordDetails = null
  window.showOrHideAside = function (url) {
    if (index < NavigationWindowIndex.none) {
      index = NavigationWindowIndex.garbage_drop
      let garbageDropPage = items[index] as HTMLLinkElement
      garbageDropPage.click()
    } else if (index < NavigationWindowIndex.data) {
      index = NavigationWindowIndex.history
      let historyPage = items[index] as HTMLLinkElement
      historyPage.click()
    } else if (index > NavigationWindowIndex.data) {
      // let garbageDropPage = (items[index] as HTMLLinkElement);
      // garbageDropPage.click();
    } else {
    }
    var asideContent = document.querySelector(
      '.aside-content'
    ) as HTMLDivElement
    var backdrop = document.querySelector('.backdrop') as HTMLDivElement

    var details = document.getElementById('aside-details') as HTMLIFrameElement
    if (asideContent.classList.contains('active')) {
      asideContent.classList.remove('active')
      backdrop.style.display = 'none'
      // iframe.src = "about:blank";
      if (details) details.src = 'about:blank'
    } else {
      backdrop.style.display = 'block'
      asideContent.classList.add('active')

      if (details && url) {
        details.src = url
      }
    }
  }

  const items = document.getElementsByClassName(
    'bar-item'
  ) as unknown as HTMLLinkElement[]
  const iframe = document.getElementById('main') as HTMLIFrameElement
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as HTMLLinkElement
    item.onclick = function () {
      const _this = this as HTMLLinkElement
      if (_this.className == 'selected') {
        return false
      }
      const selecteds = document.getElementsByClassName('selected')
      for (let i = 0; i < selecteds.length; i++) {
        selecteds[i].classList.remove('selected')
      }

      let href = new HowellUri((this as HTMLLinkElement).href)
      let url = new HowellUri(window.location.toString())

      if (!href.Querys) {
        href.Querys = url.Querys
      } else {
        for (const key in url.Querys) {
          if (Object.prototype.hasOwnProperty.call(url.Querys, key)) {
            href.Querys[key] = url.Querys[key]
          }
        }
      }
      const navigation = window as unknown as NavigationWindow
      if (!href.Querys) {
        href.Querys = navigation.Querys
      } else {
        for (const key in navigation.Querys) {
          href.Querys[key] = navigation.Querys[key]
        }
      }

      iframe.src = href.toString()
      ;(this as HTMLLinkElement).classList.add('selected')
      return false
    }
  }
  let session = new SessionUser()
  ;(window as unknown as NavigationWindow).User = session
  let index = NavigationWindowIndex.data
  if (!session.WUser.CanCreateWeChatUser) {
    index = NavigationWindowIndex.task
    items[NavigationWindowIndex.data].style.display = 'none'
    items[NavigationWindowIndex.task].style.display = ''
  }
  // 获得OpenId
  var search = decodeURI(document.location.search).substr(1)

  var query = search.split('&')
  var querys: any = {
    openid: '',
    index: NavigationWindowIndex.data,
    eventid: '',
    data: '',
  }
  for (let i = 0; i < query.length; i++) {
    let keyvalue = query[i].split('=')
    querys[keyvalue[0].toLocaleLowerCase()] = keyvalue[1]
  }
  if (querys.data) {
    // alert(querys.data);
    console.log('source', querys.data)
    querys.data = decodeURIComponent(querys.data)
    querys.data = base64decode(querys.data)
    console.log('base64decode', querys.data)

    let params = querys.data.split('&')
    for (let i = 0; i < params.length; i++) {
      const param = params[i]
      let p = param.split('=')
      querys[p[0].toLocaleLowerCase()] = p[1]
    }
  }
  // 有OpenId,则获得该OpenId的信息
  if (querys.openid) {
    new HowellHttpClient.HttpClient().login(
      async (http: HowellAuthHttp) => {
        ;(window as unknown as NavigationWindow).Authentication = http

        if (querys.eventid) {
          //location.href = "./event-details.html?openid=" + querys.openid + "&eventid=" + querys.eventid;
          querys.index = NavigationWindowIndex.none
          let eventType = EventType.IllegalDrop
          if (querys.eventtype) {
            eventType = parseInt(querys.eventtype)
          }
          switch (eventType) {
            case EventType.GarbageDrop:
            case EventType.GarbageDropTimeout:
            case EventType.GarbageDropHandle:
              querys.index = -2
              eventType = EventType.GarbageDrop
              break

            default:
              break
          }
          window.showOrHideAside(
            './event-details.html?openid=' +
              querys.openid +
              '&eventid=' +
              querys.eventid +
              '&eventtype=' +
              eventType
          )
        }

        if (querys.index) {
          index = parseInt(querys.index)
        }
        debugger
        console.log(index)
        if (index >= 0) {
          // 手动触发按钮点击动作
          ;(items[index] as HTMLLinkElement).click()
        }
      },
      () => {
        location.href = './register.html?openid=' + querys.openid
      }
    )
  } else {
    if (querys.eventid) {
      let search = base64encode(location.search.substr(1))
      let url = window.location.href.substr(
        0,
        window.location.href.indexOf('?')
      )
      let href =
        'http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetUserOpenId?appid=wx119358d61e31da01&returnUrl=' +
        //+ url+"?data="+search;
        window.location.href
      window.location.href = href
    } else {
      location.href = './register.html'
    }
  }

  ;(window as unknown as NavigationWindow).pageChange = (
    index: number,
    params?: any
  ) => {
    ;(window as unknown as NavigationWindow).Querys = params
    ;(items[index] as HTMLLinkElement).click()
    setTimeout(() => {
      ;(window as unknown as NavigationWindow).Querys = undefined
    }, 1000)
  }
}
