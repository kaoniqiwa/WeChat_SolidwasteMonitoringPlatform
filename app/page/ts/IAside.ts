export default abstract class IAside {
    private observerList: Set<IObserver> = new Set();

    add(observer: IObserver) {
        this.observerList.add(observer)
    }
    remove(observer: IObserver) {
        this.observerList.delete(observer);
    }
    notify(args) {
        this.observerList.forEach(observer => {
            observer.update(args)
        })
    }
}