
 
export class SearchControl {

    beginDate = '';
    endDate = '';
    state = false;
    other = false;
    searchform = {         
        DivisionId: '',
        SearchText: '',
    }
    constructor() {      

    }

    set divisionId(val: string) {
        this.searchform.DivisionId = val;
    }

 

    get divisionId() {
        return this.searchform.DivisionId;
    }


   
    clearState() {
        this.state = false;
        this.searchform = {          
            DivisionId: '',
            SearchText: '',
        }
    }

    toSearchParam() {
        const param = this.searchform as SearchParam;
        return param;
    }
}


export class SearchParam {    
    DivisionId: string;
    SearchText: string;
}