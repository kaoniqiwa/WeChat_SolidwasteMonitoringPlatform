import { TheDayTime } from "../../common/tool";


export declare interface AsideListPageWindow extends Window {
    Page: AsideListPage
}



export interface AsideListItem {
    id: string,
    name: string
}

export enum SelectionMode {
    single,
    multiple
}

export class AsideListPage {
    private that = this;
    items?: Array<AsideListItem>;
    canSelected = true;
    selectionMode = SelectionMode.multiple;
    constructor() {
        this.init();
    }

    private element = {
        template: document.querySelector("#aside-template")!,
        template_div: document.querySelector("#aside-item")!,
        title: document.querySelector(".aside-title")!,
        footer: document.querySelector(".aside-footer") as HTMLElement,
        list: document.querySelector(".aside-main")!,
        btn: {
            reset: document.querySelector(".footer-reset")!,
            confirm: document.querySelector(".footer-confirm")!
        }
    }

    private init() {
        if (this.element.btn.reset) {
            this.element.btn.reset.addEventListener("click", () => {
                this.resetSelected();
                if (this.resetclicked) {
                    this.resetclicked();
                }
            })
        }
        if (this.element.btn.confirm) {
            this.element.btn.confirm.addEventListener("click", () => {
                if (this.confirmclicked) {
                    this.confirmclicked(this.selectedItems);
                }
            })
        }
    }

    selectedItems: Global.Dictionary<AsideListItem> = {}

    resetSelected() {
        try {

            let selecteds = this.element.list.getElementsByClassName("selected");
            for (let i = 0; i < selecteds.length; i++) {
                const selected = selecteds[i];
                (function (selected) {
                    setTimeout(() => {
                        selected.classList.remove("selected");
                    });

                })(selected)

            }
            this.selectedItems = {};
        } catch (ex) {
            console.error(ex);
        }
    }


    resetclicked?: () => void;
    confirmclicked?: (selecteds: Global.Dictionary<AsideListItem>) => void;


    view(opts: {
        title: string,
        items: Array<AsideListItem>,
        footer_display: boolean
    }) {
        this.element.title.innerHTML = opts.title;
        if (opts.footer_display == false) {
            this.element.footer.style.display = "none"
        }
        this.items = opts.items;
        let that = this;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            //let info = this.element.template.cloneNode(true) as DocumentFragment;
            let div = this.element.template_div.cloneNode(true) as HTMLDivElement;
            // let div = info.querySelector('.aside-item') as HTMLDivElement;
            div.textContent = item.name;
            div.setAttribute('id', item.id);
            div.data = item;
            div.addEventListener('click', function () {
                if (that.canSelected) {
                    switch (that.selectionMode) {
                        case SelectionMode.multiple:
                            if (this.classList.contains('selected')) {
                                this.classList.remove('selected')
                                delete that.selectedItems[this.id];

                            } else {
                                this.classList.add('selected');
                                that.selectedItems[this.id] = this.data;
                            }
                            break;
                        case SelectionMode.single:
                            let selected = that.element.list.querySelector(".selected");
                            if(selected)
                            {
                                selected.classList.remove('selected');                                
                                that.selectedItems = {};
                            }
                            this.classList.add('selected');
                            that.selectedItems[this.id] = this.data;
                            break;
                        default:
                            break;
                    }

                }
            })
            this.element.list.appendChild(div);
        }
    }
}


(window as unknown as AsideListPageWindow).Page = new AsideListPage();