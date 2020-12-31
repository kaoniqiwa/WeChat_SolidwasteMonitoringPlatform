import { EventTypeEnum } from "../../common/enum-helper";
import { dateFormat, getQueryVariable } from "../../common/tool";
import { Mediume as MediumPicture } from "../../data-core/url/medium";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventRequestService } from "../../data-core/repuest/Illegal-drop-event-record";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { SessionUser } from "../../common/session-user";

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
                    location.href = "./index.html?openId=" + this.user.WUser.OpenId + "&index=" + 1;
                });
            }
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
                police__type.innerText = EventTypeEnum[item.EventType];
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
        }
    }

    new HowellHttpClient.HttpClient().login((http: HowellAuthHttp) => {

        const user = new SessionUser();

        const record = new EventDetail({
            event: new EventRequestService(http),
            medium: new MediumPicture()
        }, user);
        record.init();
        const data = record.getData();
        data.then(x => {
            record.fillDetail(x.data.Data);
        });
    });

}