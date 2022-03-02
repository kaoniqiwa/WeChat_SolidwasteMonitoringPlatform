// declare namespace mui {
//     export function init({

//     }): void
// }

// let showPath: HTMLDivElement = document.querySelector('#show_path') as HTMLDivElement;
// let solidWaste: HTMLDivElement = document.querySelector('#solid_waste') as HTMLDivElement;
// let resetBtn: HTMLElement = document.querySelector('#resetBtn') as HTMLElement;
// let confirmBtn: HTMLElement = document.querySelector('#confirmBtn') as HTMLElement;

// let $ = Reflect.get(window, '$');
// let wx = Reflect.get(window, 'wx');

// $.get(`http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetJsSdkUiPackage?url=${document.location.toString()}&&appid=wx119358d61e31da01`, function (data: any) {

//     wx.config({
//         // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         debug: true,
//         // 必填，公众号的唯一标识
//         appId: $(data).find("JsSdkUiPackage").find("AppId").text(),
//         // 必填，生成签名的时间戳
//         timestamp: $(data).find("JsSdkUiPackage").find("Timestamp").text(), //"" + jsondata.Timestamp,
//         // 必填，生成签名的随机串
//         nonceStr: $(data).find("JsSdkUiPackage").find("NonceStr").text(), // jsondata.NonceStr,
//         // 必填，签名
//         signature: $(data).find("JsSdkUiPackage").find("Signature").text(), // jsondata.Signature,
//         // 必填，需要使用的JS接口列表
//         jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation', 'openLocation','hideMenuItems','hideAllNonBaseMenuItem', 'hideOptionMenu']
//     });
// });
// wx.ready(function () {
//     wx.checkJsApi({
//         jsApiList: ['scanQRCode', 'getLocation', 'getLocation', 'openLocation', 'hideOptionMenu','hideMenuItems','hideAllNonBaseMenuItem'],
//         success: function (res: any) {

//         }
//     });
//     wx.hideMenuItems({
//         menuList: [] // 要隐藏的菜单项，所有menu项见附录3
//     });
//     wx.hideAllNonBaseMenuItem();
//     wx.hideOptionMenu();

//     confirmBtn.addEventListener('click', function () {
//         let selectPositions: Array<CesiumDataController.Position> = [];
//         let myLocation: CesiumDataController.Position;

//         myLocation = new CesiumDataController.Position(121.45555234063192, 31.27953);
//         selectPositions[0] = myLocation;

//         if (selectedData.size == 0) return

//         wx.getLocation({
//             type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//             success: function (res: any) {
//                 var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//                 var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//                 var speed = res.speed; // 速度，以米/每秒计
//                 var accuracy = res.accuracy; // 位置精度

//                 myLocation = new CesiumDataController.Position(longitude, latitude)

//                 selectPositions = [myLocation]

//                 selectedData.forEach((v, k, m) => {
//                     let point: CesiumDataController.Point = dataController.Village.Point.Get(
//                         v.divisionId, v.id)
//                     selectPositions.push(point.position)
//                 })
//                 if (polyLine) {
//                     // console.log(mapClient.Draw.Routing.Remove)
//                     mapClient.Draw.Routing.Remove(polyLine.id);
//                 }
//                 polyLine = mapClient.Draw.Routing.Drawing(selectPositions, CesiumDataController.RoutingType.Driving, { color: '#007aff', alpha: 1 });

//             }
//         });

//         solidWaste.className = '';
//         solidWaste.classList.add('slide-fade-leave-active');
//         solidWaste.classList.add('slide-fade-leave-to');
//         isShow = false;

//     })

// })

// // 总共有几页
// let pageCount: number;

// // 当前页
// let pageIndex: number = 1;

// // 每页显示个数
// let pageSize: number;

// // 当前页显示个数
// let recordCount: number;

// // 总共记录数
// let totalRecordCount: number;

// let page: Page;
// let list: StationList;

// // 侧面板的开关
// let isShow: boolean = false;

// // 单次请求到的数据
// let selectedData = new Map();

// // 所有操作请求到的数据,用于状态还原
// let storedData = new Map();

// let polyLine: CesiumDataController.Polyline | null;

// // 初始化侧面板显示状态
// isShow ? show() : hide();

