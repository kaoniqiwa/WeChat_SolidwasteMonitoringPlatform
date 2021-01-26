export class AsideControl {
    private readonly active = 'active'
    id: string;
    private _backdrop?: HTMLElement;
    private element: HTMLElement | null;

    constructor(id: string, registToWindow: boolean = false) {
        this.id = id;
        this.element = document.getElementById(id);
        if (registToWindow) {
            this.RegistToWindow();
        }
    }

    get backdrop(): HTMLElement | undefined {
        return this._backdrop;
    }
    set backdrop(val: HTMLElement | undefined) {
        this._backdrop = val;
        if (this._backdrop) {
            // 会重复添加监听器
            this._backdrop.addEventListener('click', () => {
                this.Hide();
            })
            // pmx:
            // this._backdrop.addEventListener('click', () => {
            //     this.Hide();
            // },{
            //     once:true
            // })
        }
    }


    Show() {
        if (this.element) {
            this.element.classList.add(this.active);
        }
        if (this.backdrop) {
            this.backdrop.style.display = 'block';
        }
    }
    Hide() {
        if (this.element) {
            this.element.classList.remove(this.active);
        }
        if (this.backdrop) {
            this.backdrop.style.display = 'none';
        }
    }



    RegistToWindow() {
        window[this.id] = this;

        //pmx 
        //   Reflect.defineProperty(window,`${this.id}`,{
        //       value:this
        //   })
    }
}