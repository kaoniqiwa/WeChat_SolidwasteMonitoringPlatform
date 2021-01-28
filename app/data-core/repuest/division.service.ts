import { SaveModel } from "../model/save-model";
import { Division,GetDivisionsParams } from "../model/waste-regulation/division"; 
import { DivisionTree } from "../model/waste-regulation/division-tree"; 
import { DivisionNumberStatistic ,GetDivisionStatisticNumbersParams} from "../model/waste-regulation/division-number-statistic"; 
import { EventNumberStatistic } from "../model/waste-regulation/division-event-numbers"; 
import { GarbageVolume  } from "../model/waste-regulation/garbage-volume"; 
import * as url from "../url/waste-regulation/division";
import { PagedList, PageTimeUnitParams } from "../model/page";
import { BatchRequest,BatchResult } from "../model/batch";
import { Response } from "../model/response"; 
import { HowellAuthHttp } from "./howell-auth-http";
 
export class DivisionRequestService extends SaveModel{
    url: url.Division;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Division();
    }
    create(item:Division){ 
        return this.requestService.post<Division, Response<Division>>(this.url.create(), this.toModel(item,this.formMustField.division));
    }

    createMore(item:BatchRequest){ 
        return this.requestService.post<BatchRequest, Response<BatchResult>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.get<Response<Division>>(this.url.get(id));
    }

    set(item: Division){
        return this.requestService.put<Division, Response<Division>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.division));
    }

    del(id: string) {
        return this.requestService.delete<Division>(this.url.del(id));
    }

    list(item:GetDivisionsParams){
        return this.requestService.post<GetDivisionsParams, Response<PagedList<Division>>>(this.url.list(), item);
    }

    tree(){
        return this.requestService.get<DivisionTree>(this.url.tree());
    }

    volumesHistory(item:PageTimeUnitParams,divisionsId:string){
        return this.requestService.post<PageTimeUnitParams, Response<PagedList<GarbageVolume>>>(this.url.volumesHistory(divisionsId), item);
    }

    eventNumbersHistory(item:PageTimeUnitParams,divisionsId:string){
        return this.requestService.post<PageTimeUnitParams, Response<PagedList<EventNumberStatistic>>>(this.url.eventNumbersHistory(divisionsId), item);
    }

    statisticNumber(divisionsId: string) {
        return this.requestService.get<DivisionNumberStatistic>(this.url.statisticNumber(divisionsId));
    }

    statisticNumberList(item:GetDivisionStatisticNumbersParams){
        return this.requestService.post<GetDivisionStatisticNumbersParams, Response<PagedList<DivisionNumberStatistic>>>(this.url.statisticNumberList(), item);
    }
}


