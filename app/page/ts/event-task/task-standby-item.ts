import ItemTemplate from '../../event-task/task-standby-item.html'
import { IEventTaskController } from '../data-controllers/modules/IController/IEventTaskController'
import { ToastMessage } from '../data-controllers/modules/ToastMessage'
import { EventTaskViewModel } from '../data-controllers/ViewModels'
import { Language } from '../language'
import { EventTaskItem } from './task-item'
import $ from 'jquery'

export class StandbyEventTaskItem extends EventTaskItem {
  constructor(
    parent: HTMLElement,
    private controller: IEventTaskController,
    private message: ToastMessage
  ) {
    super(parent, 'event-task-item', ItemTemplate)
    console.log('standby')
    this.btnOKClickedEvent = (entity: EventTaskViewModel) => {
      this.onOKButtonClicked(entity)
    }
  }

  onOKButtonClicked(entity: EventTaskViewModel) {
    if (this.message) this.message.show('任务接受成功')
    let result = this.controller.Take(entity.Id)
    result.then((x) => {
      if (this.message) this.message.show('任务接受成功')
    })
  }

  getPicture(id: string) {
    return this.controller.picture.get(id)
  }

  set(entity: EventTaskViewModel) {
    return super.set(entity)
  }
}
