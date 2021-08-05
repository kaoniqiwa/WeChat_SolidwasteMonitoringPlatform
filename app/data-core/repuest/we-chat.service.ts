import { SaveModel } from '../model/save-model'
import { WeChatUser } from '../model/we-chat'
import * as url from '../url/user-url'
import { HowellAuthHttp } from './howell-auth-http'
import { Digest } from './digest'
import { SessionUser } from '../../common/session-user'
import { HowellResponse } from '../model/response'

export class WeChatRequestService extends SaveModel {
  url: url.WeChat

  constructor(private requestService: HowellAuthHttp) {
    super()
    this.url = new url.WeChat()
  }

  async login(error: () => void) {
    const su = new SessionUser()

    return this.requestService.auth<HowellResponse<WeChatUser>>(
      su.name,
      this.url.get(su.name),
      (header) => {
        const digest = new Digest(header, this.url.get(su.name))
        return digest
      },
      error
    )
  }
  create(item: WeChatUser) {
    return this.requestService.post<WeChatUser, WeChatUser>(
      this.url.create(),
      item
    )
  }

  bingingUser(phoneNumber: string, openId: string) {
    return this.requestService.post<undefined, WeChatUser>(
      this.url.binding(phoneNumber, openId)
    )
  }

  get(id: string) {
    return this.requestService.get<WeChatUser>(this.url.get(id))
  }

  set(item: WeChatUser) {
    let id = item.OpenId

    if (!id) {
      id = item.Id
    }

    return this.requestService.put<WeChatUser, WeChatUser>(
      this.url.edit(id),
      item
    )
  }

  del(id: string) {
    return this.requestService.delete<WeChatUser>(this.url.del(id))
  }

  list() {
    return this.requestService.get<WeChatUser[]>(this.url.list())
  }
}

export class WeChatCodeRequestService {
  url: url.UserCode

  constructor(private requestService: HowellAuthHttp) {
    this.url = new url.UserCode()
  }

  getCode(phoneNumber: string) {
    return this.requestService.post<any, any>(this.url.getCode(phoneNumber))
  }

  checkCode(phoneNumber: string, code: string) {
    return this.requestService.post<any, any>(
      this.url.checkCode(phoneNumber, code)
    )
  }
}
