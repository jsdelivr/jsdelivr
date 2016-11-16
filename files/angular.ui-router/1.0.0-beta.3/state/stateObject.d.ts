/** @module state */ /** for typedoc */
import { StateDeclaration, _ViewDeclaration } from "./interface";
import { Param } from "../params/param";
import { UrlMatcher } from "../url/urlMatcher";
import { Resolvable } from "../resolve/resolvable";
import { TransitionStateHookFn } from "../transition/interface";
import { TargetState } from "./targetState";
import { Transition } from "../transition/transition";
/**
 * @ngdoc object
 * @name ui.router.state.type:State
 *
 * @description
 * Definition object for states. Includes methods for manipulating the state heirarchy.
 *
 * @param {Object} config  A configuration object hash that includes the results of user-supplied
 *        values, as well as values from `StateBuilder`.
 *
 * @returns {Object}  Returns a new `State` object.
 */
export declare class State {
    parent: State;
    name: string;
    abstract: boolean;
    resolve: ({
        [key: string]: (string | any[] | Function);
    } | any[]);
    resolvables: Resolvable[];
    resolvePolicy: any;
    url: UrlMatcher;
    /** @hidden temporary place to put the rule registered with $urlRouter.when() */
    _urlRule: any;
    params: {
        [key: string]: Param;
    };
    views: {
        [key: string]: _ViewDeclaration;
    };
    self: StateDeclaration;
    navigable: State;
    path: State[];
    data: any;
    includes: {
        [name: string]: boolean;
    };
    onExit: TransitionStateHookFn;
    onRetain: TransitionStateHookFn;
    onEnter: TransitionStateHookFn;
    lazyLoad: (transition: Transition) => Promise<StateDeclaration[]>;
    redirectTo: (string | (($transition$: Transition) => TargetState) | {
        state: (string | StateDeclaration);
        params: {
            [key: string]: any;
        };
    });
    constructor(config?: StateDeclaration);
    /**
     * @ngdoc function
     * @name ui.router.state.type:State#is
     * @methodOf ui.router.state.type:State
     *
     * @description
     * Compares the identity of the state against the passed value, which is either an object
     * reference to the actual `State` instance, the original definition object passed to
     * `$stateProvider.state()`, or the fully-qualified name.
     *
     * @param {Object} ref Can be one of (a) a `State` instance, (b) an object that was passed
     *        into `$stateProvider.state()`, (c) the fully-qualified name of a state as a string.
     * @returns {boolean} Returns `true` if `ref` matches the current `State` instance.
     */
    is(ref: State | StateDeclaration | string): boolean;
    /**
     * @ngdoc function
     * @name ui.router.state.type:State#fqn
     * @methodOf ui.router.state.type:State
     *
     * @description
     * Returns the fully-qualified name of the state, based on its current position in the tree.
     *
     * @returns {string} Returns a dot-separated name of the state.
     */
    fqn(): string;
    /**
     * @ngdoc function
     * @name ui.router.state.type:State#root
     * @methodOf ui.router.state.type:State
     *
     * @description
     * Returns the root node of this state's tree.
     *
     * @returns {State} The root of this state's tree.
     */
    root(): State;
    parameters(opts?: {
        inherit: boolean;
    }): Param[];
    parameter(id: string, opts?: any): Param;
    toString(): string;
}
