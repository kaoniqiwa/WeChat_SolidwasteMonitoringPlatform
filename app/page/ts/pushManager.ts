import { SessionUser } from "../../common/session-user";
import { User } from "../../data-core/model/user-stystem";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { Service } from "../../data-core/repuest/service";
import { ControllerFactory } from "./data-controllers/ControllerFactory";
import { IUserPushManager } from "./data-controllers/IController";
import { UserWindow } from "./user-current";

namespace PushManagerPage {
    class Page {
        element = {
            check: {
                IllegalDrop: document.getElementById('check_IllegalDrop') as HTMLInputElement,
                MixedInto: document.getElementById('check_MixedInto') as HTMLInputElement,
                GarbageFull: document.getElementById('check_GarbageFull') as HTMLInputElement,
                GarbageDrop: document.getElementById('check_GarbageDrop') as HTMLInputElement,
                GarbageDropTimeout: document.getElementById('check_GarbageDropTimeout') as HTMLInputElement,
                GarbageDropHandle: document.getElementById('check_GarbageDropHandle') as HTMLInputElement
            },
            button: {
                back: document.getElementById('back') as HTMLDivElement,
                ok: document.querySelector(".ok") as HTMLLinkElement
            }
        }

        user?: User;

        constructor(private session: SessionUser, private dataController: IUserPushManager) {
            debugger;
            this.bindEvents();
            this.setStatus();
        }

        getUser() {
            return this.dataController.GetUser(this.session.WUser.Id);
        }

        setStatus() {
            let promise = this.getUser();
            promise.then((user) => {
                for (let i = 0; i < user.OffEvents.length; i++) {
                    const offEvent = user.OffEvents[i];
                    const name = EventType[(offEvent as EventType)]
                    let check = document.getElementById('check_' + name) as HTMLInputElement;
                    check.checked = false;
                }
            });

        }

        submit() {
            let promise = this.getUser();
            promise.then((user) => {
                var offEvents = [];
                for (const key in this.element.check) {
                    if (Object.prototype.hasOwnProperty.call(this.element.check, key)) {
                        const check = this.element.check[key] as HTMLInputElement;
                        if (check.checked == false) {
                            offEvents.push(EventType[check.value]);
                        }
                    }
                }

                user.OffEvents = offEvents;

                this.dataController.SetUser(user);
            });

        }

        bindEvents() {
            this.element.button.back.addEventListener('click', () => {

                window.parent?.HideUserAside();
            });
            this.element.button.ok.addEventListener('click', () => {
                debugger;
                this.submit();
                window.parent?.HideUserAside();
            })
        }
    }

    let user = (window.parent as UserWindow).User;
    let http = (window.parent as UserWindow).Authentication;
    const type = user.WUser.Resources![0].ResourceType;
    const service = new Service(http)
    const dataController = ControllerFactory.Create(service, type, user.WUser.Resources!)

    let page = new Page(user, dataController);
}