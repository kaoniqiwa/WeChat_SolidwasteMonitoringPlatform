import { Camera } from '../../../data-core/model/waste-regulation/camera'
import {
  Division,
  DivisionType,
} from '../../../data-core/model/waste-regulation/division'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'
import { Service } from '../../../data-core/repuest/service'
import {
  CameraViewModel,
  CommitteesViewModel,
  CountyViewModel,
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
  static Convert(
    service: Service,
    model: GarbageStation | Camera | Division
  ):
    | GarbageStationViewModel
    | CameraViewModel
    | CountyViewModel
    | CommitteesViewModel
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
    } else {
    }
  }
}
