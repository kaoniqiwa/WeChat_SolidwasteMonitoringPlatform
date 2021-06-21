import { plainToClass } from 'class-transformer'
import { DateTime } from '../model/date-time'
import { PagedList } from '../model/page'
import { ResponseBase, Response } from '../model/response'
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

  async getList(params: GetUserLabelsParams) {
    let response = await this.requestService.post<
      GetUserLabelsParams,
      Response<PagedList<UserLabel>>
    >(UserUrl.label.list(), params)
    response.Data.Data = plainToClass(UserLabel, response.Data.Data)
    for (let i = 0; i < response.Data.Data.length; i++) {
      const data = response.Data.Data[i]
      data.CreateTime = plainToClass(DateTime, data.CreateTime)
    }
    return response.Data
  }

  async get(garbageStationId: string, type: UserLabelType) {
    let response = await this.requestService.get<Response<UserLabel>>(
      UserUrl.label.type(garbageStationId, type)
    )
    return plainToClass(UserLabel, response.Data)
  }

  delete(garbageStationId: string, type: UserLabelType) {
    return this.requestService.delete<ResponseBase>(
      UserUrl.label.type(garbageStationId, type)
    )
  }
  post(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    return this.requestService.post<UserLabel, ResponseBase>(
      UserUrl.label.type(garbageStationId, type),
      label
    )
  }
  put(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    return this.requestService.put<UserLabel, ResponseBase>(
      UserUrl.label.type(garbageStationId, type),
      label
    )
  }
}
