import { SessionUser } from "../../common/session-user";
import { dateFormat, getAllDay } from "../../common/tool";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { GarbageStationNumberStatistic } from "../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";
import { Service } from "../../data-core/repuest/service";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { IGarbageStationNumberStatistic } from "./data-controllers/IController";


class LittleGarbage {
    element: { [key: string]: any } = {};
    constructor(private datas: Array<GarbageStationNumberStatistic>) {
        this.element.tableBody = document.querySelector('.el-table__body tbody')
    }
    init() {
        const fragment = document.createDocumentFragment();
        this.datas.forEach(data => {
            let { Name, GarbageRatio, AvgGarbageTime, MaxGarbageTime, GarbageDuration, TodayEventNumbers } = data;
            GarbageRatio = Number(GarbageRatio.toFixed(2));
            AvgGarbageTime = Math.round(AvgGarbageTime);
            MaxGarbageTime = Math.round(MaxGarbageTime);
            GarbageDuration = Math.round(GarbageDuration);
            let maxHour = Math.floor(MaxGarbageTime / 60);
            let maxMinute = MaxGarbageTime - maxHour * 60;
            let totalHour = Math.floor(GarbageDuration / 60);
            let totalMinute = GarbageDuration - totalHour * 60;
            let illegalDrop = 0;
            let mixIntoDrop = 0;

            TodayEventNumbers.forEach(eventNumber => {
                if (eventNumber.EventType == EventType.IllegalDrop) {
                    illegalDrop = eventNumber.DayNumber
                } else if (eventNumber.EventType == EventType.MixedInto) {
                    mixIntoDrop = eventNumber.DayNumber
                }
            })



            let tr = document.createElement('tr');
            tr.className = 'el-table__row';
            tr.innerHTML = `
                <td><div class='cell'>${Name}</div></td>
                <td><div class='cell'>${GarbageRatio}</div></td>
                <td><div class='cell'>${AvgGarbageTime}</div></td>
                <td><div class='cell'>${maxHour == 0 ? maxMinute + "分钟" : maxHour + "小时" + maxMinute + "分钟"}</div></td>
                <td><div class='cell'>${totalHour == 0 ? totalMinute + "分钟" : totalHour + "小时" + totalMinute + "分钟"}</div></td>
                <td><div class='cell'>${illegalDrop}</div></td>
                <td><div class='cell'>${mixIntoDrop}</div></td>
            `
            fragment.appendChild(tr)
        })
        this.element.tableBody.appendChild(fragment)
    }
}
const user = new SessionUser();

let dataController: IGarbageStationNumberStatistic
if (user.WUser.Resources) {
    const type = user.WUser.Resources![0].ResourceType;

    new HowellHttpClient.HttpClient().login(async (http: HowellAuthHttp) => {

        const service = new Service(http);
        dataController = ControllerFactory.Create(service, type, user.WUser.Resources!)


        dataController.getGarbageStationList().then(res => {

            console.log('垃圾厢房:', res);
            let ids = res.map(item => {
                return item.Id
            })
            dataController.getGarbageStationNumberStatisticList(
                ids
            ).then(res => {
                console.log('统计数据', res)
                res = res.sort(function (a, b) {
                    return a.GarbageRatio - b.GarbageRatio
                })

                new LittleGarbage(res).init()
            })

            // let date = new Date(new Date().getTime() - 86400*1000);

            // let day = getAllDay(date);
            // dataController.getGarbageStationNumberStatistic("310110019035001000",day).then(res=>console.log(res))

        })



    })

}