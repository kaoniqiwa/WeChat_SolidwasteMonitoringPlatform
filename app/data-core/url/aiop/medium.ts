import {  IUrl, BaseUrl} from "../IUrl";

export class MediumPicture extends BaseUrl   {  
    getData(id: string) {
        return this.aiop+`Pictures/${id}/Data`;
    }

    getJPG(id: string) {
        return this.aiop+`Pictures/${id}.jpg`;
    }


}