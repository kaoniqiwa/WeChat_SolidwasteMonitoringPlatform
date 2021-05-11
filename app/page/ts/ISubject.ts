/**
 *  pmx
 */
import IObserver from "./IObserver";

export default abstract class ISubject {
  private observerList: Set<IObserver> = new Set();

  add(observer: IObserver) {
    this.observerList.add(observer)
  }
  remove(observer: IObserver) {
    this.observerList.delete(observer);
  }
  notify(args: any) {
    this.observerList.forEach(observer => {
      observer.update(args)
    })
  }
}