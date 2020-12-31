import { Map } from "../../data-core/model/aiop/map";
import { Camera } from "../../data-core/model/waste-regulation/camera";
import { Division, GetDivisionsParams } from "../../data-core/model/waste-regulation/division";
import { GarbageStation, GetGarbageStationsParams, StationState } from "../../data-core/model/waste-regulation/garbage-station";
import { DivisionRequestService } from "../../data-core/repuest/division.service";
import { CameraRequestService, GarbageStationRequestService } from "../../data-core/repuest/garbage-station.service";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { ResourceMediumRequestService } from "../../data-core/repuest/resources.service";
import { FilterAside } from "../component/aside";

declare var mui: any;


enum TemplateMode {
    Small = 'card-template',
    Big = 'card-big-template'
}


export namespace GarbageStationList {




    class GarbageStationClient {

        content: HTMLElement | null;
        template: HTMLElement | null;
        divisions: Global.Dictionary<Division> = {};
        elements: Global.Dictionary<HTMLElement> = {};

        constructor(private service: {
            garbageStation: GarbageStationRequestService,
            division: DivisionRequestService,
            camera: CameraRequestService,
            media: ResourceMediumRequestService
        }) {
            this.content = document.getElementById('content');
            this.template = document.getElementById('card-template');
        }

        GarbageStationFilter(divisionIds: Array<string>) {
            for (const id in this.elements) {
                const element = this.elements[id];
                const dId = element['DivisionId'];
                let index = divisionIds.indexOf(dId);
                if (divisionIds.length == 0)
                    index = 0;
                let display = ''
                if (index < 0) {
                    display = 'none';
                }
                element.style.display = display;
            }
        }

        LoadDivisionList() {
            var req = new GetDivisionsParams();
            this.divisions = {};
            var ul = document.getElementById('division_list');
            ul.innerHTML = '';
            return this.service.division.list(req).then(x => {

                const divisions = x.Data.Data.sort((a, b) => {
                    return a.Name.localeCompare(b.Name);
                });


                for (let i = 0; i < divisions.length; i++) {
                    const data = divisions[i];
                    if (data.DivisionType == 3) continue;
                    this.divisions[data.Id] = data;
                    const li = document.createElement('li');
                    const btn = document.createElement('button');
                    btn.type = "button"
                    btn.id = data.Id;
                    btn.className = "mui-btn mui-btn-division";
                    btn.innerHTML = data.Name;
                    btn.addEventListener('click', function () {
                        const index = this.className.indexOf(' selected');
                        if (index < 0) {
                            this.className += " selected"
                        }
                        else {
                            this.className = this.className.replace(' selected', '');
                        }
                    });
                    li.appendChild(btn);
                    ul.appendChild(li);
                }
            });
        }

        async GetDivision(id: string) {
            if (this.divisions[id]) {
                return this.divisions[id];
            }
            return this.service.division.get(id);
        }

        private createTagByStationState(state: StationState) {
            let tag = document.createElement("div");
            tag.className = "mui-badge mui-badge-"

            switch (state) {
                case StationState.Normal:
                    tag.className += "green";
                    tag.innerHTML = "正常"
                    break;
                case StationState.Error:
                    tag.className += "red";
                    tag.innerHTML = "异常"
                    break;
                case StationState.Full:
                    tag.className += "orange";
                    tag.innerHTML = "满溢"
                    break;
                default:
                    break;
            }
            return tag;
        }

        CreateGarbageStationCard(data: GarbageStation) {
            let div = document.createElement("div");
            div.id = data.Id;
            div.className = this.template.className;
            div.innerHTML = this.template.innerHTML;
            let header = div.getElementsByClassName("header")[0];
            header.innerHTML = data.Name;

            let tag = this.createTagByStationState(data.StationState);
            header.appendChild(tag);

            let footer = div.getElementsByClassName("footer")[0];
            footer.innerHTML = this.divisions[data.DivisionId].Name;

            div["DivisionId"] = data.DivisionId;
            this.content.appendChild(div);
            this.elements[data.Id] = div;
            this.LoadCameras(data.Id);
        }

        LoadGarbageStation() {

            const request = new GetGarbageStationsParams();
            return this.service.garbageStation.list(request).then(x => {
                if (this.content && this.template) {
                    this.content.innerHTML = '';
                    var datas = x.Data.Data.sort((a, b) => {
                        return a.Name.localeCompare(b.Name);
                    });


                    for (let i = 0; i < datas.length; i++) {
                        const data = datas[i];
                        this.CreateGarbageStationCard(data);
                    }
                }
            });
        }


        LoadCameras(stationId: string) {
            let response = this.service.camera.list(stationId);

            return response.then(res => {

                let cameras = res.data.Data.sort((a, b) => {
                    return a.CameraUsage - b.CameraUsage || a.Name.localeCompare(b.Name);
                });

                let ul = document.createElement("ul");
                for (let i = 0; i < cameras.length; i++) {
                    const camera = cameras[i];

                    let li = document.createElement("li");
                    const img = this.createImgByCamera(camera);

                    img.setAttribute("data-preview-src", "");
                    img.setAttribute("data-preview-group", stationId);
                    li.appendChild(img);
                    ul.appendChild(li);

                }
                let content = this.elements[stationId].getElementsByClassName("content")[0];
                content.appendChild(ul);
            });
        }

        createImgByCamera(camera: Camera) {
            let img = document.createElement("img");
            img.addEventListener("error", function () {
                this.src = "./img/black.png";
            });
            img.id = camera.Id;
            img.className = 'mui-zoom';
            img.setAttribute("data-preview-lazyload", '');
            if (camera.ImageUrl) {
                img.src = this.service.media.getData(camera.ImageUrl);
            }
            else {
                img.src = "./img/black.png"
            }

            return img;
        }

