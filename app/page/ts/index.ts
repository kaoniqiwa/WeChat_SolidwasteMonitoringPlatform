import { SessionUser } from "../../common/session-user";

namespace Navigation {
    const items = document.getElementsByClassName("bar-item");
    const iframe = document.getElementById("main") as HTMLIFrameElement;
    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLLinkElement;
        item.onclick = function () {
            const selecteds = document.getElementsByClassName("selected");
            for (let i = 0; i < selecteds.length; i++) {
                selecteds[i].className = '';
            }
            iframe.src = (this as HTMLLinkElement).href+ window.location.search;
            (this as HTMLLinkElement).className = "selected"
            return false;
        };
    }
    var User = new SessionUser();
    let index = 0;    
    var search = document.location.search.substr(1);
    var query = search.split('&');
    var querys = {
        openId:"",
        index:"0"
    };
    for (let i = 0; i < query.length; i++) {
        let keyvalue = query[i].split('=');
        querys[keyvalue[0]] = keyvalue[1];
    }
    if(querys.index)
    {
        index = parseInt(querys.index);
    }
    (items[index] as HTMLLinkElement).click();
}