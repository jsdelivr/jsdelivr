import { Predicate } from "./common";
export declare const isUndefined: (x: any) => boolean;
export declare const isDefined: Predicate<any>;
export declare const isNull: (o: any) => boolean;
export declare const isFunction: (x: any) => x is Function;
export declare const isNumber: (x: any) => x is number;
export declare const isString: (x: any) => x is string;
export declare const isObject: (x: any) => boolean;
export declare const isArray: (arg: any) => arg is any[];
export declare const isDate: (x: any) => x is Date;
export declare const isRegExp: (x: any) => x is RegExp;
/**
 * Predicate which checks if a value is injectable
 *
 * A value is "injectable" if it is a function, or if it is an ng1 array-notation-style array
 * where all the elements in the array are Strings, except the last one, which is a Function
 */
export declare function isInjectable(val: any): boolean;
/**
 * Predicate which checks if a value looks like a Promise
 *
 * It is probably a Promise if it's an object, and it has a `then` property which is a Function
 */
export declare const isPromise: (x: any) => x is Promise<any>;
