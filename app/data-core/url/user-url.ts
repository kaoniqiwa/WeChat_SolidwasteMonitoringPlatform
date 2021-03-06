/**
 * Developer 施文斌
 * LastUpdateTime
 */
import { BaseUrl, IUrl } from './IUrl'

export class UserCode extends BaseUrl {
  getCode(phoneNumber: string) {
    return this.wechat + 'GetVerificationCode?phoneNumber=' + phoneNumber
  }

  checkCode(phoneNumber: string, code: string) {
    return (
      this.wechat +
      `CheckVerificationCode?phoneNumber=${phoneNumber}&code=${code}`
    )
  }
}

export class User extends BaseUrl {
  list() {
    return this.user + `Users`
  }

  item(id: string) {
    return this.user + `Users/${id}`
  }

  roles_list(id: string) {
    return this.user + `Users/${id}/Roles`
  }

  roles_item(id: string, roleId: string) {
    return this.user + `Users/${id}/Roles/${roleId}`
  }

  login(name: string) {
    return this.user + `Users/Login/${name}`
  }
  config(id: string, configType: string) {
    return this.user + `Users/${id}/Config/${configType}`
  }
}

export class UserRoleUrl {
  list(userId: string) {
    const basic = UserUrl.item(userId)
    return `${basic}/Roles`
  }
  item(userId: string, roleId: string) {
    const basic = this.list(userId)
    return `${basic}/${roleId}`
  }
}

export class UserLabelUrl {
  basic() {
    return `${UserUrl.list()}/Labels`
  }
  list() {
    return `${this.basic()}/List`
  }
  type(garbageStationId: string, type: number) {
    return `${this.basic()}/${garbageStationId}/LabelTypes/${type}`
  }
}
export class UserUrl extends BaseUrl {
  static list() {
    return this.user + `Users`
  }

  static item(id: string) {
    return `${this.list()}/${id}`
  }
  static login(name: string) {
    return `${this.list()}/Login/${name}`
  }
  static config(id: string, configType: string) {
    return `${this.list()}/${id}/Config/${configType}`
  }
  static role: UserRoleUrl = new UserRoleUrl()

  static label: UserLabelUrl = new UserLabelUrl()
}

export class WeChat extends BaseUrl {
  create() {
    return this.user + 'WeChat/Users'
  }

  list() {
    return this.user + 'WeChat/Users'
  }

  get(id: string) {
    return this.user + `WeChat/Users/${id}`
  }

  edit(id: string) {
    return this.user + `WeChat/Users/${id}`
  }

  del(id: string) {
    return this.user + `WeChat/Users/${id}`
  }

  binding(phoneNumber: string, openId: string) {
    return (
      this.user +
      `WeChat/Users/Binding?MobileNo=${phoneNumber}&OpenId=${openId}`
    )
  }

  openIds(id: string) {
    return this.user + `WeChat/Users/Resources/${id}/OpenIds`
  }
}

export class Roles extends BaseUrl {
  list() {
    return this.user + `Roles`
  }

  item(id: string) {
    return this.user + `Roles/${id}`
  }

  user_list(id: string) {
    return this.user + `Roles/${id}/Users`
  }

  user_item(id: string, userId: string) {
    return this.user + `Roles/${id}/Users/${userId}`
  }
}
