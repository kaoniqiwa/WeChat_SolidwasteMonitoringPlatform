import { GarbageBaseUrl } from "../IUrl";

export class EventRecord extends GarbageBaseUrl {
    infoList() {
        return this.gateway + `Events/Infos/List`;
    }

    infoEventType() {
        return this.gateway + `Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return this.gateway + `Events/Records/IllegalDrop/List`;
    }
    illegalDropSingle(id: string) {
        return this.gateway + `Events/Records/IllegalDrop/${id}`;
    }

    mixedIntoList() {
        return this.gateway + `Events/Records/MixedInto/List`;
    }
    mixedIntoSingle(id: string) {
        return this.gateway + `Events/Records/MixedInto/${id}`;
    }

    garbageFullList() {
        return this.gateway + `Events/Records/GarbageFull/List`;
    }
    garbageFullSingle(id:string)
    {
        return this.gateway + `Events/Records/GarbageFull/${id}`;
    }
    garbageDropList() {
        return this.gateway + `Events/Records/GarbageDrop/List`;
    }
    garbageDropSingle(id:string)
    {
        return this.gateway + `Events/Records/GarbageDrop/${id}`;
    }
    

}
