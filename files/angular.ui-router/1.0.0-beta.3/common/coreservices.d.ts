/**
 * This module is a stub for core services such as Dependency Injection or Browser Location.
 * Core services may be implemented by a specific framework, such as ng1 or ng2, or be pure javascript.
 *
 * @module common
 */
/** for typedoc */
import { IInjectable, Obj } from "./common";
declare let services: CoreServices;
export interface $QLikeDeferred {
    resolve: (val?: any) => void;
    reject: (reason?: any) => void;
    promise: Promise<any>;
}
export interface $QLike {
    when<T>(val?: T): Promise<T>;
    reject<T>(reason: any): Promise<T>;
    defer(): $QLikeDeferred;
    all(promises: {
        [key: string]: Promise<any>;
    }): Promise<any>;
    all(promises: Promise<any>[]): Promise<any[]>;
}
export interface $InjectorLike {
    get(token: any): any;
    has(token: any): boolean;
    invoke(fn: IInjectable, context?: any, locals?: Obj): any;
    annotate(fn: IInjectable, strictDi?: boolean): any[];
    strictDi?: boolean;
}
export interface CoreServices {
    $q: $QLike;
    $injector: $InjectorLike;
    /** Services related to getting or setting the browser location (url) */
    location: LocationServices;
    /** Retrieves configuration for how to construct a URL. */
    locationConfig: LocationConfig;
    template: TemplateServices;
}
export interface LocationServices {
    setUrl(newurl: string, replace?: boolean): void;
    path(): string;
    search(): string;
    hash(): string;
    onChange(callback: Function): Function;
}
export interface LocationConfig {
    port(): number;
    protocol(): string;
    host(): string;
    baseHref(): string;
    html5Mode(): boolean;
    hashPrefix(): string;
    hashPrefix(newprefix: string): string;
}
export interface TemplateServices {
    get(url: string): Promise<string>;
}
export { services };
