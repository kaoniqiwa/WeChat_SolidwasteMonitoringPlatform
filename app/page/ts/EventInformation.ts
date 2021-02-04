import { Response } from "../../data-core/model/response";
import { dateFormat, getQueryVariable } from "../../common/tool";
import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { IllegalDropEventData, IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventRequestService } from "../../data-core/repuest/event-record";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SessionUser } from "../../common/session-user";
import { Language } from "./language";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { MixedIntoEventData, MixedIntoEventRecord } from "../../data-core/model/waste-regulation/mixed-into-event-record";
import { GarbageFullEventData, GarbageFullEventRecord } from "../../data-core/model/waste-regulation/garbage-full-event-record";
import { EventData, EventRecord, EventRecordData } from "../../data-core/model/waste-regulation/event-record";
import { AxiosResponse } from "axios";
import { NavigationWindow } from ".";
import { ImageController } from "./data-controllers/modules/ImageControl";
import { DataController } from "./data-controllers/DataController";

export namespace EventInformationPage {
    export class EventDetail {

        imageController: ImageController;


        constructor(private service: {
            event: EventRequestService,
            medium: MediumPicture
        },
            private user: SessionUser) {
            this.imageController = new ImageController("#origin-img");
        }

        init() {
            let btn = document.getElementById("back__btn")
            if (btn) {
                btn.addEventListener("click", () => {
                    window.parent.showOrHideAside();
                    // location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
                });
            }
            let max = document.getElementById("max")!;
            max.addEventListener("click", () => {
                max.style.display = '';
            });
        }


        getData():
            Promise<Response<IllegalDropEventRecord>> |
            Promise<Response<MixedIntoEventRecord>> |
            Promise<Response<GarbageFullEventRecord>> |
            undefined {
            const eventId = getQueryVariable('eventid');
            const strEventType = getQueryVariable('eventtype');

            let eventType = EventType.IllegalDrop;

            if (strEventType) {
                eventType = parseInt(strEventType);
            }

            if (eventId) {
                switch (eventType) {
                    case EventType.IllegalDrop:
                        return this.service.event.illegalDropSingle(eventId);
                    case EventType.MixedInto:
                        return this.service.event.mixedIntoSingle(eventId);
                    case EventType.GarbageFull:
                        return this.service.event.garbageFullSingle(eventId);
                    default:
                        break;
                }
            }

        }

        fillDetail<T extends IllegalDropEventData | MixedIntoEventData | GarbageFullEventData>(item: EventRecordData<T>) {
            const police__type = document.getElementById('police__type')!,
                camera__name = document.getElementById('camera__name')!,
                station__name = document.getElementById('station__name')!,
                rc__name = document.getElementById('rc__name')!,
                police__time = document.getElementById('police__time')!,
                detail_img = document.getElementById('detail_img') as HTMLImageElement;
            if (police__type) {
                police__type.innerText = Language.EventType(item.EventType);
            }
            if (item.ResourceName) {
                camera__name.innerText = item.ResourceName;
            }


            station__name.innerText = item.Data.StationName;
            if (item.Data.DivisionName) {
                rc__name.innerText = item.Data.DivisionName;
            }

            police__time.innerText = dateFormat(new Date(item.EventTime), 'yyyy-MM-dd HH:mm:ss');
            let url: string = DataController.defaultImageUrl;
            if (item.ImageUrl) {
                if (item.ImageUrl.indexOf('?') >= 0) {

                    url = item.ImageUrl
                }
                else {
                    let resUrl = this.service.medium.getData(item.ImageUrl);
                    if (resUrl) {
                        url = resUrl;
                    }
                }
            }

            detail_img.src = url;
            detail_img.onload = () => {
                const frame = document.getElementById("frame")! as HTMLDivElement;
                frame.style.width = detail_img.offsetWidth + "px";
                frame.style.height = detail_img.offsetHeight + "px";
                this.drawFrame(item, detail_img.offsetWidth, detail_img.offsetHeight, frame);
            };
            detail_img.addEventListener("click", () => {
                let selectors = {
                    frameId: "max-frame",
                    imgId: "max-img"
                }


                debugger;
                this.imageController.showDetail(selectors, [detail_img.src]);
                let frame = document.getElementById(selectors.frameId) as HTMLImageElement;
                let img = document.getElementById(selectors.imgId) as HTMLImageElement;
                img.onload = () => {
                    let url = this.drawFrame(item, img.naturalWidth, img.naturalHeight)!;
                    frame.src = url;                    
                }



                // img.onload = () => {
                //     frame.style.width = img.offsetWidth + "px";
                //     frame.style.height = img.offsetHeight + "px";
                //     this.drawFrame1(frame, item, img);
                // }
                // img.addEventListener("touchmove", (e) => {

                //     // frame.style.scale = img.style.scale;
                //     frame.style.transform = img.style.transform;
                //     frame.style.transformBox = img.style.transformBox;
                //     frame.style.transformStyle = img.style.transformStyle;
                //     // frame.style.width = img.offsetWidth + "px";
                //     // frame.style.height = img.offsetHeight + "px";
                // })

            });
        }


