import { ResourceRole } from '../../../data-core/model/we-chat'
import { CameraViewModel, GarbageStationViewModel } from './ViewModels'

export class DataCache {
  static GarbageStations?: Array<GarbageStationViewModel>
  static ResourceRoles?: Array<ResourceRole>
  static Cameras: Global.Dictionary<Array<CameraViewModel>> = {}
  static Images: Global.Dictionary<HTMLImageElement> = {}
}
