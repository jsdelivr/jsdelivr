import { ResolvePolicy, ResolvableLiteral } from "./interface";
import { ResolveContext } from "./resolveContext";
import { Transition } from "../transition/transition";
import { State } from "../state/stateObject";
export declare let defaultResolvePolicy: ResolvePolicy;
/**
 * The basic building block for the resolve system.
 *
 * Resolvables encapsulate a state's resolve's resolveFn, the resolveFn's declared dependencies, the wrapped (.promise),
 * and the unwrapped-when-complete (.data) result of the resolveFn.
 *
 * Resolvable.get() either retrieves the Resolvable's existing promise, or else invokes resolve() (which invokes the
 * resolveFn) and returns the resulting promise.
 *
 * Resolvable.get() and Resolvable.resolve() both execute within a context path, which is passed as the first
 * parameter to those fns.
 */
export declare class Resolvable implements ResolvableLiteral {
    token: any;
    policy: ResolvePolicy;
    resolveFn: Function;
    deps: any[];
    data: any;
    resolved: boolean;
    promise: Promise<any>;
    /** This constructor creates a Resolvable copy */
    constructor(resolvable: Resolvable);
    /** This constructor creates a new Resolvable from the plain old [[ResolvableLiteral]] javascript object */
    constructor(resolvable: ResolvableLiteral);
    /**
     * This constructor creates a new `Resolvable`
     *
     * @example
     * ```js
     *
     * var resolvable1 = new Resolvable('mytoken', http => http.get('foo.json').toPromise(), [Http]);
     *
     * var resolvable2 = new Resolvable(UserService, dep => new UserService(dep.data), [SomeDependency]);
     *
     * var resolvable1Clone = new Resolvable(resolvable1);
     * ```
     *
     * @param token The new resolvable's injection token, such as `"userList"` (a string) or `UserService` (a class).
     *              When this token is used during injection, the resolved value will be injected.
     * @param resolveFn The function that returns the resolved value, or a promise for the resolved value
     * @param deps An array of dependencies, which will be injected into the `resolveFn`
     * @param policy the [[ResolvePolicy]] defines when and how the Resolvable is processed
     * @param data Pre-resolved data. If the resolve value is already known, it may be provided here.
     */
    constructor(token: any, resolveFn: Function, deps?: any[], policy?: ResolvePolicy, data?: any);
    getPolicy(state: State): ResolvePolicy;
    /**
     * Asynchronously resolve this Resolvable's data
     *
     * Given a ResolveContext that this Resolvable is found in:
     * Wait for this Resolvable's dependencies, then invoke this Resolvable's function
     * and update the Resolvable's state
     */
    resolve(resolveContext: ResolveContext, trans?: Transition): Promise<any>;
    /**
     * Gets a promise for this Resolvable's data.
     *
     * Fetches the data and returns a promise.
     * Returns the existing promise if it has already been fetched once.
     */
    get(resolveContext: ResolveContext, trans?: Transition): Promise<any>;
    toString(): string;
    clone(): Resolvable;
    static fromData: (token: any, data: any) => Resolvable;
}
