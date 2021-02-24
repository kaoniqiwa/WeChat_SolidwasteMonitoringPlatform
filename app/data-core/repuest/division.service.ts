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
import { plainToClass } from "class-transformer";
 
export class DivisionRequestService extends SaveModel{
    url: url.Division;
    constructor(private requestService: HowellAuthHttp) {
        super();
        this.url = new url.Division();
    }
    async create(item:Division){ 
        let response = await this.requestService.post<Division, Response<Division>>(this.url.create(), this.toModel(item,this.formMustField.division));
        return plainToClass(Division, response.Data);
    }

    async createMore(item:BatchRequest){ 
        let response = await this.requestService.post<BatchRequest, Response<BatchResult>>(this.url.create(), item);
        return plainToClass(BatchResult, response.Data);
    }

    async get(id: string) {
        let response = await this.requestService.get<Response<Division>>(this.url.get(id));
        return plainToClass(Division, response.Data);
    }

    async set(item: Division){
        let response = await this.requestService.put<Division, Response<Division>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.division));
        return plainToClass(Division, response.Data);
    }

    async del(id: string) {
        let response = await this.requestService.delete<Response<Division>>(this.url.del(id));
        return plainToClass(Division, response.Data);
    }

    async list(item:GetDivisionsParams){
        let response = await this.requestService.post<GetDivisionsParams, Response<PagedList<Division>>>(this.url.list(), item);
        response.Data.Data =  plainToClass(Division, response.Data.Data);
        return response.Data;
    }

    async tree(){
        let response = await this.requestService.get<Response<DivisionTree>>(this.url.tree());
        return plainToClass(DivisionTree, response.Data);
    }

    async volumesHistory(item:PageTimeUnitParams,divisionsId:string){
        let response = await this.requestService.post<PageTimeUnitParams, Response<PagedList<GarbageVolume>>>(this.url.volumesHistory(divisionsId), item);
        response.Data.Data =  plainToClass(GarbageVolume, response.Data.Data);
        return response.Data;
    }

    async eventNumbersHistory(item:PageTimeUnitParams,divisionsId:string){
        let response = await this.requestService.post<PageTimeUnitParams, Response<PagedList<EventNumberStatistic>>>(this.url.eventNumbersHistory(divisionsId), item);
        response.Data.Data =  plainToClass(EventNumberStatistic, response.Data.Data);
        return response.Data;
    }

    async statisticNumber(divisionsId: string) {
        let response = await this.requestService.get<Response<DivisionNumberStatistic>>(this.url.statisticNumber(divisionsId));
        return plainToClass(Division, response.Data);
    }

    async statisticNumberList(item:GetDivisionStatisticNumbersParams){
        let response = await this.requestService.post<GetDivisionStatisticNumbersParams, Response<PagedList<DivisionNumberStatistic>>>(this.url.statisticNumberList(), item);
        response.Data.Data =  plainToClass(DivisionNumberStatistic, response.Data.Data);
        return response.Data;
    }
}


