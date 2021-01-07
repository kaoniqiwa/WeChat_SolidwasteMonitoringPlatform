import { SessionUser } from "../../common/session-user";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";

namespace Navigation {


    const items = document.getElementsByClassName("bar-item");
    const iframe = document.getElementById("main") as HTMLIFrameElement;
    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLLinkElement;
        item.onclick = function () {
            const _this = (this as HTMLLinkElement);
            if (_this.className == "selected") {
                return false;
            }
            const selecteds = document.getElementsByClassName("selected");
            for (let i = 0; i < selecteds.length; i++) {
                selecteds[i].className = '';
            }
            iframe.src = (this as HTMLLinkElement).href + window.location.search;
            (this as HTMLLinkElement).className = "selected"
            return false;
        };
    }




    var User = new SessionUser();
    let index = 0;
    var search = document.location.search.substr(1).toLocaleLowerCase();
    var query = search.split('&');
    var querys = {
        openid: "",
        index: "0",
        eventid: ""
    };
    for (let i = 0; i < query.length; i++) {
        let keyvalue = query[i].split('=');
        querys[keyvalue[0]] = keyvalue[1];
    }
    if (querys.openid) {
        new HowellHttpClient.HttpClient().login(
            async (http: HowellAuthHttp) => {
                console.log("login seccess");
            },
            () => {
                console.log("login faild");
                location.href = "./register.html";
            });
    }
    else {
        location.href = "./register.html";
    }
    if (querys.eventid) {
        //location.href = "./event-details.html?openid=" + querys.openid + "&eventid=" + querys.eventid;
        querys.index = "1";
        window.showOrHideAside("./event-details.html?openid=" + querys.openid + "&eventid=" + querys.eventid);


    }
    if (querys.index) {
        index = parseInt(querys.index);
    }
    console.log(index);
    (items[index] as HTMLLinkElement).click();
}