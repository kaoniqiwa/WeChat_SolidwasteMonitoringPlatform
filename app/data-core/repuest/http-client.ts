import { HowellAuthHttp } from './howell-auth-http'
import { WeChatRequestService } from './we-chat.service'
import { SessionUser } from '../../common/session-user'
import { getQueryVariable } from '../../common/tool'

export namespace HowellHttpClient {
  interface DigestWindow extends Window {
    DIGEST: any
    data: any
    APPHTTP: HowellAuthHttp
  }

  export class HttpClient {
    userService: WeChatRequestService
    user: SessionUser
    digistWindow: DigestWindow
    constructor() {
      this.digistWindow = window as unknown as DigestWindow
      this.user = new SessionUser()
      this.userService = new WeChatRequestService(this.http)
    }

    async login(success?: (http: HowellAuthHttp) => void, fail?: () => void) {
      const openid = getQueryVariable('openid')
      if (this.digistWindow.DIGEST == null && openid) {
        // 123456
        this.user.user = {
          name: openid.trim(),
          pwd: '',
        }

        const a = await this.userService.login(() => {})

        if (a) {
          this.user.WUser = a
          if (success) success(this.http)
        } else {
          if (fail) {
            fail()
          }
        }
      }
    }

    async login2(fn?: (http: HowellAuthHttp) => void) {
      const openid = getQueryVariable('openid'),
        eventId = getQueryVariable('eventid')

      if (eventId && !openid) {
        window.location.href =
          'http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetUserOpenId?appid=wx119358d61e31da01&returnUrl=' +
          window.location.href
      } else if (eventId && openid) {
        if (this.digistWindow.DIGEST == null) {
          this.user.user = {
            name: openid,
            pwd: '',
          }

          const a = await this.userService.login(() => {})
          if (a) this.user.WUser = a
          if (fn) fn(this.http)
        }
      }
    }

    get http() {
      var http_: HowellAuthHttp
      if (this.digistWindow['APPHTTP'] == null)
        this.digistWindow['APPHTTP'] = new HowellAuthHttp(
          this.user.name,
          this.user.pwd
        )
      http_ = this.digistWindow['APPHTTP']
      return http_
    }
  }
}
