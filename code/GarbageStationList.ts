import { Map } from "../app/data-core/model/aiop/map";
import { Camera } from "../app/data-core/model/waste-regulation/camera";
import { Division, GetDivisionsParams } from "../app/data-core/model/waste-regulation/division";
import { GarbageStation, GetGarbageStationsParams, StationState } from "../app/data-core/model/waste-regulation/garbage-station";
import { DivisionRequestService } from "../app/data-core/repuest/division.service";
import { CameraRequestService, GarbageStationRequestService } from "../app/data-core/repuest/garbage-station.service";
import { HowellAuthHttp } from "../app/data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../app/data-core/repuest/http-client";
import { ResourceMediumRequestService } from "../app/data-core/repuest/resources.service";

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


        LoadDivisionList() {
            var req = new GetDivisionsParams();
            this.divisions = {};
            return this.service.division.list(req).then(x => {
                for (let i = 0; i < x.Data.Data.length; i++) {
                    const data = x.Data.Data[i];
                    this.divisions[data.Id] = data;
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
            tag.className = "tag "

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


        LoadGarbageStation() {

            const request = new GetGarbageStationsParams();
            return this.service.garbageStation.list(request).then(x => {
                if (this.content && this.template) {

                    var datas = x.Data.Data.sort((a, b) => {
                        return a.Name.localeCompare(b.Name);
                    });


                    for (let i = 0; i < datas.length; i++) {
                        const data = datas[i];
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
                        this.content.appendChild(div);
                        this.elements[data.Id] = div;
                        this.LoadCameras(data.Id);
                    }
                }
            });
        }


        LoadCameras(stationId: string) {
            let response = this.service.camera.list(stationId);

            return response.then(res => {
                let cameras = res.data.Data.sort((a, b) => {
                    return a.Name.localeCompare(b.Name);
                });
                for (let i = 0; i < cameras.length; i++) {
                    const camera = cameras[i];
                    let ul = document.createElement("ul");
                    let li = document.createElement("li");
                    const img = this.createImgByCamera(camera);
                    li.appendChild(img);
                    ul.appendChild(li);
                    let content = this.elements[camera.GarbageStationId].getElementsByClassName("content")[0];
                    content.appendChild(ul);
                }
            });
        }

        createImgByCamera(camera: Camera) {
            let img = document.createElement("img");
            img.id = camera.Id;
            if (camera.ImageUrl) {
                img.src = this.service.media.getData(camera.ImageUrl);
            }
            else {
                img.src = "./img/none-black.png"
            }

            return img;
        }


        Get() {

        }
    }

    const client = new HowellHttpClient.HttpClient();
    client.login((http:HowellAuthHttp) => {



        const client = new GarbageStationClient({
            garbageStation: new GarbageStationRequestService(http),
            division: new DivisionRequestService(http),
            camera: new CameraRequestService(http),
            media: new ResourceMediumRequestService(http)
        }
        );
        let promis = client.LoadDivisionList();
        promis = promis.then(() => {
            client.LoadGarbageStation();
        });
    });
}



