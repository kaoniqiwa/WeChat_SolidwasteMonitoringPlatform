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
    }


    isFullScreen: boolean = false;

    constructor(name: string, videoUrl: string, webUrl: string) {
        this.videoUrl = videoUrl;
        this.name = name;
        this.webUrl = webUrl;
        this.createElement();
        this.eventRegist();        
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



    getElement() {
        if (!this.iframe || !this.background) return;
        this.iframe.src = `${this.webUrl}?url=${this.base64VideoUrl}&name=${this.base64Name}&tool_style=${this.base64ToolStyle}`;
        return this.background;
    }

    loadElement(parent: HTMLElement, mode: string) {
        if (!this.iframe || !this.background) return;
        const element = this.getElement();
        if (element) {
            element.classList.add('player')
            parent.appendChild(element);
        }

        this.tools = new PlayerTools(element, mode);


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

        return iframe;
    }

    createBackground() {
        const background = document.createElement("div")
        background.className = "video_background"      
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
                this.setBodySize();
                // if (this.tools) {
                //     this.tools.control
                // }
                if (this.onFullscreenChanged) {                    
                    this.onFullscreenChanged(this.isOrientation||this.isFullScreen);
                }
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
    onFullscreenChanged?: (bool:boolean) => void;
    setBodySize() {

        if(!this.background)return;
        
        if (this.isOrientation || this.isFullScreen) {
            this.background.classList.add("fullscreen");
            
        }
        else {
            this.background.classList.remove("fullscreen")
        }

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
            if (this.onFullscreenChanged) {                
                this.onFullscreenChanged(this.isOrientation||this.isFullScreen);
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
    }
}