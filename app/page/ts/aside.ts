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
            this._backdrop.addEventListener('click', () => {
                this.Hide();
            })
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
    }
}