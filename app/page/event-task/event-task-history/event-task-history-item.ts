import { IEventTaskController } from '../../ts/data-controllers/modules/IController/IEventTaskController'
import { EventTaskViewModel } from '../../ts/data-controllers/ViewModels'
import { EventTaskItem } from '../../ts/event-task/task-item'
import ItemTemplate from './event-task-history-item.html'

export class EventTaskHistoryItem extends EventTaskItem {
  constructor(parent: HTMLElement, private controller: IEventTaskController) {
    super(parent, 'event-task-item history', ItemTemplate)
    console.log('standby')
    this.btnOKClickedEvent = (entity: EventTaskViewModel) => {
      this.onOKButtonClicked(entity)
    }
  }

  onOKButtonClicked(entity: EventTaskViewModel) {}

  getPicture(id: string): string {
    return this.controller.picture.get(id)
  }

  set(entity: EventTaskViewModel) {
    return super.set(entity)
  }
}
