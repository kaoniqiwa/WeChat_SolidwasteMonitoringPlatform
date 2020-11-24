export class Medium{
    add(){
        return `Medium/Pictures`;
    }
    
    getData(id:string){
        return `Medium/Pictures/${id}.jpg`;
    }

    getJPG(jpg:string){
        return `Medium/Pictures/${jpg}`; 
    }
}
