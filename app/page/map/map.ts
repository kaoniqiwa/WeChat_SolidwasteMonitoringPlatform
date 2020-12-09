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
let selectData = new Set();

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
    selectData.clear();
    document.querySelectorAll('input[type=checkbox]').forEach(item => {
        (item as HTMLInputElement).checked = false
    })
})
confirmBtn.addEventListener('click', function () {
    console.log('confirm')
    solidWaste.className = '';
    solidWaste.classList.add('slide-fade-leave-active');
    solidWaste.classList.add('slide-fade-leave-to');
    isShow = false;
    console.log(selectData)
})

import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { GarbageStationRequestService } from "../../data-core/repuest/garbage-station.service";
import { GetGarbageStationsParams } from "../../data-core/model/waste-regulation/garbage-station";
import { Page } from "../../data-core/model/page";
import { Point } from "../../data-core/model/point";



class StationList {
    myList: HTMLElement | null;
    myTemplate: HTMLTemplateElement | null;
    constructor(private service: {
        garbageStation: GarbageStationRequestService,
    }) {
        this.myList = document.querySelector('#myList') as HTMLElement;
        this.myTemplate = document.querySelector('#myTemplate') as HTMLTemplateElement;
    }
    LoadGarbageStation(pageIndex: number) {
        const request = new GetGarbageStationsParams();
        request.PageSize = pageSize;
        request.PageIndex = pageIndex;

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

                    checkbox.addEventListener('click', function (e) {
                        let id = this.getAttribute('id');
                        console.log(id)
                        if (selectData.has(id)) {
                            selectData.delete(id)
                        } else {
                            selectData.add(this.getAttribute('id'))
                        }
                        console.log(selectData)
                    })

                    this.myList?.appendChild(info)
                })
            }
        });
    }
}

const client = new HowellHttpClient.HttpClient();
client.login((http: HowellAuthHttp) => {
    list = new StationList({
        garbageStation: new GarbageStationRequestService(http),
    });
    list.LoadGarbageStation(pageIndex);
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


// let mapClient = new CesiumMapClient("iframe");
// let dataController: any;

// console.log(mapClient.Events)
// mapClient.Events.OnLoading = function () {
//     alert('sss')
//     console.log("client.Events.OnLoading");
//     //    let  dataController = new CesiumDataController.Controller('192.168.21.241',8890,function(){

//     //     })
//     // let lng = // dataController.Point.Get(DivisionId,Id)

//     // client.Draw.Routing.Draw([begin, end], CesiumDataController.RoutingType.Driving);

// }
