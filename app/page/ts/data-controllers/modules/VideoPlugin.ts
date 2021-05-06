export class VideoPlugin {
    videoUrl: string;
    name: string;
    webUrl: string;

    get base64VideoUrl() {
        return base64encode(this.videoUrl)
    }
    get base64Name() {
        let name = utf16to8(this.name);
        return base64encode(name);
    }

    toolStyle?= undefined;

    get base64ToolStyle() {
        if (!this.toolStyle) {
            return "";
        }
        let str = JSON.stringify(this.toolStyle);
        return base64encode(str);
    }

    private _width: number;
    set width(val: number) {
        this._width = val;
    }
    get width(): number {
        return this._width;
    }


    private _height: number;
    public get height(): number {
        return this._height;
    }
    public set height(v: number) {
        this._height = v;
    }


    iframe: HTMLIFrameElement;


    /**
     * 是否横屏
     *
     * @type {boolean}
     * @memberof VideoPlugin
     */
    landscape: boolean;


    constructor(name: string, videoUrl: string, webUrl: string) {
        this.videoUrl = videoUrl;
        this.name = name;
        this.webUrl = webUrl;
        this.createElement();
        this.eventRegist();
    }

    destory() {
        this.iframe.parentElement.removeChild(this.iframe);
        this.iframe = null;
    }

    autoSize() {
        if (this.landscape) {
            this.iframe.style.transform = "rotate (90deg)";
            this.width = this.iframe.parentElement.offsetWidth;
            this.height = this.iframe.parentElement.offsetHeight;
        }
        else {
            this.width = window.innerWidth;
            this.height = this.width / 16 * 9;
        }

        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";
    }


    getElement() {
        this.iframe.style.width = this.width + "px";
        this.iframe.style.height = this.height + "px";
        this.iframe.style.position = "absolute"
        this.iframe.style.zIndex = "3";
        this.iframe.src = `${this.webUrl}?url=${this.base64VideoUrl}&name=${this.base64Name}&tool_style=${this.base64ToolStyle}`;
        return this.iframe;
    }

    createElement() {
        this.iframe = document.createElement("iframe");
        this.iframe.addEventListener("click", ()=>{
            console.log("iframe click");
        })
    }

    eventRegist() {
        
        window.addEventListener("resize", ()=>{
            this.landscape = window.innerWidth > window.innerHeight;
            setTimeout(() => {
                this.autoSize();
            }, 100)
        })
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
        this.getElement().outerHTML;
        //return '<iframe style="width:' + this.width + 'px;height:' + this.height + 'px" src="' + wsPlayerUrl + '"></iframe>';
    }
}