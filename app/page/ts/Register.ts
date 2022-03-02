import { HowellHttpClient } from '../../data-core/repuest/http-client'
import {
  WeChatCodeRequestService,
  WeChatRequestService,
} from '../../data-core/repuest/we-chat.service'
import { SessionUser } from '../../common/session-user'
import { ResourceType } from '../../data-core/model/we-chat'
import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
export namespace RegisterPage {
  class Message {
    constructor(private page: Page) {}
    isShow = false
    show = (message: string) => {
      this.page.element.message.message.innerText = message
      this.page.element.message.window.style.display = ''
      this.isShow = true
    }
    hide = () => {
      this.page.element.message.window.style.display = 'none'
      this.isShow = false
    }
    autoHide = () => {
      setTimeout(() => {
        this.hide()
      }, 5000)
    }
  }

  class Page {
    element = {
      input: {
        phone: document.getElementById('phone') as HTMLInputElement,
        code: document.getElementById('code') as HTMLInputElement,
      },
      button: {
        code: document.getElementById('get_code') as HTMLButtonElement,
        submit: document.getElementById('to_submit') as HTMLButtonElement,
      },
      message: {
        window: document.getElementById('js_toast') as HTMLDivElement,
        message: document.getElementById('alertMsg')!,
      },
    }

    Message: Message

    constructor() {
      this.element.button.code.disabled = true
      this.element.button.submit.disabled = true
      this.Message = new Message(this)
    }

    inSendCodeInterval = false

    get canSendCode() {
      if (this.element.input.phone.value.length != 11) {
        return false
      }
      if (this.inSendCodeInterval) {
        return false
      }
      return true
    }

    gotCode = false

    number = 60

    countdownHandle!: number

    countdown() {
      this.countdownHandle = setInterval(() => {
        console.log(this.number)
        this.element.button.code.innerHTML = '重新发送（' + this.number-- + '）'

        this.inSendCodeInterval = this.number > 0

        if (!this.inSendCodeInterval) {
          clearInterval(this.countdownHandle)
          this.countdownHandle = 0
          this.number = 60
          this.element.button.code.innerHTML = '重新发送'
        }
        this.element.button.code.disabled = !this.canSendCode
      }, 1000)
    }

    eventRegist() {
      this.element.input.phone.addEventListener('input', (e) => {
        this.element.button.code.disabled = !this.canSendCode
      })
      this.element.input.code.addEventListener('input', (e) => {
        this.element.button.submit.disabled = !this.gotCode
      })
      this.element.button.code.addEventListener('click', (e) => {
        this.element.button.code.disabled = true
        this.gotCode = true
        this.countdown()
      })
    }
  }

  //#region Register
  export class Register {
    constructor(
      private page: Page,
      private service: {
        code: WeChatCodeRequestService
        user: WeChatRequestService
      }
    ) {}

    phoneNumber?: string

    eventRegist() {
      this.page.element.button.code.addEventListener('click', () => {
        this.phoneNumber = page.element.input.phone.value
        this.service.code.getCode(page.element.input.phone.value)
      })
      this.page.element.button.submit.addEventListener('click', async () => {
        if (this.phoneNumber) {
          const response = await this.service.code.checkCode(
            this.phoneNumber,
            this.page.element.input.code.value
          )

          if (response.success) {
            const buser = await this.regist()
            if (buser && buser.Resources && buser.Resources.length > 0) {
              const client = new HowellHttpClient.HttpClient()
              client.login((http: HowellAuthHttp) => {
                this.page.Message.show('注册成功')
                const service = new WeChatRequestService(http)
                let promise = service.get(buser.Id!)
                promise.then((user) => {
                  // switch (user.Resources[0].ResourceType) {
                  //     case ResourceType.County:
                  //         user.OffEvents = [EventType.GarbageDrop, EventType.GarbageDropTimeout, EventType.GarbageDropHandle]
                  //         break;
                  //     case ResourceType.Committees:
                  //         user.OffEvents = [EventType.GarbageDropTimeout, EventType.GarbageDropHandle]
                  //         break;
                  //     case ResourceType.GarbageStations:
                  //         break;
                  //     default:
                  //         break;
                  // }
                  user.OffEvents = [
                    EventType.IllegalDrop,
                    EventType.MixedInto,
                    EventType.GarbageFull,
                  ]
                  service.set(user)

                  setTimeout(() => {
                    location.href =
                      './index.html?openid=' + buser.OpenId + '&index=4'
                  }, 1500)
                })
              })
            } else {
              this.page.Message.show('您还未被分配权限，请联系管理员')
              this.page.Message.autoHide()
            }
          } else {
            this.page.Message.show('验证失败')
            this.page.Message.autoHide()
          }
        }
      })
    }

    async regist() {
      if (this.phoneNumber) {
        const user = new SessionUser()
        const buser = await this.service.user.bingingUser(
          this.phoneNumber,
          user.name
        )
        // console.log(buser);
        if (buser.OpenId) {
          user.name = buser.OpenId
        }
        user.WUser = buser
        return buser
      }
    }
  }
  //#endregion

  let page = new Page()
  page.eventRegist()
  var httpClient = new HowellHttpClient.HttpClient()
  let register = new Register(page, {
    code: new WeChatCodeRequestService(httpClient.http),
    user: new WeChatRequestService(httpClient.http),
  })
  register.eventRegist()
}

// var httpClient = new HowellHttpClient.HttpClient();

// new RegisterPage.Register({
//     code: new WeChatCodeRequestService(httpClient.http),
//     user: new WeChatRequestService(httpClient.http)
// }).init();