        Search() {
            const input = document.getElementById('searchInput') as HTMLInputElement;
            for (const id in this.elements) {
                let index = this.elements[id].innerHTML.indexOf(input.value);
                let display = '';
                if (index < 0) {
                    display = 'none';
                }
                this.elements[id].style.display = display;
            }
            document.getElementById("btn_reset").click();
        }

        InitNav() {
            const btn = document.getElementById('btn_search');
            const input = document.getElementById('searchInput') as HTMLInputElement;
            input.addEventListener('search', () => {
                this.Search();
            })
            btn.addEventListener('click', () => {
                this.Search();
            });
        }

        RegistRefresh() {
            mui.init({
                pullRefresh: {
                    container: '#offCanvasContentScroll',
                    down: {
                        style: 'circle',
                        callback: () => {
                            this.Refresh();
                        }
                    }
                }
            });
        }

        Refresh() {

            const p = this.LoadGarbageStation();
            const reset = document.getElementById("btn_reset");
            reset.click();
            p.then(() => {
                setTimeout(() => {
                    let m = mui('#offCanvasContentScroll')
                    let r = m.pullRefresh()
                    let e = r.endPulldownToRefresh(true); //参数为true代表没有更多数据了。
                }, 0);

            });


        }

        FilterByDivision() {

        }


        InitAside(loaded: () => void) {
            const aside = new FilterAside({
                parentId: "offCanvasWrapper",
                triggerId: "btn_division",
                asideId: "offCanvasSide",
                loaded: loaded,
                ok: () => {
                    const selected = document.getElementsByClassName("selected");
                    var array = new Array<string>();
                    for (let i = 0; i < selected.length; i++) {
                        array.push(selected[i].id);
                    }
                    const input = document.getElementById('searchInput') as HTMLInputElement;
                    input.value = '';
                    this.GarbageStationFilter(array);
                },
                reset: () => {
                    setTimeout(() => {
                        const selected = document.getElementsByClassName("selected");
                        for (let i = 0; i < selected.length; i++) {
                            const element = selected[i];
                            (function (element) {
                                setTimeout(function () {
                                    element.className = element.className.replace(" selected", '');
                                }, 0)

                            })(element);
                        }
                    }, 0)
                }
            });

            mui('#offCanvasSideScroll').scroll();
            mui('#offCanvasContentScroll').scroll();
        }


        LoadDivisionsFilter() {



            //侧滑容器父节点
            const offCanvasWrapper = mui('#offCanvasWrapper');
            mui.init({
                swipeBack: false,
            });
            //主界面容器
            // const offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
            //菜单容器
            const offCanvasSide = document.getElementById("offCanvasSide");

            //移动效果是否为整体移动
            const moveTogether = false;
            //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；

            const classList = offCanvasWrapper[0].classList;

            offCanvasSide.classList.remove('mui-transitioning');
            offCanvasSide.setAttribute('style', '');
            classList.remove('mui-slide-in');
            classList.remove('mui-scalable');
            if (moveTogether) {
                //仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
                offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
            }
            classList.add('mui-slide-in');
            offCanvasWrapper.offCanvas().refresh();

            document.getElementById('btn_division').addEventListener('tap', function () {
                offCanvasWrapper.offCanvas('show');
            });
            document.getElementById('btn_ok').addEventListener('tap', (e) => {
                const selected = document.getElementsByClassName("selected");
                var array = new Array<string>();
                for (let i = 0; i < selected.length; i++) {
                    array.push(selected[i].id);
                }
                const input = document.getElementById('searchInput') as HTMLInputElement;
                input.value = '';
                this.GarbageStationFilter(array);

                setTimeout(function () {
                    offCanvasWrapper.offCanvas('close');
                }, 50)
            });
            //主界面和侧滑菜单界面均支持区域滚动；
            //实现ios平台的侧滑关闭页面；
            if (mui.os.plus && mui.os.ios) {
                offCanvasWrapper[0].addEventListener('shown', function (e) { //菜单显示完成事件
                    mui.os.plus.webview.currentWebview().setStyle({
                        'popGesture': 'none'
                    });
                });
                offCanvasWrapper[0].addEventListener('hidden', function (e) { //菜单关闭完成事件
                    mui.os.plus.webview.currentWebview().setStyle({
                        'popGesture': 'close'
                    });
                });
            }

            const reset = document.getElementById("btn_reset")
            reset.addEventListener('click', function (e) {
                e.stopPropagation();
                setTimeout(() => {
                    const selected = document.getElementsByClassName("selected");
                    for (let i = 0; i < selected.length; i++) {
                        const element = selected[i];
                        (function (element) {
                            setTimeout(function () {
                                element.className = element.className.replace(" selected", '');
                            }, 0)

                        })(element);
                    }
                }, 0)

            });
        }
    }





    const client = new HowellHttpClient.HttpClient();
    client.login((http: HowellAuthHttp) => {





        const client = new GarbageStationClient({
            garbageStation: new GarbageStationRequestService(http),
            division: new DivisionRequestService(http),
            camera: new CameraRequestService(http),
            media: new ResourceMediumRequestService(http)
        }
        );
        client.InitAside(()=>{
            let promis = client.LoadDivisionList();
            promis = promis.then(() => {
                client.LoadGarbageStation();
                client.InitNav();
    
                client.RegistRefresh();
                // client.LoadDivisionsFilter();
            });
        });
        
    });
}


