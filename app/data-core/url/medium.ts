
import {  IUrl, BaseUrl} from "./IUrl";
export class Mediume extends BaseUrl {
    add(){
        return this.aiop+`Medium/Pictures`;
    }
    
    getData(id:string){
        return this.aiop+`Medium/Pictures/${id}.jpg`;
    }

    getJPG(jpg:string){
        return this.aiop+`Medium/Pictures/${jpg}`; 
    }
} 