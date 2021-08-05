import { ClassConstructor, plainToClass } from 'class-transformer'
import { RequestHelper } from '../dao/request-helper'
import { IPageParams, PagedList } from '../model/page'
import { HowellResponse } from '../model/response'
import { HowellAuthHttp } from './howell-auth-http'

export class BaseRequestService {
  constructor(protected requestService: HowellAuthHttp) {}

  protected async _post<T = any, R = any>(
    t: ClassConstructor<R>,
    url: string,
    item?: T
  ) {
    let response = await this.requestService.post<T, HowellResponse<R>>(
      url,
      item
    )
    response.Data = plainToClass(t, response.Data)
    return response.Data
  }
  protected async _put<T>(t: ClassConstructor<T>, url: string, item: T) {
    let response = await this.requestService.put<T, HowellResponse<T>>(
      url,
      item
    )
    response.Data = plainToClass(t, response.Data)
    return response.Data
  }
  protected async _delete<T>(t: ClassConstructor<T>, url: string) {
    let response = await this.requestService.delete<HowellResponse<T>>(url)
    response.Data = plainToClass(t, response.Data)
    return response.Data
  }
  protected async _get<T>(t: ClassConstructor<T>, url: string) {
    let response = await this.requestService.get<HowellResponse<T>>(url)
    response.Data = plainToClass(t, response.Data)
    return response.Data
  }
  protected async _list<T extends IPageParams, R>(
    r: ClassConstructor<R>,
    url: string,
    params: T
  ) {
    if (!params.PageSize) {
      params.PageSize = RequestHelper.maxSize
    }
    let response = await this.requestService.post<
      T,
      HowellResponse<PagedList<R>>
    >(url, params)

    response.Data.Data = plainToClass(r, response.Data.Data)
    return response.Data
  }
}
