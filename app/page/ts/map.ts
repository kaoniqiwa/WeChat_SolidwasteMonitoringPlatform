declare namespace mui {
    export function init({

    }): void
}




let showPath: HTMLDivElement = document.querySelector('#show_path') as HTMLDivElement;
let solidWaste: HTMLDivElement = document.querySelector('#solid_waste') as HTMLDivElement;
let resetBtn: HTMLElement = document.querySelector('#resetBtn') as HTMLElement;
let confirmBtn: HTMLElement = document.querySelector('#confirmBtn') as HTMLElement;


let $ = Reflect.get(window, '$');
let wx = Reflect.get(window, 'wx');

$.get(`http://51kongkong.com/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx/GetJsSdkUiPackage?url=${document.location.toString()}&&appid=wx119358d61e31da01`, function (data: any) {

    wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: true,
        // 必填，公众号的唯一标识
        appId: $(data).find("JsSdkUiPackage").find("AppId").text(),
        // 必填，生成签名的时间戳
        timestamp: $(data).find("JsSdkUiPackage").find("Timestamp").text(), //"" + jsondata.Timestamp,
        // 必填，生成签名的随机串
        nonceStr: $(data).find("JsSdkUiPackage").find("NonceStr").text(), // jsondata.NonceStr,
        // 必填，签名
        signature: $(data).find("JsSdkUiPackage").find("Signature").text(), // jsondata.Signature,
        // 必填，需要使用的JS接口列表
        jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation', 'openLocation','hideMenuItems','hideAllNonBaseMenuItem', 'hideOptionMenu']
    });
});
wx.ready(function () {
    wx.checkJsApi({
        jsApiList: ['scanQRCode', 'getLocation', 'getLocation', 'openLocation', 'hideOptionMenu','hideMenuItems','hideAllNonBaseMenuItem'],
        success: function (res: any) {
            
        }
    });
    alert(WeixinJSBridge);



})


