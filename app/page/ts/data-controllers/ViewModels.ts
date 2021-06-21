import Swiper from 'swiper'
import { UserLabelType } from '../../../data-core/model/user-stystem'
import { Camera } from '../../../data-core/model/waste-regulation/camera'
import { Division } from '../../../data-core/model/waste-regulation/division'
import {
  CameraImageUrl,
  GarbageDropEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../../../data-core/model/waste-regulation/event-record'
import {
  Flags,
  GarbageStation,
  StationState,
} from '../../../data-core/model/waste-regulation/garbage-station'
import { GarbageStationNumberStatistic } from '../../../data-core/model/waste-regulation/garbage-station-number-statistic'
import { VideoUrl } from '../../../data-core/model/waste-regulation/video-model'
import { Service } from '../../../data-core/repuest/service'
import { DataCache } from './Cache'

export interface IImageUrl {
  cameraId: string
  url: string
  cameraName?: string
  preview?: Promise<VideoUrl>
  playback?: Promise<VideoUrl>
}

export interface IPictureController {
  post: (data: string) => Promise<string>
  get: (id: string) => string
}

export interface IActiveElement {
  Element: HTMLDivElement
  id: string
  divisionId: string
  imageUrls: Array<IImageUrl>
  state: Flags<StationState>
  swiper?: Swiper
}

export class GarbageStationViewModel extends GarbageStation {
  constructor(service: Service) {
    super()
    this.service = service
  }
  private service: Service

  NumberStatistic?: GarbageStationNumberStatistic

  getNumberStatistic() {
    return this.service.garbageStation.statisticNumber(this.Id)
  }

  getUserLabel() {
    return this.service.user.label.get(this.Id, UserLabelType.garbageStation)
  }
}

export class CameraViewModel extends Camera {
  static readonly defaultImageUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKIAQAAAAAgULygAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAd2KE6QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQflAgIBCxpFwPH8AAAAcklEQVR42u3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+A28XAAEDwmj2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTAyVDAxOjExOjI2KzAwOjAwOo9+nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0wMlQwMToxMToyNiswMDowMEvSxiAAAAAASUVORK5CYII='
  constructor(service: Service) {
    super()
    this.service = service
  }
  private service: Service
  getImageUrl() {
    if (this.ImageUrl) {
      return this.service.picture(this.ImageUrl)
    } else {
      return CameraViewModel.defaultImageUrl
    }
  }
  getPreviewUrl() {
    return this.service.sr.PreviewUrls({
      CameraId: this.Id,
      Protocol: 'ws-ps',
      StreamType: 2,
    })
  }
  getVodUrl(begin: Date, end: Date) {
    return this.service.sr.VodUrls({
      CameraId: this.Id,
      StreamType: 1,
      Protocol: 'ws-ps',
      BeginTime: begin.toISOString(),
      EndTime: end.toISOString(),
    })
  }
}

export class ViewModelConverter {
  static Convert(
    service: Service,
    model: GarbageStation
  ): GarbageStationViewModel
  static Convert(service: Service, model: Camera): CameraViewModel
  static Convert(
    service: Service,
    model: GarbageStation | Camera
  ): GarbageStationViewModel | CameraViewModel | undefined {
    if (model instanceof GarbageStation) {
      return Object.assign(new GarbageStationViewModel(service), model)
    } else if (model instanceof Camera) {
      return Object.assign(new CameraViewModel(service), model)
    } else {
    }
  }
}
