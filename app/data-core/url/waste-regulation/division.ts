import { IUrl, BaseUrl,GarbageBaseUrl } from "../IUrl";

export class Division extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'Divisions';
    }
    edit(id: string): string {
        return this.aiop + `Divisions/${id}`;
    }
    del(id: string): string {
        return this.aiop + `Divisions/${id}`;
    }
    get(id: string): string {
        return this.aiop + `Divisions/${id}`;
    }
    list(): string {
        return this.aiop + `Divisions/List`;
    }

    garbageStations(id: string): string {
        return this.aiop+`Divisions/${id}/GarbageStations`;
    }

    tree(): string {
        return this.aiop + `Divisions/Tree`;
    }

    volumesHistory(id: string): string {
        return this.aiop+`Divisions/${id}/Volumes/History/List`;
    }

    eventNumbersHistory(id: string): string {
        return this.aiop+`Divisions/${id}/EventNumbers/History/List`;
    }

    statisticNumber(id: string): string {
        return this.aiop+`Divisions/${id}/Statistic/Number`;
    }

    statisticNumberList(): string {
        return this.aiop + `Divisions/Statistic/Number/List`;
    }
}