// let h = document.querySelector('.weui-form__control-area')?.clientHeight as number;
// let h2 = document.querySelector('.mui-content')?.clientHeight as number;

// // 当前容器能放置的记录条目数
// pageSize = Math.floor((h - h2) / 50);

// showPath.addEventListener('click', function () {
//     isShow = !isShow;
//     isShow ? show() : hide();
// })
// function show() {
//     solidWaste.className = '';
//     solidWaste.classList.add('slide-fade-enter-active');
//     solidWaste.classList.add('slide-fade-enter');
// }
// function hide() {
//     solidWaste.className = '';
//     solidWaste.classList.add('slide-fade-leave-active');
//     solidWaste.classList.add('slide-fade-leave-to');
// }

// resetBtn.addEventListener('click', function () {
//     reset()
// })

// function reset() {

//     // 当前页按钮状态重置
//     document.querySelectorAll('.weui-cell.weui-check__label.active').forEach(div => {
//         div.classList.remove('active')
//     })

//     // 本地数据库重置状态
//     selectedData.forEach(item => {
//         let id = item.id;
//         storedData.get(id).checked = false;

//     });
//     selectedData.clear();

//     if (polyLine)
//         mapClient.Draw.Routing.Remove(polyLine.id);
//     polyLine = null;
// }

// import { HowellHttpClient } from "../../data-core/repuest/http-client";
// import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
// import { GarbageStationRequestService } from "../../data-core/repuest/garbage-station.service";
// import { GetGarbageStationsParams } from "../../data-core/model/waste-regulation/garbage-station";
// import { Page } from "../../data-core/model/page";
// import { DivisionRequestService } from "../../data-core/repuest/division.service";
// import { DivisionType, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
// import { SessionUser } from "../../common/session-user";
// import { ResourceType } from "../../data-core/model/we-chat";
// import { NavigationWindow } from ".";

// class StationList {
//     myList: HTMLElement | null;
//     myTemplate: HTMLTemplateElement | null;
//     constructor(
//         private user: SessionUser,
//         private service: {
//             division: DivisionRequestService,
//             garbageStation: GarbageStationRequestService,
//         }) {
//         this.myList = document.querySelector('#myList') as HTMLElement;
//         this.myTemplate = document.querySelector('#myTemplate') as HTMLTemplateElement;
//     }

//     async GetLocalDivision() {
//         if (!this.user.WUser.Resources) {
//             return;
//         }
//         const params = new GetDivisionsParams();
//         switch (this.user.WUser.Resources[0].ResourceType) {
//             case ResourceType.County:
//                 params.DivisionType = DivisionType.County;
//                 break;
//             case ResourceType.Committees:
//                 params.DivisionType = DivisionType.Committees;
//                 break;
//             case ResourceType.GarbageStations:
//                 break;
//             default:
//                 break;
//         }

//         const res = await this.service.division.list(params);
//         if (res && res.Data && res.Data.length > 0) {
//             return res.Data[0];
//         }
//     }

//     async LoadGarbageStation(pageIndex: number) {

//         const division = await this.GetLocalDivision();
//         const request = new GetGarbageStationsParams();
//         request.PageSize = pageSize;
//         request.PageIndex = pageIndex;
//         request.DivisionId = division!?.Id;

//         return this.service.garbageStation.list(request).then(x => {

//             page = x.Page;
//             if (this.myList && this.myTemplate) {
//                 let content = this.myTemplate?.content as DocumentFragment;
//                 this.myList.innerHTML = '';
//                 x.Data.forEach(item => {
//                     // 如果本地数据库没有记录，则保存记录，且checkbox 初始状态为未选择
//                     if (!storedData.has(item.Id)) {
//                         storedData.set(item.Id, {
//                             id: item.Id,
//                             divisionId: item.DivisionId,
//                             checked: false
//                         })
//                     }
//                     // 每条记录克隆一次模板
//                     let info = content.cloneNode(true) as DocumentFragment;

//                     // 模板最外层元素
//                     let infoContainer = info.querySelector('.weui-cell.weui-check__label') as HTMLDivElement;
//                     infoContainer.setAttribute('id', item.Id);
//                     if (item.DivisionId) {
//                         infoContainer.setAttribute('divisionId', item.DivisionId)
//                     }

