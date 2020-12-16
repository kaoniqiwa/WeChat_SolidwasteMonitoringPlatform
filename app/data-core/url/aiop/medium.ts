import {  IUrl, BaseUrl} from "../IUrl";

export class MediumPicture extends BaseUrl   {  
    getData(id: string) {
        return this.gateway+`Pictures/${id}/Data`;
    }

    getJPG(id: string) {
        return this.gateway+`Pictures/${id}.jpg`;
    }


}