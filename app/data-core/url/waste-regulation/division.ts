import { IUrl, BaseUrl,GarbageBaseUrl } from "../IUrl";

export class Division extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.gateway + 'Divisions';
    }
    edit(id: string): string {
        return this.gateway + `Divisions/${id}`;
    }
    del(id: string): string {
        return this.gateway + `Divisions/${id}`;
    }
    get(id: string): string {
        return this.gateway + `Divisions/${id}`;
    }
    list(): string {
        return this.gateway + `Divisions/List`;
    }

    garbageStations(id: string): string {
        return this.gateway+`Divisions/${id}/GarbageStations`;
    }

    tree(): string {
        return this.gateway + `Divisions/Tree`;
    }

    volumesHistory(id: string): string {
        return this.gateway+`Divisions/${id}/Volumes/History/List`;
    }

    eventNumbersHistory(id: string): string {
        return this.gateway+`Divisions/${id}/EventNumbers/History/List`;
    }

    statisticNumber(id: string): string {
        return this.gateway+`Divisions/${id}/Statistic/Number`;
    }

    statisticNumberList(): string {
        return this.gateway + `Divisions/Statistic/Number/List`;
    }
}