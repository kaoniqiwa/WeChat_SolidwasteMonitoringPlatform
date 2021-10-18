import { Camera } from '../../../data-core/model/waste-regulation/camera'
import {
  Division,
  DivisionType,
} from '../../../data-core/model/waste-regulation/division'
import { EventTask } from '../../../data-core/model/waste-regulation/event-task'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'
import { Service } from '../../../data-core/repuest/service'
import {
  CameraViewModel,
  CommitteesViewModel,
  CountyViewModel,
  EventTaskViewModel,
  GarbageStationViewModel,
} from './ViewModels'

export class ViewModelConverter {
  static Convert(
    service: Service,
    model: GarbageStation
  ): GarbageStationViewModel
  static Convert(service: Service, model: Camera): CameraViewModel
  static Convert(
    service: Service,
    model: Division
  ): CountyViewModel | CommitteesViewModel

  static Convert(service: Service, model: EventTask): EventTaskViewModel

  static Convert(
    service: Service,
    model: GarbageStation | Camera | Division | EventTask
  ):
    | GarbageStationViewModel
    | CameraViewModel
    | CountyViewModel
    | CommitteesViewModel
    | EventTaskViewModel
    | undefined {
    if (model instanceof GarbageStation) {
      return Object.assign(new GarbageStationViewModel(service), model)
    } else if (model instanceof Camera) {
      return Object.assign(new CameraViewModel(service), model)
    } else if (model instanceof Division) {
      switch (model.DivisionType) {
        case DivisionType.County:
          return Object.assign(new CountyViewModel(service), model)
        case DivisionType.Committees:
          return Object.assign(new CommitteesViewModel(service), model)
        default:
          break
      }
    } else if (model instanceof EventTask) {
      return Object.assign(new EventTaskViewModel(service), model)
    } else {
    }
  }
}
