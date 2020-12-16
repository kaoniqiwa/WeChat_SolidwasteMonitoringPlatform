import { BaseUrl, IUrl } from "../IUrl";
export class AIModel extends BaseUrl implements IUrl {
    create(): string {
        return this.gateway + 'AIModels';
    }
    edit(id: string): string {
        return this.gateway + `AIModels/${id}`
    }
    del(id: string): string {
        return this.gateway + `AIModels/${id}`
    }
    get(id: string): string {
        return this.gateway + `AIModels/${id}`
    }
    list(): string {
        return this.gateway + `AIModels/List`;
    }

    parse() {
        return this.gateway + `AIModels/Parse`;
    }
}