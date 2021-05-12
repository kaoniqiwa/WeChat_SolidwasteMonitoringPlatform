export class VideoPlugin {
    videoUrl: string;
    name: string;
    webUrl: string;
    proxy?: WSPlayerProxy;
    tools?: PlayerTools;
    background?: HTMLDivElement;

    get base64VideoUrl() {
        return base64encode(this.videoUrl)
    }
    get base64Name() {
        let name = utf16to8(this.name);
        return base64encode(name);
    }

    toolStyle?= { display: "none" };

    get base64ToolStyle() {
        if (!this.toolStyle) {
            return "";
        }
        let str = JSON.stringify(this.toolStyle);
        return base64encode(str);
    }

    private _width: number = window.innerWidth;
    set width(val: number) {
        this._width = val;
    }
    get width(): number {
        return this._width;
    }


    private _height: number = this.width / 16 * 9;
    public get height(): number {
        return this._height;
    }
    public set height(v: number) {
        this._height = v;
    }



    iframe?: HTMLIFrameElement;

    isFullScreen: boolean = false;

    constructor(name: string, videoUrl: string, webUrl: string) {
        this.videoUrl = videoUrl;
        this.name = name;
        this.webUrl = webUrl;
        this.createElement();
        this.eventRegist();
        this.webUrl = "http://192.168.21.149:8116/wsplayer.html";
    }

    destory() {

        if (this.iframe) {
            if (this.iframe.parentElement) {
                this.iframe.parentElement.removeChild(this.iframe);
            }
            this.iframe = undefined;
        }
        if (this.background) {
            if (this.background.parentElement) {
                this.background.parentElement.removeChild(this.background);
            }
            this.background = undefined;
        }
        if (this.proxy) {
            this.proxy.destory();
            this.proxy = undefined;
        }

    }
    autoSize() {
        this.videoAutoSize();
        this.toolsAutoSize();
    }

    get isIOS() {
        const u = navigator.userAgent;
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
        ///
        // ios终端
        // alert('是否是Android：'+isAndroid);
        // alert('是否是iOS：'+isiOS);
        return isiOS;
    }


    toolsAutoSize() {
        if (!this.tools || !this.tools.element) return;
        if (this.isFullScreen) {
            this.tools.element.style.transform = "rotate(90deg)";
            this.tools.element.style.webkitTransform = "rotate(90deg)";
            // calc(50% - -24px)
            this.tools.element.style.top = "calc(50% - " + (52 / 2) + "px)";
            this.tools.element.style.marginTop = "0";
            this.tools.element.style.left = "-" + (this.height - 52 / 2) + "px";

            this.tools.element.style.width = this.width + "px";

            if(this.isIOS)
            {
                // -253
                // this.height 375;
                this.tools.element.style.left = "-" + (this.height / 2 + 52 * 2) + "px";

            }
        }
        else {
            this.tools.element.style.marginTop = this.height / 2 - 52 - 19 + "px";
            this.tools.element.style.transform = "";
            this.tools.element.style.webkitTransform = "";
            this.tools.element.style.top = "50%";
            this.tools.element.style.left = "";
            this.tools.element.style.width = "";
        }
    }

    videoAutoSize() {
        if (!this.iframe) return;
        if (this.isFullScreen) {
            this.iframe.style.transform = "rotate(90deg)";
            this.iframe.style.webkitTransform = "rotate(90deg)";
            this.iframe.style.marginTop = ""
            this.height = window.innerWidth;
            // this.iframe.style.top = "50%";
            // this.iframe.style.left = "50%";
            let height = window.innerHeight;
            if (this.iframe.parentElement) {
                height = this.iframe.parentElement.offsetHeight;
            }
            let min = Math.min(height, document.body.clientHeight);
            this.width = min;
            // transform-origin
            this.iframe.style.transformOrigin = 'center'//this.width/2 +"px "+ this.height/2 +"px"

            this.iframe.style.top = "calc(50% - " + this.height / 2 + "px)";
            this.iframe.style.left = "-" + this.height / 2 + "px";
            if(this.isIOS)
            {
                this.iframe.style.left = "-" + (this.height / 2 - 52) + "px";                
            }
        }
        else {
            this.iframe.style.top = "50%";
            this.iframe.style.left = "";
            this.iframe.style.marginTop = "-33%"
            this.iframe.style.transform = "";
            this.iframe.style.webkitTransform = "";
            this.width = window.innerWidth;
            this.height = this.width / 16 * 9;

        }


        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";


    }


    getElement() {
        if (!this.iframe || !this.background) return;
        this.iframe.style.top = "50%";
        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";
        this.iframe.style.marginTop = "-33%"
        this.iframe.src = `${this.webUrl}?url=${this.base64VideoUrl}&name=${this.base64Name}&tool_style=${this.base64ToolStyle}`;
        return this.background;
    }

    loadElement(parent: HTMLElement, mode: string) {
        if (!this.iframe || !this.background) return;
        const element = this.getElement();
        if (element) {
            parent.classList.add('player')
            parent.appendChild(element);
        }

        this.tools = new PlayerTools(element, mode);
        this.tools.element.style.top = "50%";
        this.tools.element.style.position = "absolute";
        this.tools.element.style.marginTop = this.height / 2 - 52 - 19 + "px";
        this.tools.createElements();
        if (this.proxy) {
            this.proxy.mode = mode;
            this.proxy.toolsBinding(this.tools);
        }

    }

    createElement(mode?: string) {
        this.background = this.createBackground();
        this.iframe = this.createIframe();
        this.background.appendChild(this.iframe);
        this.createWSPlayerProxy(mode);
    }

    createIframe() {
        const iframe = document.createElement("iframe");
        iframe.style.zIndex = "999";
        iframe.style.left = "0";
        iframe.style.border = "none";
        iframe.style.position = "relative";

        return iframe;
    }

    createBackground() {
        const background = document.createElement("div")
        background.style.position = "absolute"
        background.style.width = "100%"
        background.style.height = "100%"
        return background;
    }

    createWSPlayerProxy(mode?: string) {
        if (!this.iframe) return;
        this.proxy = new WSPlayerProxy(this.iframe, mode);
        this.proxy.onStoping = () => {

            this.PlayerStoping();
        }
        this.proxy.onButtonClicked = (btn) => {
            if (btn == "fullscreen") {
                this.isFullScreen = !this.isFullScreen;
                this.autoSize();
                // if (this.tools) {
                //     this.tools.control
                // }
            }
        }
    }

    PlayerStoping() {

        this.destory();
    }

    eventRegist() {
        // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", () => {
        //     if (window.orientation === 180 || window.orientation === 0) {
        //         this.landscape = false;
        //     }
        //     if (window.orientation === 90 || window.orientation === -90) {
        //         this.landscape = true;
        //     }


        // }, false);
    }





    toHtml() {
        let element = this.getElement();
        if (element) {
            return element.outerHTML;
        }
        //return '<iframe style="width:' + this.width + 'px;height:' + this.height + 'px" src="' + wsPlayerUrl + '"></iframe>';
    }
}