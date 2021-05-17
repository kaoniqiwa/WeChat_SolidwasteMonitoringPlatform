export interface VideoPluginIframeStyle {
    marginTop?: string,
    left: number
}

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
    private _iframeStyle: VideoPluginIframeStyle = {
        marginTop: "-33%",
        left: 0
    }
    get iframeStyle() {
        return this._iframeStyle;
    }
    set iframeStyle(val: VideoPluginIframeStyle) {
        this._iframeStyle = val;
        if (!this.iframe) return;
        if (val.marginTop) {
            this.iframe.style.marginTop = val.marginTop;
        }
    }


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
        window.removeEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.onorientationchange.bind(this), false);
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
        setTimeout(() => {

            if (!this.tools || !this.tools.element) return;
            if (this.isOrientation) {

                let left = document.body.offsetHeight / 2 - document.body.offsetWidth / 2;
                let top = document.body.offsetHeight / 2 - document.body.offsetWidth / 2;

                this.tools.element.style.top = "52px";
                if (this.iframe) {
                    this.tools.element.style.width = this.iframe.style.width;
                    this.tools.element.style.height = this.iframe.style.height;
                    this.tools.element.style.transform = this.iframe.style.transform;
                }

            }
            else if (this.isFullScreen) {

                let left = window.innerHeight / 2 - window.innerWidth / 2;
                let top = window.innerHeight / 2 - window.innerWidth / 2;
                this.tools.element.style.transform = "rotate(90deg) translate(" + left + "px, " + top + "px)";

                // calc(50% - -24px)
                this.tools.element.style.top = "0";
                // this.tools.element.style.marginTop = "0";
                // this.tools.element.style.left = "-" + (this.height - 52 / 2 + this.iframeStyle.left) + "px";

                // this.tools.element.style.width = this.width + "px";



                // if (this.isIOS) {
                //     // -253
                //     // this.height 375;
                //     this.tools.element.style.left = "-" + (this.height / 2 + 52 * 2 + this.iframeStyle.left) + "px";

                // }
                if (this.iframe) {
                    this.tools.element.style.top = "52px";
                    this.tools.element.style.left = this.iframe.style.left;
                    this.tools.element.style.transform = this.iframe.style.transform;
                    this.tools.element.style.width = this.iframe.style.width;
                    this.tools.element.style.height = this.iframe.style.height;
                }
            }
            else {
                this.tools.element.style.transform = "";
                this.tools.element.style.webkitTransform = "";
                this.tools.element.style.top = "calc(50% - " + (21 + 52) + "px)";
                this.tools.element.style.left = "";
                this.tools.element.style.width = this.iframe!.style.width;
                this.tools.element.style.height = this.iframe!.style.height;
            }

        }, 11);
    }

    videoAutoSize() {
        setTimeout(() => {
            if (!this.iframe) return;


            if (this.isOrientation) {

                let width = Math.max(document.body.offsetHeight, document.body.offsetWidth);
                let height = Math.min(document.body.offsetHeight, document.body.offsetWidth, window.innerWidth, window.innerHeight);
                let left = width / 2 - height / 2;
                let top = width / 2 - height / 2;
                // alert(JSON.stringify({

                //         width:width,
                //         height:height

                // }))
                this.iframe.style.marginTop = ""
                this.iframe.style.top = "0";
                this.iframe.style.width = width + "px";
                this.iframe.style.height = height + "px";
                this.iframe.style.transform = "rotate(90deg) translate(" + left + "px, " + top + "px)";

            }
            else if (this.isFullScreen) {

                let left = window.innerHeight / 2 - window.innerWidth / 2;
                let top = window.innerHeight / 2 - window.innerWidth / 2;
                this.iframe.style.transform = "rotate(90deg) translate(" + left + "px, " + top + "px)";
                this.iframe.style.top = "0";
                this.iframe.style.marginTop = ""
                this.height = window.innerWidth;
                let height = this.background!.offsetHeight;
                if (this.iframe.parentElement) {
                    height = this.iframe.parentElement.offsetHeight;
                }
                let min = Math.min(height, document.body.clientHeight);
                this.width = min;

                this.iframe.style.width = this.width + "px";
                this.iframe.style.height = this.height + "px";
            }
            else {
                let width = Math.min(document.body.offsetWidth, document.body.offsetWidth)
                this.iframe.style.top = "50%";
                this.iframe.style.left = "";
                this.iframe.style.marginTop = this.iframeStyle.marginTop!;
                this.iframe.style.transform = "";
                this.iframe.style.webkitTransform = "";
                this.iframe.style.width = width + "px";
                this.iframe.style.height = width / 16 * 9 + "px";
            }



        }, 10)
    }


    getElement() {
        if (!this.iframe || !this.background) return;
        this.iframe.style.top = "50%";
        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";
        this.iframe.style.marginTop = this.iframeStyle.marginTop!;
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

        this.tools.element.style.position = "absolute";
        this.tools.element.style.height = this.height + "px";
        this.tools.element.style.top = "calc(50% - " + (21 + 52) + "px)";
        //this.tools.element.style.marginTop = this.height / 2 - 52 - 19 + "px";

        this.tools.control.content.style.height = "52px";
        this.tools.control.content.style.bottom = "0";
        this.tools.control.content.style.position = "absolute";


        this.tools.createElements();
        if (this.proxy) {
            this.proxy.mode = mode;
            this.proxy.toolsBinding(this.tools);
        }


        this.setBodySize();
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
        background.className = "video_background"
        // background.style.position = "absolute"
        // background.style.width = "100%"
        // background.style.height = "100%"
        // background.style.backgroundColor = "black";
        // background.style.zIndex = "900";        
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

    get isOrientation() {
        let orientation = window.orientation == undefined ? screen.orientation.angle : window.orientation;
        if (orientation === 180 || orientation === 0) {
            return false;
        }
        if (orientation === 90 || orientation === -90) {
            return true;
        }
        return false;
    }
    onOrientationChanged?: () => void;
    setBodySize() {

        if(!this.background)return;


        if (this.isOrientation) {
            this.background.classList.add("fullscreen");
            // let width = Math.max(window.innerWidth, window.innerHeight);
            // let height = Math.min(window.innerWidth, window.innerHeight);
            // let left = width / 2 - height / 2;
            // let top = width / 2 - height / 2;
            // document.body.style.width = height + "px";
            // document.body.style.height = width + "px";
            // document.body.style.transform = "rotate(-90deg) translate(" + left + "px, " + top + "px)";

            // this.background.style.transform = "rotate(-90deg) scale(1.8) translate(10px, 17px)";
        }
        else {
            this.background.classList.remove("fullscreen")
            // document.body.style.transform = ""            
        }
        //this.autoSize();
        // if (orientation === 180 || orientation === 0) {
        //     document.body.style.transform = ""
        //     document.body.style.width = window.innerWidth + "px";
        //     document.body.style.height = window.innerHeight + "px";
        //     if (this.iframe) {
        //         this.iframe.style.width = document.body.style.width;
        //         this.iframe.style.height = document.body.clientWidth / 16 * 9 + "px";
        //         this.iframe.style.transform = "";
        //         this.iframe.style.top = "50%";

        //         if (this.tools) {
        //             this.tools.element.style.top = "52px";
        //             this.tools.element.style.width = this.iframe.style.width;
        //             this.tools.element.style.height = this.iframe.style.height;
        //             this.tools.element.style.transform = this.iframe.style.transform;
        //         }
        //     }
        // }
        // if (orientation === 90 || orientation === -90) {
        //     let left = window.innerWidth / 2 - document.body.offsetHeight / 2;
        //     let top = window.innerWidth / 2 - document.body.offsetHeight / 2;
        //     document.body.style.width = document.body.offsetHeight + "px";
        //     document.body.style.height = window.innerWidth + "px";
        //     document.body.style.transform = "rotate(-90deg) translate(" + left + "px, " + top + "px)";
        //     if (this.iframe) {
        //         this.iframe.style.top = ""
        //         this.iframe.style.width = document.body.style.height;
        //         this.iframe.style.height = document.body.style.width;
        //         this.iframe.style.transform = "rotate(90deg) translate(" + left + "px, " + top + "px)";
        //         if (this.tools) {
        //             this.tools.element.style.width = this.iframe.style.width;
        //             this.tools.element.style.height = this.iframe.style.height;
        //             this.tools.element.style.transform = this.iframe.style.transform;
        //         }
        //     }

        // alert(JSON.stringify({
        //     window:{
        //         width:window.innerWidth,
        //         height:window.innerHeight
        //     },
        //     body:{
        //         client:{
        //             width:document.body.clientWidth,
        //             height: document.body.clientHeight
        //         }
        //     }
        // }))
        // }

    }
    onorientationchange() {
        setTimeout(() => {
            // console.log({
            //     window: {
            //         width: window.innerWidth,
            //         height: window.innerHeight
            //     },
            //     body: {

            //         width: document.body.clientWidth,
            //         height: document.body.clientHeight

            //     }
            // })

            this.setBodySize();
            if (this.onOrientationChanged) {
                this.onOrientationChanged();
            }
        }, 10);
    }
    eventRegist() {
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.onorientationchange.bind(this), false);
    }





    toHtml() {
        let element = this.getElement();
        if (element) {
            return element.outerHTML;
        }
        //return '<iframe style="width:' + this.width + 'px;height:' + this.height + 'px" src="' + wsPlayerUrl + '"></iframe>';
    }
}