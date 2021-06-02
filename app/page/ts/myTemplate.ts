import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { DataController } from "./data-controllers/DataController";
import "../css/myTemplate.less";


// 数据模板
export interface GarbageDropData {
  EventType: EventType;
  EventName: string;
  imageUrls: string[];
  StationName: string;
  StationId: string;
  DivisionName: string;
  DivisionId: string;
  EventTime: string;
  EventId: string;
  index: number
}

// CustomEvent 的 polyfill
(function () {
  try {
    // a : While a window.CustomEvent object exists, it cannot be called as a constructor.
    // b : There is no window.CustomEvent object
    new window.CustomEvent('T');
  } catch (e) {
    var CustomEvent = function (event: string, params: CustomEventInit<any>) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };

      var evt = document.createEvent('CustomEvent');

      evt.initCustomEvent(event, params.bubbles!, params.cancelable!, params.detail);

      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;

    Reflect.defineProperty(window, 'CustomEvent', {
      value: CustomEvent
    })
  }
})();

/**
 * 
 *  pmx
 */
enum GarbageDropStatus {
  GarbageDrop = '落地',
  GarbageDropTimeout = '滞留',
  GarbageDropHandle = '处置'
}
export default class MyTemplate {
  templateDocument?: DocumentFragment;

  fragment: DocumentFragment = document.createDocumentFragment();

  _dataChunk: Array<GarbageDropData> = [];

  _dataTotal: Array<GarbageDropData> = [];

  get dataChunk() {
    return this._dataChunk
  }

  set dataChunk(val) {
    this._dataChunk = val;

    this.createContent(val)
  }

  get dataTotal() {
    return this._dataTotal
  }

  set dataTotal(val) {
    this._dataTotal = val;
    this.createContent(val)

  }

  constructor() {

  }
  /**
   *  模板源
   * @param selector 
   */
  bindTo(selector: string) {
    // document 对象,这里是 <template>，也可以是 iframe.contentDocument
    this.templateDocument = (document.querySelector(selector) as HTMLTemplateElement).content;

  }
  private createContent(data: Array<GarbageDropData>) {

    // 将外部文档的内容导入本文档中
    if (!this.templateDocument) return
    let cardNode = document.importNode(this.templateDocument.querySelector('.card') as HTMLElement, true)
    for (let i = 0; i < data.length; i++) {
      let v = data[i];
      let card = cardNode.cloneNode(true) as HTMLDivElement;
      card.setAttribute('index', v.index.toString())
      card.setAttribute('id', v.StationId);
      card.setAttribute('division-id', v.DivisionId);
      card.setAttribute('event-type', v.EventType + '');

      (card.querySelector('.station-name') as HTMLElement).textContent = v.StationName;

      (card.querySelector('.division-name') as HTMLElement).textContent = v.DivisionName;

      (card.querySelector('.event-time') as HTMLElement).textContent = v.EventTime;
      let statusDiv = card.querySelector<HTMLElement>('.status')
      if (statusDiv) {
        if (v.EventType == EventType.GarbageDrop) {
          statusDiv.textContent = GarbageDropStatus.GarbageDrop;
          statusDiv.className = 'card-title__appendix status drop';

        } else if (v.EventType == EventType.GarbageDropTimeout) {
          statusDiv.textContent = GarbageDropStatus.GarbageDropTimeout;
          statusDiv.className = 'card-title__appendix status timeout';
        } else if (v.EventType == EventType.GarbageDropHandle) {
          statusDiv.textContent = GarbageDropStatus.GarbageDropHandle;
          statusDiv.className = 'card-title__appendix status handle';
        }
      }

      let cardImg = card.querySelector<HTMLElement>('.card-img');
      if (cardImg) {
        cardImg.innerHTML = '';
        v.imageUrls.forEach(url => {
          let img = new Image();
          img.src = url;
          img.onerror = function () {
            console.log('eror')
            img.src = DataController.defaultImageUrl;
          }
          img.onload = function () {
            cardImg!.appendChild(img)
          }

        })
      }
      card.addEventListener('click', function () {
        let event = new CustomEvent('click-card', {
          detail: {
            index: this.getAttribute('index'),
            eventType: this.getAttribute('event-type')
          },
          bubbles: true,
          cancelable: true
        })
        this.dispatchEvent(event);
      })
      this.fragment.appendChild(card)
    }
  }

}