import { SessionUser } from "../../common/session-user";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { WeChatUser } from "../../data-core/model/we-chat";
import { HowellAuthHttp } from "../../data-core/repuest/howell-auth-http";
import { HowellHttpClient } from "../../data-core/repuest/http-client";

export interface NavigationWindow extends Window {
    User: SessionUser;
    Authentication: HowellAuthHttp;
}

namespace Navigation {

    window.recordDetails = null;
    window.showOrHideAside = function (url) {
        if (index < 0) {
            index = 1;
            let historyPage = (items[index] as HTMLLinkElement);
            historyPage.click();

        }
        var asideContent = document.querySelector('.aside-content') as HTMLDivElement;
        var backdrop = document.querySelector('.backdrop') as HTMLDivElement;
        if (asideContent.classList.contains('active')) {
            asideContent.classList.remove('active');
            backdrop.style.display = 'none'
        } else {
            backdrop.style.display = 'block'
            asideContent.classList.add('active');

            var details = document.getElementById("aside-details") as HTMLIFrameElement;
            if (url) {

                details.src = url;
            }

        }
    }



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
            if (querys.eventtype) {
                iframe.src += ("&eventtype=" + querys.eventtype);
            }
            (this as HTMLLinkElement).className = "selected"
            return false;
        };
    }




    (window as unknown as NavigationWindow).User = new SessionUser();
    let index = 0;


    var search = decodeURI(document.location.search).substr(1);

    var query = search.split('&');
    var querys: any = {
        openid: "",
        index: "0",
        eventid: "",
        data: ""
    };
    for (let i = 0; i < query.length; i++) {
        let keyvalue = query[i].split('=');
        querys[keyvalue[0].toLocaleLowerCase()] = keyvalue[1];
    }
    if (querys.data) {
        // alert(querys.data);
        console.log("source", querys.data)
        querys.data = decodeURIComponent(querys.data);
        querys.data = base64decode(querys.data);
        console.log("base64decode", querys.data)

        let params = querys.data.split("&");
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            let p = param.split('=');
            querys[p[0].toLocaleLowerCase()] = p[1];
        }
    }
    if (querys.openid) {
        new HowellHttpClient.HttpClient().login(
            async (http: HowellAuthHttp) => {
                (window as unknown as NavigationWindow).Authentication = http;

                if (querys.eventid) {
                    //location.href = "./event-details.html?openid=" + querys.openid + "&eventid=" + querys.eventid;
                    querys.index = "-1";
                    let eventType = EventType.IllegalDrop;
                    if (querys.eventtype) {
                        eventType = parseInt(querys.eventtype);
                    }
                    window.showOrHideAside("./event-details.html?openid=" + querys.openid + "&eventid=" + querys.eventid + "&eventtype=" + eventType);
                }




                if (querys.index) {
                    index = parseInt(querys.index);
                }
                console.log(index);
                if (index >= 0) {
                    (items[index] as HTMLLinkElement).click();
                }
            },
            () => {
                location.href = "./register.html?openid=" + querys.openid;
            });
    }
    else {
        if (querys.eventid) {
            let search = base64encode(location.search.substr(1));
            let url = window.location.href.substr(0, window.location.href.indexOf('?'));
            let href = "http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetUserOpenId?appid=wx119358d61e31da01&returnUrl="
                //+ url+"?data="+search;            
                + window.location.href;
            window.location.href = href;
        }
        else {
            location.href = "./register.html";
        }
    }

}