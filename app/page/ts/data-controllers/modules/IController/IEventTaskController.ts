import { PagedList } from '../../../../../data-core/model/page'
import { ILiveUrl, OneDay } from '../../IController'
import { EventTaskViewModel, IPictureController } from '../../ViewModels'

export interface IEventTaskController extends ILiveUrl {
  picture: IPictureController
  getEventTaskList(
    day: OneDay,
    isHandle: boolean,
    isFinished: boolean
  ): Promise<PagedList<EventTaskViewModel>>

  getAvailableEventTaskList(day: OneDay): Promise<PagedList<EventTaskViewModel>>

  Take(id: string): Promise<EventTaskViewModel>

  Daily(
    date: Date,
    timeout: boolean,
    finished: boolean
  ): Promise<PagedList<EventTaskViewModel>>
}
