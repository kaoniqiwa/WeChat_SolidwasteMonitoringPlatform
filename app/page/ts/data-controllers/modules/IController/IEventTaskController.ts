import { PagedList } from '../../../../../data-core/model/page'
import { EventTask } from '../../../../../data-core/model/waste-regulation/event-task'
import { OneDay } from '../../IController'

export interface IEventTaskController {
  getEventTaskList(
    day: OneDay,
    isHandle: boolean,
    isFinished: boolean
  ): Promise<PagedList<EventTask>>
}
