import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic } from "../../../data-core/model/waste-regulation/garbage-station-number-statistic";

export class GarbageStationViewModel extends GarbageStation {
    NumberStatistic: GarbageStationNumberStatistic
}

export class ViewModelConverter {
    static Convert(model: GarbageStation): GarbageStationViewModel {
        let vm = new GarbageStationViewModel();
        vm.Id = model.Id;
        vm.MaxDryVolume = model.MaxDryVolume;
        vm.MaxWetVolume = model.MaxWetVolume;
        vm.Name = model.Name;
        vm.StationState = model.StationState;
        vm.StationType = model.StationType;
        vm.TrashCans = model.TrashCans;
        vm.UpdateTime = model.UpdateTime;
        vm.WetFull = model.WetFull;
        vm.WetFullTime = model.WetFullTime;
        vm.WetVolume = model.WetVolume;
        return vm;
    }
}