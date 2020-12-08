
 
import { TheDay } from "../../common/tool";
export class SearchControl {

    beginDate = '';
    endDate = '';
    state = false;
    other = false;
    searchform = {
        BeginTime: '',
        EndTime: '',
        DivisionId: '',
        StationId: '',
        SearchText: '',
    }
    constructor() {

       this.day=0;

    }

    set day(val: number) {
        const d = TheDay(val);
        this.searchform.BeginTime = d.begin.toISOString();
        this.searchform.EndTime = d.end.toISOString();
    } 
    set divisionId(val: string) {
      
        this.searchform.DivisionId = val;
    }

    set stationId(val: string) {
     
        this.searchform.StationId = val;
    }

    get divisionId() {
        return this.searchform.DivisionId;
    }

    get stationId() {
        return this.searchform.StationId;
    }

    set formBeginDate(v: Date) {
        this.searchform.BeginTime =v.toISOString();
    }

    set formEndDate(v: Date) {
        this.searchform.EndTime=v.toISOString();
    }

    set text(val:string){
        this.searchform.SearchText=val;
    }
 
    clearState() {
        this.state = false;
        this.searchform = {
            BeginTime: '',
            EndTime: '',
            DivisionId: '',
            StationId: '',
            SearchText: '',
        }
    }

    toSearchParam() {
        const param = this.searchform as SearchParam;
        return param;
    }
}


export class SearchParam {
    BeginTime: string;
    EndTime: string;
    DivisionId: string;
    StationId: string;
    SearchText: string;
}