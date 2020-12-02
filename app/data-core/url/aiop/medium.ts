 
export class MediumPicture {  
    getData(id: string) {
        return `Pictures/${id}/Data`;
    }

    getJPG(id: string) {
        return `Pictures/${id}.jpg`;
    }


}