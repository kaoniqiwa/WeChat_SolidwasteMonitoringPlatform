import { dateFormat } from "../../common/tool";
import { EventType } from "../../data-core/model/waste-regulation/event-number";
import { GarbageDropEventRecord } from "../../data-core/model/waste-regulation/event-record";
import { DataController } from "./data-controllers/DataController";
import { GarbageDropData } from './GarbageDrop';
import "../css/myTemplate.less"
/**
 * 
 *  pmx
 */
enum GarbageDropStatus {
  GarbageDrop = '已落地',
  GarbageDropTimeout = '已超时',
  GarbageDropHandle = '已处置'
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
    this.templateDocument = (document.querySelector(selector) as HTMLTemplateElement).content;
    // 将外部文档的内容导入本文档中
    this.card = document.importNode(this.templateDocument.querySelector('.card'), true)

  }
  createContent(data: Array<GarbageDropData>) {
    for (let v of data) {
      let card = this.card.cloneNode(true) as HTMLDivElement;

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
      this.fragment.appendChild(card)
    }
  }
}