import { StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { GenderType, ResourceType } from "../../data-core/model/we-chat";

export class Language {
    static ResourceType(type: ResourceType) {
        switch (type) {
            case ResourceType.County:
                return '街道';
            case ResourceType.Committees:
                return '居委会';
            case ResourceType.GarbageStations:
                return '厢房';
            default:
                return ''
        }
    }

    static Gender(gender: GenderType) {
        switch (gender) {
            case GenderType.unknow:                
                return '未知';
            case GenderType.male:
                return '男';
            case GenderType.female:
                return '女'
            default:
                return '';
        }
    }

    static StationState(state: StationState) {
        switch (state) {
            case StationState.Normal:
                return '正常';
            case StationState.Full:
                return '满溢';
            case StationState.Error:
                return '异常';
            default:
                return '';
        }
    }
}

export class ClassNameHelper{
    static StationState(state: StationState) {
        switch (state) {
            case StationState.Normal:
                return 'green';
            case StationState.Full:
                return 'orange';
            case StationState.Error:
                return 'red';
            default:
                return '';
        }
    }
}