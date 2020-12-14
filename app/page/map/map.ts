declare namespace mui {
    export function init({

    }): void
}
let showPath: HTMLDivElement = document.querySelector('#show_path') as HTMLDivElement;
let solidWaste: HTMLDivElement = document.querySelector('#solid_waste') as HTMLDivElement;
let resetBtn: HTMLElement = document.querySelector('#resetBtn') as HTMLElement;
let confirmBtn: HTMLElement = document.querySelector('#confirmBtn') as HTMLElement;

// 总共有几页
let pageCount: number;

// 当前页
let pageIndex: number = 1;

// 每页显示个数
let pageSize: number;

// 当前页显示个数
let recordCount: number;

// 总共记录数
let totalRecordCount: number;

let page: Page;
let list: StationList;

let isShow: boolean = true;
let selectData = new Map();
let selectPositions = [];
let polyLine: CesiumDataController.Polyline;

let myLocation: CesiumDataController.Position;



let h = document.querySelector('.weui-form__control-area')?.clientHeight as number;
let h2 = document.querySelector('.mui-content')?.clientHeight as number;
pageSize = Math.floor((h - h2) / 50);

showPath.addEventListener('click', function () {
    if (!isShow) {

        solidWaste.className = '';

        solidWaste.classList.add('slide-fade-enter-active');
        solidWaste.classList.add('slide-fade-enter');
        isShow = true;

    } else {
        solidWaste.className = '';

        solidWaste.classList.add('slide-fade-leave-active');
        solidWaste.classList.add('slide-fade-leave-to');
        isShow = false
    }
})

resetBtn.addEventListener('click', function () {
    console.log('reset')
    reset()
})
confirmBtn.addEventListener('click', function () {
    console.log('confirm')
    solidWaste.className = '';
    solidWaste.classList.add('slide-fade-leave-active');
    solidWaste.classList.add('slide-fade-leave-to');
    isShow = false;
    selectPositions = [myLocation]
    selectData.forEach((v, k, m) => {
        let point: CesiumDataController.Point = dataController.Village.Point.Get(
            v.divisionId, v.id)
        selectPositions.push(point.position)
    })
    if (polyLine) {
        console.log(mapClient.Draw.Routing.Remove)
        mapClient.Draw.Routing.Remove(polyLine.id);
    }
    polyLine = mapClient.Draw.Routing.Drawing(selectPositions, CesiumDataController.RoutingType.Driving, { color: 'cyan' });

    // reset()
})
function reset() {
    selectData.clear();
    document.querySelectorAll('input[type=checkbox]').forEach(item => {
        (item as HTMLInputElement).checked = false
    });
    mapClient.Draw.Routing.Remove(polyLine.id);
    polyLine = null;
}

import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { GarbageStationRequestService } from "../../data-core/repuest/garbage-station.service";
import { GetGarbageStationsParams } from "../../data-core/model/waste-regulation/garbage-station";
import { Page } from "../../data-core/model/page";
import { DivisionRequestService } from "../../data-core/repuest/division.service";
import { GetDivisionsParams } from "../../data-core/model/waste-regulation/division";



class StationList {
    myList: HTMLElement | null;
    myTemplate: HTMLTemplateElement | null;
    constructor(private service: {
        division: DivisionRequestService,
        garbageStation: GarbageStationRequestService,
    }) {
        this.myList = document.querySelector('#myList') as HTMLElement;
        this.myTemplate = document.querySelector('#myTemplate') as HTMLTemplateElement;
    }

    async GetLocalDivision() {
        const params = new GetDivisionsParams();
        params.DivisionType = 3;
        const res = await this.service.division.list(params);
        if (res && res.Data && res.Data.Data && res.Data.Data.length > 0) {
            return res.Data.Data[0];
        }
    }

    async LoadGarbageStation(pageIndex: number) {

        const division = await this.GetLocalDivision();

        const request = new GetGarbageStationsParams();
        request.PageSize = pageSize;
        request.PageIndex = pageIndex;
        request.DivisionId = division.Id;

        return this.service.garbageStation.list(request).then(x => {
            console.log('garbageStation', x)

            page = x.Data.Page;
            if (this.myList && this.myTemplate) {
                let content = this.myTemplate?.content as DocumentFragment;
                this.myList.innerHTML = '';
                x.Data.Data.forEach(item => {
                    let info = content.cloneNode(true) as DocumentFragment;

                    let label = info.querySelector('label') as HTMLLabelElement;

                    label.setAttribute('for', item.Id);

                    let p = info.querySelector('div.weui-cell__bd > p') as HTMLParagraphElement;
                    p.textContent = item.Name;//+ item.Id;
                    let checkbox = info.querySelector('input[type=checkbox]') as HTMLInputElement
                    checkbox.setAttribute('id', item.Id);
                    checkbox.setAttribute('divisionId', item.DivisionId)

                    checkbox.addEventListener('click', function (e) {
                        let id = this.getAttribute('id');
                        let divisionId = this.getAttribute('divisionId');

                        if (selectData.has(id)) {
                            selectData.delete(id)
                        } else {
                            selectData.set(id, {
                                id, divisionId
                            })
                        }
                    })

                    this.myList?.appendChild(info)
                })
            }
        });
    }
}

const client = new HowellHttpClient.HttpClient();
let dataController: CesiumDataController.Controller;
let mapClient: CesiumMapClient;
client.login((http: HowellAuthHttp) => {
    list = new StationList({
        division: new DivisionRequestService(http),
        garbageStation: new GarbageStationRequestService(http),
    });
    list.LoadGarbageStation(pageIndex);


    let iframe = document.getElementById('iframe');
    iframe.src = "http://" + window.location.hostname + ":" + window.location.port + "/Amap/map_ts.html?maptype=AMapOffline&v=20191106";
    mapClient = new CesiumMapClient("iframe");
    

    console.log(mapClient.Events)
    mapClient.Events.OnLoading = function () {
        console.log("client.Events.OnLoading");
        dataController = new CesiumDataController.Controller(window.location.hostname, window.location.port, function () {

        })

    }
    mapClient.Events.OnLoaded = async ()=> {

        const division = await list.GetLocalDivision();

        mapClient.Village.Select(division.Id);

        myLocation = new CesiumDataController.Position(121.45155234063192, 31.23953);
        selectPositions[0] = myLocation;


        mapClient.Map?.GetLocation?.().then((res) => {
            myLocation = res;
            selectPositions[0] = myLocation
        })
    }



});




(function ($: any) {
    $('.mui-pagination').on('tap', 'a', function (this: HTMLAnchorElement) {
        var li = this.parentNode as HTMLLIElement;
        var classList = li.classList;
        if (classList.contains('mui-previous')) {
            console.log(page, pageIndex, page.PageCount)
            if (pageIndex > 1) {
                list.LoadGarbageStation(--pageIndex);
            }
        } else if (classList.contains('mui-next')) {
            console.log(page, pageIndex, page.PageCount)
            if (pageIndex < page.PageCount) {
                list.LoadGarbageStation(++pageIndex);
            }
        }
    });
})(mui);


