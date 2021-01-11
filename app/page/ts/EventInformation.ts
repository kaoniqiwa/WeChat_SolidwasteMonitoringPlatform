import { dateFormat, getQueryVariable } from "../../common/tool";
import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SessionUser } from "../../common/session-user";
import { EventTypeEnum } from "../../data-core/model/waste-regulation/event-number";

export namespace EventInformationPage {
    export class EventDetail {
        constructor(private service: {
            event: EventRequestService,
            medium: MediumPicture
        },
            private user: SessionUser) {

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


        getData() {
            const eventId = getQueryVariable('eventid');
            if (eventId) {
                return this.service.event.single(eventId);
            }
        }

        fillDetail(item: IllegalDropEventRecord) {
            const police__type = document.getElementById('police__type')!,
                camera__name = document.getElementById('camera__name')!,
                station__name = document.getElementById('station__name')!,
                rc__name = document.getElementById('rc__name')!,
                police__time = document.getElementById('police__time')!,
                detail_img = document.getElementById('detail_img') as HTMLImageElement;
            if (police__type) {
                let EventType = {
                    '1': '乱扔垃圾事件',
                    '2': '混合投放事件',
                    '3': '垃圾容量事件',
                    '4': '垃圾满溢事件'
                };
                police__type.innerText = EventType[item.EventType];
            }
            camera__name.innerText = item.ResourceName;
            station__name.innerText = item.Data.StationName;
            rc__name.innerText = item.Data.DivisionName;
            police__time.innerText = dateFormat(new Date(item.EventTime), 'yyyy-MM-dd HH:mm:ss');
            let url = this.service.medium.getData(item.ImageUrl);
            if (!url) {
                url = "./img/black.png";
            }
            detail_img.src = url;
            detail_img.onload = () => {
                const frame = document.getElementById("frame")! as HTMLDivElement;
                this.drawFrame(frame, item, detail_img.offsetWidth, detail_img.offsetHeight);
            };
            detail_img.addEventListener("click", () => {
                const max = document.getElementById("max")!;
                max.innerHTML = detail_img.parentElement!.innerHTML;

                max.style.display = "block";
                const frame = max.getElementsByClassName("frame")[0] as HTMLDivElement;
                const img = max.getElementsByTagName("img")[0] as HTMLImageElement;
                this.drawFrame(frame, item, img.offsetWidth, img.offsetHeight);
                img.style.marginTop = "50%";
                frame.style.marginTop = "50%";
            });
        }

        drawFrame(element: HTMLDivElement, item: IllegalDropEventRecord, width: number, height: number) {
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


                    element.style.backgroundImage = "url('" + ctx.canvas.toDataURL() + "')";

                }
            }
        }
    }

    new HowellHttpClient.HttpClient().login((http: HowellAuthHttp) => {




        const user = new SessionUser();

        const record = new EventDetail({
            event: new EventRequestService(http),
            medium: new MediumPicture()
        }, user);
        record.init();
        if (window.parent.recordDetails) {
            console.log("details", window.parent.recordDetails);
            record.fillDetail(window.parent.recordDetails);
        }
        else {
            const data = record.getData()!;
            data.then(x => {
                record.fillDetail(x.data.Data);
            });
        }
    });

}