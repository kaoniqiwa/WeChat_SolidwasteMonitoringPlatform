import { IPictureController } from "../ViewModels";

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
  capturePicture?: CapturePicture;
  picture: PictureController;

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

  constructor(name: string, videoUrl: string, webUrl: string, picture: IPictureController) {
    this.picture = picture;
    this.videoUrl = videoUrl;
    this.name = name;
    this.webUrl = webUrl;
    this.createElement();
    this.eventRegist();
    // this.webUrl = "http://192.168.21.149:8116/wsplayer.html"
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
    if (this.capturePicture) {
      this.capturePicture.destory();
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


    this.capturePicture = new CapturePicture(parent);
    this.capturePicture.onPanelClicked = () => {
      if (this.proxy) {
        this.proxy.resume();
      }
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

    return iframe;
  }
  createBackground() {
    const background = document.createElement("div")
    background.className = "video_background"
    return background;
  }
  createCapturePicture() {

  }

  soundOpened = false;

  createWSPlayerProxy(mode?: string) {
    if (!this.iframe) return;
    this.proxy = new WSPlayerProxy(this.iframe, mode);

    this.proxy.onStatusChanged = (status: WSPlayerState) => {
      switch (status) {
        case WSPlayerState.playing:
          setTimeout(() => {
            if (!this.proxy) return;
            if (!this.soundOpened) {
              console.log("openSound")
              this.proxy.openSound();
              this.soundOpened = true;

            }
          }, 0)
          break;

        default:
          break;
      }
    }





    this.proxy.onCapturePicture = (url) => {
      let promise = this.picture.post(url);
      promise.then((id) => {
        let url = this.picture.get(id);
        if (this.capturePicture) {
          this.capturePicture.panel.style.display = "block";
          this.capturePicture.img.src = url;
          if (this.proxy && this.proxy.mode == "vod") {
            this.proxy.pause()
          }
        }
      });



    }
    this.proxy.onStoping = () => {

      this.PlayerStoping();
    }
    this.proxy.onButtonClicked = (btn) => {
      if (btn == "fullscreen") {
        if (this.proxy) {
          if (this.proxy.isFullScreen) {
            this.proxy.exitfullscreen();
          }
          else {
            if (this.background)
              this.proxy.fullscreen(this.background.parentElement);

          }
          if (this.isIOS) {
            this.proxy.onFullScreenChanged();
          }
        }

        // if (this.tools) {
        //     this.tools.control
        // }

      }
    }
    this.proxy.onFullScreenChanged = () => {
      if (this.proxy)
        this.isFullScreen = this.proxy.isFullScreen;
      this.autoSize();
      this.setBodySize();
      if (this.onFullscreenChanged) {
        this.onFullscreenChanged(this.isOrientation || this.isFullScreen);
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
  onFullscreenChanged?: (bool: boolean) => void;
  setBodySize() {

    if (!this.background) return;

    if (this.isOrientation || this.isFullScreen) {
      this.background.classList.add("fullscreen");
    }
    else {
      this.background.classList.remove("fullscreen");
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
        this.onFullscreenChanged(this.isOrientation || this.isFullScreen);
      }
    }, 10);
  }



  onFullScreenChanged() {
    alert(this.isFullScreen)
    this.autoSize();
    this.setBodySize();
    if (this.onFullscreenChanged) {
      this.onFullscreenChanged(this.isOrientation || this.isFullScreen);
    }
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

export class CapturePicture {
  panel: HTMLDivElement;
  img: HTMLImageElement;
  description: HTMLDivElement;
  constructor(private parent: HTMLElement) {
    this.panel = document.createElement("div");
    this.panel.className = "capturePicture"
    this.parent.appendChild(this.panel);

    this.img = document.createElement("img")
    this.panel.appendChild(this.img);
    this.panel.style.display = "none";

    this.description = document.createElement("div");
    this.description.className = "description"
    this.description.innerHTML = this.isIOS ? '长按图片“添加到照片”' : '长按图片“发送给朋友”或“保存到手机”';
    this.panel.appendChild(this.description);


    this.registEvent();
  }




  onPanelClicked?: () => void;

  registEvent() {
    this.panel.addEventListener("click", (e) => {
      this.panel.style.display = "none";
      if (this.onPanelClicked) {
        this.onPanelClicked();
      }
      e.stopPropagation();
    });
    this.img.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  destory() {
    this.parent.removeChild(this.panel);
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
}

