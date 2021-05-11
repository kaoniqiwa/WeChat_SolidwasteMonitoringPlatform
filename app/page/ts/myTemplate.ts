import { dateFormat } from "../../common/tool";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { GarbageDropEventRecord } from "../../data-core/model/waste-regulation/event-record";
import { DataController } from "./data-controllers/DataController";
import { GarbageDropData } from './GarbageDrop';
import "../css/myTemplate.less";

// CustomEvent 的 polyfill
(function () {
  try {
    // a : While a window.CustomEvent object exists, it cannot be called as a constructor.
    // b : There is no window.CustomEvent object
    new window.CustomEvent('T');
  } catch (e) {
    var CustomEvent = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };

      var evt = document.createEvent('CustomEvent');

      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

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
interface MyTemplateOption {
  data: GarbageDropEventRecord
}
export default class MyTemplate {
  templateDocument: DocumentFragment;
  card: HTMLDivElement;

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

    // if ('replaceChildren' in this.fragment) {
    //   (this.fragment['replaceChildren'] as Function)()
    //   console.log('has replaceChildren')
    // }
    // else {
    //   console.log('Does not has replaceChildren')
    //   while (this.fragment.childNodes.length) {
    //     this.fragment.removeChild(this.fragment.firstChild)
    //   }
    // }


    this.createContent(val)
  }

  constructor(selector, options?: MyTemplateOption) {
    // document 对象,这里是 <template>，也可以是 iframe.contentDocument
    this.templateDocument = (document.querySelector(selector) as HTMLTemplateElement).content;
    // 将外部文档的内容导入本文档中
    this.card = document.importNode(this.templateDocument.querySelector('.card'), true)

  }
  createContent(data: Array<GarbageDropData>) {
    for (let i = 0; i < data.length; i++) {
      let v = data[i];
      let card = this.card.cloneNode(true) as HTMLDivElement;

      card.setAttribute('index', v.index.toString())
      card.setAttribute('id', v.StationId);
      card.setAttribute('division-id', v.DivisionId);
      card.setAttribute('event-type', v.EventType + '');

      card.querySelector('.station-name').textContent = v.StationName;
      card.querySelector('.division-name').textContent = v.DivisionName;

      card.querySelector('.event-time').textContent = dateFormat(new Date(v.EventTime), 'yyyy-MM-dd HH:mm:ss')

      if (v.EventType == EventType.GarbageDrop) {
        card.querySelector('.status').textContent = GarbageDropStatus.GarbageDrop;
        card.querySelector('.status').className = 'card-title__appendix status drop';

      } else if (v.EventType == EventType.GarbageDropTimeout) {
        card.querySelector('.status').textContent = GarbageDropStatus.GarbageDropTimeout;
        card.querySelector('.status').className = 'card-title__appendix status timeout';
      } else if (v.EventType == EventType.GarbageDropHandle) {
        card.querySelector('.status').textContent = GarbageDropStatus.GarbageDropHandle;
        card.querySelector('.status').className = 'card-title__appendix status handle';
      }
      card.querySelector('.card-img').innerHTML = '';
      v.imageUrls.forEach(url => {
        let img = new Image();
        img.src = url;
        img.onerror = function () {
          console.log('eror')
          img.src = DataController.defaultImageUrl;
        }
        img.onload = function () {
          card.querySelector('.card-img').appendChild(img)
        }

      })
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