import ItemTemplate from '../../event-task/task-complate-item.html'
import { IEventTaskController } from '../data-controllers/modules/IController/IEventTaskController'
import { ToastMessage } from '../data-controllers/modules/ToastMessage'
import {
  EventTaskViewModel,
  IPictureController,
} from '../data-controllers/ViewModels'
import { Language } from '../language'
import { EventTaskItem } from './task-item'
export class ComplateEventTaskItem extends EventTaskItem {
  constructor(
    parent: HTMLElement,
    private controller: IEventTaskController,
    message: ToastMessage
  ) {
    super(parent, 'event-task-item', ItemTemplate)
    console.log('complate')
  }
  getPicture(id: string): string {
    return this.controller.picture.get(id)
  }
  set(entity: EventTaskViewModel) {
    return super.set(entity)
  }
}
