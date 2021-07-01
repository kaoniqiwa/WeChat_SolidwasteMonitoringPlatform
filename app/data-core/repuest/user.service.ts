import { plainToClass } from 'class-transformer'
import { DateTime } from '../model/date-time'
import { PagedList } from '../model/page'
import { ResponseBase, Response, HttpResponse } from '../model/response'
import { SaveModel } from '../model/save-model'
import {
  GetUserLabelsParams,
  Role,
  User,
  UserLabel,
  UserLabelType,
} from '../model/user-stystem'
import { UserUrl } from '../url/user-url'

import { HowellAuthHttp } from './howell-auth-http'

// 用户信息服务
export class UserRequestService extends SaveModel {
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.label = new UserLabelRequestService(requestService)
  }

  // 获取用户信息列表
  async list(index: number = 1, size: number = 100) {
    let query = `?PageIndex=${index}&PageSize=${size}`
    let response = await this.requestService.get<Response<PagedList<User>>>(
      UserUrl.list() + query
    )
    response.Data.Data = plainToClass(User, response.Data.Data)
    return response.Data
  }
  // 创建用户
  create(user: User) {
    return this.requestService.post<User, ResponseBase>(UserUrl.list(), user)
  }
  // 获取用户信息
  async get(userId: string) {
    let response = await this.requestService.get<Response<User>>(
      UserUrl.item(userId)
    )
    return plainToClass(User, response.Data)
  }
  // 修改用户信息
  update(user: User) {
    return this.requestService.put<User, ResponseBase>(
      UserUrl.item(user.Id),
      user
    )
  }
  // 删除用户
  delete(userId: string) {
    return this.requestService.delete<ResponseBase>(UserUrl.item(userId))
  }
  // 获取用户下所有规则
  async getRoleList(userId: string, index: number = 1, size: number = 100) {
    let query = `?PageIndex=${index}&PageSize=${size}`
    let response = await this.requestService.get<Response<PagedList<Role>>>(
      UserUrl.role.list(userId) + query
    )
    response.Data.Data = plainToClass(Role, response.Data.Data)
    return response.Data
  }
  // 获取用户下单个规则
  async getRole(userId: string, roleId: string) {
    let response = await this.requestService.get<Response<Role>>(
      UserUrl.role.item(userId, roleId)
    )
    return plainToClass(Role, response.Data)
  }

  label: UserLabelRequestService
}

class UserLabelRequestService {
  constructor(private requestService: HowellAuthHttp) {}

  async getList(params?: GetUserLabelsParams) {
    if (!params) {
      params = {}
    }
    params.PageSize = 999
    let response = await this.requestService.post<
      GetUserLabelsParams,
      PagedList<UserLabel>
    >(UserUrl.label.list(), params)
    return plainToClass(UserLabel, response.Data)
  }

  async get(garbageStationId: string, type: UserLabelType) {
    let response = await this.requestService.get<UserLabel>(
      UserUrl.label.type(garbageStationId, type)
    )
    return plainToClass(UserLabel, response)
  }

  async delete(garbageStationId: string, type: UserLabelType) {
    let response = await this.requestService.delete<HttpResponse<ResponseBase>>(
      UserUrl.label.type(garbageStationId, type)
    )
    return response.data
  }
  post(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    return this.requestService.post<UserLabel, ResponseBase>(
      UserUrl.label.type(garbageStationId, type),
      label
    )
  }
  async put(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    let response = await this.requestService.put<
      UserLabel,
      HttpResponse<ResponseBase>
    >(UserUrl.label.type(garbageStationId, type), label)
    return response.data
  }
}
