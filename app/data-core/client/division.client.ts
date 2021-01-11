import { BatchRequest, BatchResult } from "../model/batch";
import { IPageParams, PagedList } from "../model/page";
import { Division, GetDivisionsParams, IGetDivisionsParams } from "../model/waste-regulation/division";
import { DivisionRequestService } from "../repuest/division.service";


export class DivisionClient {
    constructor(private service: DivisionRequestService) { }

    create(item: Division): Promise<Division> {
        let promise = this.service.create(item);
        return promise.then(x => {
            return x.Data;
        });
    }

    createMore(item: BatchRequest): Promise<BatchResult> {
        let promise = this.service.createMore(item);
        return promise.then(x => {
            return x.Data;
        });
    }

    get(id: string): Promise<Division> {
        let promise = this.service.get(id);
        return promise.then(x => {
            return x.data
        });
    }

    set(item: Division): Promise<Division> {
        let promise = this.service.set(item);
        return promise.then(x => {
            return x.Data
        });
    }

    del(id: string): Promise<Division> {
        return this.service.del(id);
    }

    list(iparams?: IGetDivisionsParams) :Promise<PagedList<Division>> {
        const params = new GetDivisionsParams();
        if (iparams) {
            Object.assign(params, iparams)
        }
        let promise = this.service.list(params);
        return promise.then(x=>{
            return x.Data;
        });
    }

}