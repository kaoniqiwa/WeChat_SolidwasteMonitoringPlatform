String.prototype.content = function (v) {
    if (this.indexOf(v) < 0)
        return false;
    return true;
}

Object.Equals = function (a, b) { return a == b; }

//Date.prototype.fromJSON = function (json) {
//    var start = json.indexOf("(") + 1;
//    var count = json.lastIndexOf(")") - start - 1;
//    var value = json.substr(start, count);

//    var utcValue;
//    var temp;
//    if (value.indexOf("+") >= 0) {
//        temp = value.split("+");
//        utcValue = parseInt(temp[0]) + 60 * 60 * 1000 * parseInt(temp[1]);
//    }
//    else if (value.indexOf("-") >= 0) {
//        var temp = value.split("-");
//        utcValue = parseInt(temp[0]) - 60 * 60 * 1000 * parseInt(temp[1]);
//    }

//    this.setTime(utcValue);
//}


if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) { return n < 10 ? '0' + n : n }
        return this.getUTCFullYear() + '-'
        + pad(this.getUTCMonth() + 1) + '-'
        + pad(this.getUTCDate()) + 'T'
        + pad(this.getUTCHours()) + ':'
        + pad(this.getUTCMinutes()) + ':'
        + pad(this.getUTCSeconds()) + '.'
        + pad(this.getUTCMilliseconds()) + 'Z';
    }
}

Date.prototype.fromJSON = function (json) {
    var date = new Date();
    //json = "";
    var yearIndex = json.indexOf("-");
    var year = json.substr(0, yearIndex);

    var monthIndex = json.indexOf("-", yearIndex + 1);
    var month = json.substr(yearIndex + 1, 2);

    var dayIndex = json.indexOf(" ", monthIndex + 1);
    if (dayIndex < 0)
        dayIndex = json.indexOf("T", monthIndex + 1);
    var day = json.substr(monthIndex + 1, 2);

    var hourIndex = json.indexOf(":", dayIndex + 1);
    var hour = json.substr(dayIndex + 1, 2);

    var minuteIndex = json.indexOf(":", hourIndex + 1);
    var minute = json.substr(hourIndex + 1, 2);

    var secondIndex = json.indexOf("Z", minuteIndex + 1);
    var second = json.substr(minuteIndex + 1, 2);

    var temp = new Date(year, month, day, hour, minute, second);
    temp.setMonth(temp.getMonth() - 1);
    this.setTime(temp.getTime());

}

Date.prototype.toLocalJSON = function () {

    function fullZero(value) {
        return value < 10 ? "0" + value : value;
    }

    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();

    var hour = this.getHours();
    var minute = this.getMinutes();
    var second = this.getSeconds();

    return year.toString() + fullZero(month).toString() + fullZero(day).toString() + "T" + fullZero(hour).toString() + fullZero(minute).toString() + fullZero(second).toString() + "Z";

}


Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份          
        "d+": this.getDate(), //日          
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时          
        "H+": this.getHours(), //小时          
        "m+": this.getMinutes(), //分          
        "s+": this.getSeconds(), //秒          
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度          
        "S": this.getMilliseconds() //毫秒          
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
if (!this.WebSocket) {
    var WebSocket = WebSocket || function (url) {
        var SRC = "WebSocket.swf";
        var id = Math.random() * 1E9 | 0, events = {}, s, i;
        //事件关联
        s = ["onopen", "onmessage", "onclose", "onerror"];
        for (i = 0; i < s.length; i++) (function (o, n) {
            var s = events[n] = [];
            window[n + id] = function (e) {
                if (typeof o["on" + n] == "function") o["on" + n](e);
                for (var i = 0; i < s.length; i++) s[i](e);
            };
        })(this, s[i]);
        //绑定事件操作函数
        this.addEventListener = function (e, f) {
            events[e].push(f);
        }, this.removeEventListener = function (e, f) {
            for (var i = 0, s = events[e]; i < s.length; i++)
                if (s[i] == f) s.splice(i, 1), i = s.length;
        };
        //绑定AS接口方法
        this.send = function (e) {
            window["WebSocket" + id].send(e);
        }, this.close = function () {
            window["WebSocket" + id].close();
        };
        //解析构造参数，加载SWF
        var o = url.match(/\/\/([\w.]+)(?::(\d+))?(.*$)/);
        o = [
         "id=" + id, "port=" + (o[2] || 80),
         "host=" + o[1], "path=" + (o[3] || "/")
        ].join("&");
        //var data = [
        //  '<object width="0" height="0" ',
        //  'type="application/x-shockwave-flash" ',
        //  'id="WebSocket' + id + '" data="' + SRC + '">',
        //  '<param name="Movie" value="' + SRC + '" />',
        //  '<param name="FlashVars" value="' + o + '" />',
        //  '</object>'
        //].join("");

        var data = document.createElement("object");

        data.type = "application/x-shockwave-flash";
        data.id = "WebSocket" + id;
        data.data = SRC;

        var param = document.createElement("param");
        param.name = "Movie";
        param.value = SRC;
        data.appendChild(param);

        param = document.createElement("param");
        param.name = "FlashVars";
        param.value = o;
        data.appendChild(param);

        document.body.appendChild(data);

        this.CONNECTING = "CONNECTING";

        this.readyState = "";

        //document.body
        //  ? document.body.insertAdjacentHTML("beforeend", data)
        //  : document.write(data);

    };
}


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

