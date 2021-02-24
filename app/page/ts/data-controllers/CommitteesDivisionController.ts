import { ResourceRole, ResourceType } from "../../../data-core/model/we-chat";
import { Service } from "../../../data-core/repuest/service";
import { CountDivisionController } from "./CountDivisionController";

export class CommitteesDivisionController extends CountDivisionController {
    constructor(service: Service, roles: ResourceRole[]) {
		super(service, roles)
	}

    getResourceRoleList = async () => {
		let result = new Array<ResourceRole>();
		for (let i = 0; i < this.roles.length; i++) {
			const role = this.roles[i];

			let promise = await this.service.garbageStation.list({DivisionId:role.Id});	
			let current = promise.Data.map(x => {
				let role = new ResourceRole();
				role.ResourceType = ResourceType.Committees;
				role.Id = x.Id;
				role.Name = x.Name;
				return role;
			});
			result = result.concat(current);
		}	

		return result;

	}
} 