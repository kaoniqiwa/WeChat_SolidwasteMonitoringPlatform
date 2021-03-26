import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { CommitteesDivisionController } from "./CommitteesDivisionController";
import { CountDivisionController } from "./CountDivisionController";
import { GarbageStationController } from "./GarbageStationController";

export class ControllerFactory {
    static Create(service: Service, type: ResourceType, resources: ResourceRole[]) {
        
        switch (type) {
            case ResourceType.County:
                return new CountDivisionController(service, resources);
            case ResourceType.Committees:
                return new CommitteesDivisionController(service, resources);
            case ResourceType.GarbageStations:
                return new GarbageStationController(service, resources);
            default:
                throw Error("ResourceType is error:" + type);
        }
    }
}