if (/firefox/.test(window.navigator.userAgent.toLowerCase())) {
    HTMLElement.prototype.__defineGetter__("innerText",
    function () {
        var anyString = "";
        var childS = this.childNodes;
        for (var i = 0; i < childS.length; i++) {
            if (childS[i].nodeType == 1)
                anyString += childS[i].tagName == "BR" ? '\n' : childS[i].textContent;
            else if (childS[i].nodeType == 3)
                anyString += childS[i].nodeValue;
        }
        return anyString;
    }
   );
    HTMLElement.prototype.__defineSetter__("innerText",
     function (sText) {
         this.textContent = sText;
     }
    );
}

Array.prototype.sortBy = function (key, desc) {
    function orderBy(a, b) {
        if (is.String(a[key]) && is.String(b[key])) {
            var min = Math.min(a[key].length, b[key].length);

            var result = 0;
            for (var i = 0; i < min; i++) {
                if (desc)
                    result = b[key][i].charCodeAt() - a[key][i].charCodeAt();
                else
                    result = a[key][i].charCodeAt() - b[key][i].charCodeAt();

                if (result != 0)
                    return result;
            }

            if (a[key].length < b[key].length)
                return -1;
            return result;
        }
        if (desc)
            return b[key] - a[key];
        return a[key] - b[key];
    }
    return this.sort(orderBy);
}

if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
    //firefox支持onmousewheel
    addEventListener('DOMMouseScroll', function (e) {
        var onmousewheel = e.target.getAttribute('onmousewheel');
        if (onmousewheel) {
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;    //禁止页面滚动

            if (typeof e.target.onmousewheel != 'function') {
                //将onmousewheel转换成function
                eval('window._tmpFun = function(event){' + onmousewheel + '}');
                e.target.onmousewheel = window._tmpFun;
                window._tmpFun = null;
            }
            // 不直接执行是因为若onmousewheel(e)运行时间较长的话，会导致锁定滚动失效，使用setTimeout可避免
            setTimeout(function () {
                e.target.onmousewheel(e);
            }, 1);
        }
    }, false);
}

var ie8_Elements = ["HTMLTableRowElement", "HTMLTableSectionElement"];


for (var i = 0; i < ie8_Elements.length; i++) {
    var element = eval(ie8_Elements[i]);
    element.prototype.clear = function () {
        try {
            this.innerHTML = "";
        } catch (ex) {
            for (var i = 0; ; i++) {
                if (this.childNodes.length == 0)
                    break;
                var node = this.childNodes[0];
                node.parentNode.removeChild(node);
            }
        }
    }

}