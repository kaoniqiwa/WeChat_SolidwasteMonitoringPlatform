import { BaseUrl, IUrl } from "../IUrl";
export class AIModel extends BaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'AIModels';
    }
    edit(id: string): string {
        return this.aiop + `AIModels/${id}`
    }
    del(id: string): string {
        return this.aiop + `AIModels/${id}`
    }
    get(id: string): string {
        return this.aiop + `AIModels/${id}`
    }
    list(): string {
        return this.aiop + `AIModels/List`;
    }

    parse() {
        return this.aiop + `AIModels/Parse`;
    }
}