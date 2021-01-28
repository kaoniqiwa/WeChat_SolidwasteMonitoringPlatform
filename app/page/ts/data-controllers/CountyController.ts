import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { DivisionController } from "./DivisionController";

export class CountDivisionController extends DivisionController {
    getResourceRoleList = async () => {

        let result = new Array<ResourceRole>();

        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            let promise = await this.service.division.list({ ParentId: role.Id });
            result = result.concat(promise.Data.Data.map(x => {
                let r = new ResourceRole();
                r.Id = x.Id;
                r.Name = x.Name;
                r.ResourceType = ResourceType.County;
                return r;
            }))
        }
        return result;

    }
} 