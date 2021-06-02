/**
 *  pmx
 */
import IObserver from "./IObserver";

export default abstract class IAside {
  protected observerList: Set<IObserver> = new Set();

  add(observer: IObserver) {
    this.observerList.add(observer)
  }
  remove(observer: IObserver) {
    this.observerList.delete(observer);
  }
  abstract notify(args: any): void
}