        drawFrame1(element: HTMLDivElement, item: IllegalDropEventRecord | MixedIntoEventRecord, img: HTMLImageElement) {
            if (item && item.Data && item.Data.Objects) {

                const object = item.Data.Objects[0];
                element.style.position = "absolute";
                let width = Math.abs(object.Polygon[1].X - object.Polygon[0].X);
                let height = Math.abs(object.Polygon[3].Y - object.Polygon[0].Y);
                let x = object.Polygon[0].X;
                let y = object.Polygon[0].Y;
                element.style.border = "1px solid red";

                element.style.width = width * 100 + "%";
                element.style.height = height * 100 + "%";

                element.style.top = y * 100 + "%";
                element.style.left = x * 100 + "%";
                element.parentElement!.style.position = "absolute"
                element.parentElement!.style.pointerEvents = "none";
            }
        }

        drawFrame2(item: IllegalDropEventRecord | MixedIntoEventRecord, img: HTMLImageElement) {

            if (item && item.Data && item.Data.Objects) {
                const objects = item.Data.Objects;

                const width = img.naturalWidth;
                const height = img.naturalHeight;


                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d")!;
                ctx.strokeStyle = "red";
                ctx.drawImage(img, 0, 0, width, height);
                for (let i = 0; i < objects.length; i++) {
                    const obj = objects[i];
                    if (!obj.Polygon)
                        continue;
                    ctx.beginPath();
                    const first = obj.Polygon[0];
                    let x = first.X * width;
                    let y = first.Y * height;

                    ctx.moveTo(x, y);

                    for (let j = obj.Polygon.length - 1; j >= 0; j--) {
                        const point = obj.Polygon[j];
                        x = point.X * width;
                        y = point.Y * height;
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                    ctx.closePath();

                    return ctx.canvas.toDataURL()
                }
            }
        }

        drawFrame(item: IllegalDropEventRecord | MixedIntoEventRecord, width: number, height: number, element?: HTMLDivElement) {

            if (item && item.Data && item.Data.Objects) {
                const objects = item.Data.Objects;

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d")!;
                ctx.strokeStyle = "red";
                for (let i = 0; i < objects.length; i++) {
                    const obj = objects[i];
                    if (!obj.Polygon)
                        continue;
                    ctx.beginPath();
                    const first = obj.Polygon[0];
                    let x = first.X * width;
                    let y = first.Y * height;

                    ctx.moveTo(x, y);

                    for (let j = obj.Polygon.length - 1; j >= 0; j--) {
                        const point = obj.Polygon[j];
                        x = point.X * width;
                        y = point.Y * height;
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                    ctx.closePath();

                    if (element) {
                        element.style.backgroundImage = "url('" + ctx.canvas.toDataURL() + "')";
                    }
                    return ctx.canvas.toDataURL();
                }
            }
        }
    }

    class Page {
        async run() {
            const user = (window.parent as NavigationWindow).User;
            const http = (window.parent as NavigationWindow).Authentication;

            let client = new HowellHttpClient.HttpClient().login(async (http) => {

                let user = new SessionUser();

                const record = new EventDetail({
                    event: new EventRequestService(http),
                    medium: new MediumPicture()
                }, user);

                record.init();

                if (window.parent.recordDetails) {
                    record.fillDetail(window.parent.recordDetails);
                }
                else {
                    const data = await record.getData();
                    if (data) {
                        record.fillDetail(data.Data);
                    }
                }
            })
        }
    }

    let page = new Page();
    page.run();


}