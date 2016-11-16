import { IInjectable } from "../common/common";
import { TypedMap } from "../common/common";
import { StateProvider } from "./stateProvider";
import { ResolveContext } from "../resolve/resolveContext";
import * as angular from 'angular';
import IScope = angular.IScope;
/**
 * Annotates a controller expression (may be a controller function(), a "controllername",
 * or "controllername as name")
 *
 * - Temporarily decorates $injector.instantiate.
 * - Invokes $controller() service
 *   - Calls $injector.instantiate with controller constructor
 * - Annotate constructor
 * - Undecorate $injector
 *
 * returns an array of strings, which are the arguments of the controller expression
 */
export declare function annotateController(controllerExpression: (IInjectable | string)): string[];
declare module "../router" {
    interface UIRouter {
        /** @hidden TODO: move this to ng1.ts */
        stateProvider: StateProvider;
    }
}
export declare function watchDigests($rootScope: IScope): void;
export declare const getLocals: (ctx: ResolveContext) => TypedMap<any>;
