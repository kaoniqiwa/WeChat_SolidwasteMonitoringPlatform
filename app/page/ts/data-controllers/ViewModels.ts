import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";

export class GarbageStationViewModel extends GarbageStation {
    NumberStatistic?: GarbageStationNumberStatistic
}

export class ViewModelConverter {
    static Convert(model: GarbageStation): GarbageStationViewModel {
        if (model instanceof GarbageStation) {
            return Object.assign(GarbageStationViewModel, model);
        }        
    }
}