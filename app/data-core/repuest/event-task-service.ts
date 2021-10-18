import { GarbageStationRequestService } from './garbage-station.service'
import { HowellHttpClient } from './http-client'
import { GetGarbageStationStatisticNumbersParams } from '../model/waste-regulation/garbage-station-number-statistic'
import { GetGarbageStationsParams } from '../model/waste-regulation/garbage-station'
import { HowellAuthHttp } from './howell-auth-http'
import {
  Destination,
  EventTask,
  EventTaskDestinationScheme,
  EventTaskScheme,
  GetAvailableEventTasksParams,
  GetEventTaskSchemeParams,
  GetEventTasksDailyParams,
  GetEventTasksParams,
  GetProcessorSchemeDailyParams,
  GetProcessorSchemesParams,
  GetTaskDestinationSchemesParams,
  GetTaskDestinationsParams,
  GetTaskProcessorsParams,
  ProcessorScheme,
  TaskProcessor,
  TaskPublisher,
  TaskScore,
} from '../model/waste-regulation/event-task'
import { classToPlain, plainToClass } from 'class-transformer'
import { EventTaskUrl } from '../url/waste-regulation/event-task'
import { HowellResponse } from '../model/response'
import { RequestHelper } from '../dao/request-helper'
import { PagedList } from '../model/page'
import { BaseRequestService } from './base-service'

export class EventTaskRequestService extends BaseRequestService {
  available: EventTasksAvailableRequestService
  processor: EventTaskProcessorRequestService
  destination: EventTaskDestinationRequestService
  daily: EventTaskDailyRequestService
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
    this.available = new EventTasksAvailableRequestService(requestService)
    this.processor = new EventTaskProcessorRequestService(requestService)
    this.destination = new EventTaskDestinationRequestService(requestService)
    this.daily = new EventTaskDailyRequestService(requestService)
  }
  /** 创建发布任务信息 */
  create(item: EventTask) {
    return super._post(EventTask, EventTaskUrl.base(), item)
  }
  /** 查询发布任务信息 */
  get(id: string) {
    return super._get(EventTask, EventTaskUrl.item(id))
  }
  /** 修改发布任务信息 */
  set(item: EventTask) {
    return super._put(EventTask, EventTaskUrl.item(item.Id), item)
  }
  /** 删除发布任务信息 */
  delete(id: string) {
    return super._delete(EventTask, EventTaskUrl.item(id))
  }
  /** 接取发布任务 */
  async take(id: string) {
    return super._post(EventTask, EventTaskUrl.take(id))
  }
  /** 完成发布任务 */
  async complete(id: string, description: string) {
    return super._post(EventTask, EventTaskUrl.complete(id, description))
  }
  /** 发布任务评分 */
  async score(id: string, score: TaskScore) {
    return super._post(EventTask, EventTaskUrl.score(id), score)
  }
  /** 获取发布任务列表 */
  async list(params: GetEventTasksParams) {
    return super._list(EventTask, EventTaskUrl.list(), params)
  }
  /** 获取用户辖区下的每日任务数量 */
  async scheme(params: GetEventTaskSchemeParams) {
    return super._post(EventTaskScheme, EventTaskUrl.scheme(), params)
  }
}

class EventTasksAvailableRequestService extends BaseRequestService {
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
  }
  /** 获取可接单处置任务列表 */
  async list(params: GetAvailableEventTasksParams) {
    return super._list(EventTask, EventTaskUrl.available.list(), params)
  }
}

class EventTaskProcessorRequestService extends BaseRequestService {
  scheme: EventTaskProcessorSchemeRequestService
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
    this.scheme = new EventTaskProcessorSchemeRequestService(requestService)
  }
  /** 创建任务处置人员 */
  create(item: TaskProcessor) {
    return super._post(TaskProcessor, EventTaskUrl.processors.base(), item)
  }
  /** 获取任务处置人员 */
  get(id: string) {
    return super._get(TaskProcessor, EventTaskUrl.processors.item(id))
  }
  /** 修改任务处置人员 */
  set(item: TaskProcessor) {
    return super._put(
      TaskProcessor,
      EventTaskUrl.processors.item(item.Id),
      item
    )
  }
  /** 删除任务处置人员 */
  delete(id: string) {
    return super._delete(TaskProcessor, EventTaskUrl.processors.item(id))
  }
  /** 获取任务处置人员列表 */
  async list(params: GetTaskProcessorsParams) {
    return super._list(TaskProcessor, EventTaskUrl.processors.list(), params)
  }
}
class EventTaskProcessorSchemeRequestService extends BaseRequestService {
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
  }
  list(params: GetProcessorSchemesParams) {
    return super._list(
      ProcessorScheme,
      EventTaskUrl.processors.scheme.list(),
      params
    )
  }
  async daily(params: GetProcessorSchemeDailyParams) {
    return super._post(
      ProcessorScheme,
      EventTaskUrl.processors.scheme.daily(),
      params
    )
  }
}

class EventTaskDestinationRequestService extends BaseRequestService {
  scheme: EventTaskDestinationSchemeRequestService

  constructor(requestService: HowellAuthHttp) {
    super(requestService)
    this.scheme = new EventTaskDestinationSchemeRequestService(requestService)
  }
  create(item: Destination) {
    return super._post(Destination, EventTaskUrl.destinations.base(), item)
  }
  get(id: string) {
    return super._get(Destination, EventTaskUrl.item(id))
  }
  set(item: Destination) {
    return super._put(Destination, EventTaskUrl.item(item.Id), item)
  }
  delete(id: string) {
    return super._delete(Destination, EventTaskUrl.item(id))
  }
  list(params: GetTaskDestinationsParams) {
    return super._list(Destination, EventTaskUrl.list(), params)
  }
}

class EventTaskDestinationSchemeRequestService extends BaseRequestService {
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
  }
  list(params: GetEventTasksDailyParams) {
    return super._list(
      EventTask,
      EventTaskUrl.destinations.scheme.list(),
      params
    )
  }
}

class EventTaskDailyRequestService extends BaseRequestService {
  constructor(requestService: HowellAuthHttp) {
    super(requestService)
  }
  list(params: GetEventTasksDailyParams) {
    return super._list(EventTask, EventTaskUrl.daily.list(), params)
  }
}
