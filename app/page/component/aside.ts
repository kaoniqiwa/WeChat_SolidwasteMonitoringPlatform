declare var mui: any;

export class FilterAside {

    inner = `<div id="offCanvasSideScroll" class="mui-scroll-wrapper">
                    <div class="mui-scroll division">
                        <div class="title">
                            居委
                        </div>
                        <div class="content divisions">
                            <ul class="" id="division_list"></ul>
                        </div>

                    </div>
                    <div style="width: 100%;" class="bar">
                        <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" id="btn_reset">
                            重置
                        </button>
                        <button type="button" class="mui-btn mui-btn-primary ok" id='btn_ok'>
                            确认
                        </button>
                    </div>
                </div>`;


    html: HTMLElement;

    constructor(opts: {
        parentId: string,
        triggerId: string,
        asideId?: string,
        inner?: string,
        loaded: () => void,
        ok: () => void,
        reset: () => void
    }) {
        this.parentId = opts.parentId;
        this.triggerId = opts.triggerId;
        this.loaded = opts.loaded;
        this.ok = opts.ok;
        this.reset = opts.reset;
        if (opts.asideId)
            this.asideId = opts.asideId;
        this.html = document.createElement("aside");
        this.html.className = "mui-off-canvas-right";
        this.html.innerHTML = this.inner;

        
        if (opts.inner)
            this.inner = opts.inner

        this.html.id = this.asideId;
        document.getElementById(this.parentId).appendChild(this.html);
        let scroll = this.html.getElementsByClassName("mui-scroll")[0];
        scroll.innerHTML = this.inner;
        this.Init();
    }

    asideId = "offCanvasSide";
    parentId: string;
    triggerId: string;

    loaded: () => void;

    ok: () => void;
    reset: () => void;

    begin: Date;
    end: Date;


    Init() {

        //侧滑容器父节点
        const offCanvasWrapper = mui('#' + this.parentId);
        mui.init({
            swipeBack: false,
        });
        //主界面容器
        // const offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
        //菜单容器
        const offCanvasSide = document.getElementById(this.asideId);

        //移动效果是否为整体移动
        const moveTogether = false;
        //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
        const classList = offCanvasWrapper[0].classList;

        offCanvasSide.classList.remove('mui-transitioning');
        offCanvasSide.setAttribute('style', '');
        classList.remove('mui-slide-in');
        classList.remove('mui-scalable');
        if (moveTogether) {
            //仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
            offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
        }
        classList.add('mui-slide-in');
        offCanvasWrapper.offCanvas().refresh();

        document.getElementById(this.triggerId).addEventListener('tap', function () {
            offCanvasWrapper.offCanvas('show');
        });
        document.getElementById('btn_ok').addEventListener('tap', (e) => {
            this.ok();

            setTimeout(function () {
                offCanvasWrapper.offCanvas('close');
            }, 50)
        });
        //实现ios平台的侧滑关闭页面；
        if (mui.os.plus && mui.os.ios) {
            offCanvasWrapper[0].addEventListener('shown', function (e) { //菜单显示完成事件
                mui.os.plus.webview.currentWebview().setStyle({
                    'popGesture': 'none'
                });
            });
            offCanvasWrapper[0].addEventListener('hidden', function (e) { //菜单关闭完成事件
                mui.os.plus.webview.currentWebview().setStyle({
                    'popGesture': 'close'
                });
            });

        }

        const reset = document.getElementById("btn_reset")
        reset.addEventListener('click', (e) => {
            e.stopPropagation();
            setTimeout(() => {
                this.reset();
            }, 0)

        });


        this.loaded();
    }
}