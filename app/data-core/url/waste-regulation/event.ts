import { GarbageBaseUrl } from "../IUrl";

export class EventRecord extends GarbageBaseUrl{
    infoList() {
        return this.gateway+`Events/Infos/List`;
    }

    infoEventType() {
        return this.gateway+`Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return this.gateway+ `Events/Records/IllegalDrop/List`;
    }

    mixedIntoList() {
        return this.gateway+`Events/Records/MixedInto/List`;
    } 

    illegalDropSingle(id:string){
        return this.gateway+`Events/Records/IllegalDrop/${id}`;
    }
}
 