//                     let p = info.querySelector('div.weui-cell__bd > p') as HTMLParagraphElement;
//                     p.textContent = item.Name;
//                     // p.textContent = item.Id;

//                     // 根据本地数据库设置初始状态
//                     if (storedData.get(item.Id).checked) {
//                         infoContainer.classList.add('active');
//                     } else {
//                         infoContainer.classList.remove('active');

//                     }

//                     infoContainer.addEventListener('click', function () {
//                         let id = this.getAttribute('id');
//                         let divisionId = this.getAttribute('divisionId');

//                         if (this.classList.contains('active')) {
//                             this.classList.remove('active');
//                             storedData.get(id).checked = false;

//                         } else {
//                             this.classList.add('active');
//                             storedData.get(id).checked = true;
//                         }

//                         // 保存当前选择的 Id 信息 用于路径规划
//                         if (selectedData.has(id)) {
//                             selectedData.delete(id)
//                         } else {
//                             selectedData.set(id, {
//                                 id, divisionId
//                             })
//                         }

//                     })

//                     this.myList?.appendChild(info)
//                 })
//             }
//         });
//     }
// }

// const client = new HowellHttpClient.HttpClient();
// let dataController: CesiumDataController.Controller;
// let mapClient: CesiumMapClient;

// const user = (window.parent as NavigationWindow).User;
// const http = (window.parent as NavigationWindow).Authentication;

// list = new StationList(
//     user,
//     {
//         division: new DivisionRequestService(http),
//         garbageStation: new GarbageStationRequestService(http),
//     });
// list.LoadGarbageStation(pageIndex);

// let iframe = document.getElementById('iframe') as HTMLIFrameElement;
// iframe.src = "http://" + window.location.hostname + ":" + window.location.port + "/Amap/map_ts.html?style=none&maptype=2D&v=" + (new Date()).toISOString();
// mapClient = new CesiumMapClient("iframe");

// // console.log(mapClient.Events)
// mapClient.Events.OnLoading = function () {
//     // console.log("client.Events.OnLoading");
//     dataController = new CesiumDataController.Controller(window.location.hostname, Number(window.location.port), function () {

//     })

// }
// mapClient.Events.OnLoaded = async () => {
//     const division = await list.GetLocalDivision();
//     // console.log('divi', division)
//     mapClient.Village.Select(division!.Id);
//     const village = dataController.Village.Get(division!.Id);
//     mapClient.Viewer.MoveTo(village.position);
// }

// (function ($: any) {
//     $('.mui-pagination').on('tap', 'a', function (this: HTMLAnchorElement) {
//         var li = this.parentNode as HTMLLIElement;
//         var classList = li.classList;
//         if (classList.contains('mui-previous')) {
//             if (pageIndex > 1) {
//                 list.LoadGarbageStation(--pageIndex);
//             }
//         } else if (classList.contains('mui-next')) {
//             if (pageIndex < page.PageCount) {
//                 list.LoadGarbageStation(++pageIndex);
//             }
//         }
//     });
// })(mui);

// document.addEventListener('touchmove', function () {

// }, {
//     passive: false,
//     once: false
// })

// // confirmBtn.addEventListener('click', function () {

// //     console.log('confirm',selectedData)
// //     if (selectedData.size == 0) return
// //     let selectPositions:Array<CesiumDataController.Position> = [];
// //     let myLocation: CesiumDataController.Position;

// //     myLocation = new CesiumDataController.Position(121.45555234063192, 31.27953);
// //     selectPositions[0] = myLocation;

// //     selectedData.forEach((v, k, m) => {
// //         let point: CesiumDataController.Point = dataController.Village.Point.Get(
// //             v.divisionId, v.id)
// //         selectPositions.push(point.position)
// //     })
// //     if (polyLine) {
// //         // console.log(mapClient.Draw.Routing.Remove)
// //         mapClient.Draw.Routing.Remove(polyLine.id);
// //     }
// //     polyLine = mapClient.Draw.Routing.Drawing(selectPositions, CesiumDataController.RoutingType.Driving, { color: '#007aff', alpha: 1 });

// //     solidWaste.className = '';
// //     solidWaste.classList.add('slide-fade-leave-active');
// //     solidWaste.classList.add('slide-fade-leave-to');
// //     isShow = false;

// //     console.log(selectedData)

// // })
