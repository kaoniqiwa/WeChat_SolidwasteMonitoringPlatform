import Swiper from "swiper";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { CameraImageUrl, GarbageDropEventRecord, IllegalDropEventRecord, MixedIntoEventRecord } from "../../../data-core/model/waste-regulation/event-record";
import { Flags, GarbageStation, StationState } from "../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { VideoUrl } from "../../../data-core/model/waste-regulation/video-model";
import { Service } from "../../../data-core/repuest/service";


export interface IImageUrl {    
    cameraId: string;    
    url: string;
    cameraName?:string;
    preview?: Promise<VideoUrl>;
    playback?: Promise<VideoUrl>;
}

export interface IActiveElement {
    Element: HTMLDivElement,
    id: string,
    divisionId: string,
    imageUrls: Array<IImageUrl>,
    state: Flags<StationState>
    swiper?: Swiper
  }


export class GarbageStationViewModel extends GarbageStation {
    constructor(service: Service) {
        super();
        this.service = service;
    }
    private service: Service;

    NumberStatistic: GarbageStationNumberStatistic;

    getNumberStatistic() {
        return this.service.garbageStation.statisticNumber(this.Id);
    }

}

export class CameraViewModel extends Camera {
    constructor(service: Service) {
        super();
        this.service = service;
    }
    private service: Service;
    getPreviewUrl() {
        return this.service.sr.PreviewUrls({
            CameraId: this.Id,
            Protocol: "ws-ps",
            StreamType: 2
        });
    }
    getVodUrl(begin: Date, end: Date) {
        return this.service.sr.VodUrls({
            CameraId: this.Id,
            StreamType: 1,
            Protocol: "ws-ps",
            BeginTime: begin.toISOString(),
            EndTime: end.toISOString()
        });
    }
}

export class ViewModelConverter {
    static Convert(service: Service, model: GarbageStation): GarbageStationViewModel;
    static Convert(service: Service, model: Camera): CameraViewModel;    
    static Convert(service: Service, model:
        GarbageStation |
        Camera ):

        GarbageStationViewModel |
        CameraViewModel {
        if (model instanceof GarbageStation) {
            return Object.assign(new GarbageStationViewModel(service), model);
        }
        else if (model instanceof Camera) {
            return Object.assign(new CameraViewModel(service), model);
        }
        else { }
    }




}