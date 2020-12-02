

import { dateFormat } from "../../common/tool";
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

        const day = new Date();

        this.searchform.BeginTime = dateFormat(day, 'yyyy-MM-dd') + ' 00:00';
        this.searchform.EndTime = dateFormat(day, 'yyyy-MM-dd') + ' 23:59';

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

    get stationId(){
        return     this.searchform.StationId;
    }

    set formBeginDate(v: Date) {
        this.searchform.BeginTime = dateFormat(v, 'yyyy-MM-dd HH:mm');
    }

    set formEndDate(v: Date) {
        this.searchform.EndTime = dateFormat(v, 'yyyy-MM-dd HH:mm');
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