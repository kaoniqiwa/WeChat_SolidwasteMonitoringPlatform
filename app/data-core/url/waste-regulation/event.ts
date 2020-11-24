import { GarbageBaseUrl } from "../IUrl";

export class EventRecord extends GarbageBaseUrl{
    infoList() {
        return this.aiop+`Events/Infos/List`;
    }

    infoEventType() {
        return this.aiop+`Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return this.aiop+ `Events/Records/IllegalDrop/List`;
    }

    mixedIntoList() {
        return this.aiop+`Events/Records/MixedInto/List`;
    }
}
 