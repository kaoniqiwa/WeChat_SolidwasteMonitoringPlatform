import { EventType } from "../../data-core/model/waste-regulation/event-number";
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
    static EventType(type: EventType) {
        switch (type) {
            case EventType.IllegalDrop:
                return '乱扔垃圾事件';
            case EventType.MixedInto:
                return '混合投放事件';
            case EventType.GarbageVolume:
                return '垃圾容量事件';
            case EventType.GarbageFull:
                return '垃圾满溢事件';
                case EventType.GarbageDrop:
                    return '垃圾落地事件';
                case EventType.GarbageDropHandle:
                    return '垃圾落地事件 已处置';
                    case EventType.GarbageDropTimeout:
                    return '垃圾落地事件 已超时';
            default:
                return '';
        }
    }

    static Gender(gender: GenderType) {
        switch (gender) {
            case GenderType.unknow:
                return '';
            case GenderType.male:
                return '男';
            case GenderType.female:
                return '女'
            default:
                return '  ';
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

export class ClassNameHelper {
    static StationState(state: StationState) {
        switch (state) {
            case StationState.Normal:
                return 'green';
            case StationState.Full:
                return 'orange';
            case StationState.Error:
                return 'red';
            default:
                return 'unknow';
        }
    }
}