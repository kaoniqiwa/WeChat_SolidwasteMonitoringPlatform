import { IUrl, BaseUrl } from "../IUrl";

export class Region extends BaseUrl implements IUrl {
    create(): string {
        return this.gateway + 'Regions';
    }
    edit(id: string): string {
        return this.gateway + `Regions/${id}`;
    }
    del(id: string): string {
        return this.gateway + `Regions/${id}`;
    }
    get(id: string): string {
        return this.gateway + `Regions/${id}`;
    }
    list(): string {
        return this.gateway + 'Regions/List';
    }

}

export class  RegionsResources  extends BaseUrl {
    batch(id: string): string {
        return this.gateway + `Regions/${id}/Resources`;
    }

    create(regionId: string,resourceId: string): string {    
        return this.gateway + `Regions/${regionId}/Resources/${resourceId}`;
    }
   
    del(regionId: string,resourceId: string): string {
        return this.gateway + `Regions/${regionId}/Resources/${resourceId}`;
    }
    get(regionId: string,resourceId: string): string {
        return this.gateway + `Regions/${regionId}/Resources/${resourceId}`;
    }

}