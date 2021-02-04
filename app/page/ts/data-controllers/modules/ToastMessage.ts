
declare var $: any;

export enum ToastIcon {
    success = "weui-icon-success-no-circle weui-icon_toast",
    warn = "weui-icon-warn weui-icon_toast"
}


export class ToastMessage {

    id: string;
    message: string = "";
    parent: HTMLElement;
    icon?: ToastIcon;
    autoHide: boolean = true;
    get html() {
        let str = `<div class="weui-mask_transparent"></div>
       <div class="weui-toast">`;
        if (this.icon) {
            str += `<i class="${this.icon}"></i>`
        }
        str += `<p class="weui-toast__content">${this.message}</p>
       </div>`
        return str;
    };
    get $toast() {
        return $('#'+this.id);
    }

    constructor(opts: { id: string, message?: string, parent: HTMLElement, autoHide?: boolean, iconClassName?: ToastIcon }) {
        this.id = opts.id;
        if (opts.message) {
            this.message = opts.message;
        }
        this.parent = opts.parent;
        if (opts.autoHide != undefined) {
            this.autoHide = opts.autoHide;
        }
        this.init();
    }
    private div!: HTMLDivElement;
    init() {
        this.div = document.createElement("div");
        this.div.id = this.id;
        this.div.innerHTML = this.html;        
        this.div.style.display = "none";
        this.parent.appendChild(this.div);
    }

    reflash() {
        this.div.innerHTML = this.html;
    }



    show(message?: string, icon?: ToastIcon) {        

        if (message) {
            this.message = message;
        }
        this.icon = icon;
        this.reflash();

        this.$toast.fadeIn(100);

        if (this.autoHide) {
            setTimeout(() => {
                this.hide();
            }, 2000);
        }
    }
    hide() {
        this.$toast.fadeOut(100);
    }


}