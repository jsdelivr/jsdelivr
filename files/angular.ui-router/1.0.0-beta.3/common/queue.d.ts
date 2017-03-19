/** @module common */ /** for typedoc */
export declare class Queue<T> {
    private _items;
    private _limit;
    constructor(_items?: T[], _limit?: number);
    enqueue(item: T): T;
    dequeue(): T;
    clear(): Array<T>;
    size(): number;
    remove(item: T): T;
    peekTail(): T;
    peekHead(): T;
}
