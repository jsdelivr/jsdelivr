import { HookRegOptions, HookMatchCriteria, IEventHook, IHookRegistry, IHookRegistration, TreeChanges, HookMatchCriterion, IMatchingNodes, HookFn } from "./interface";
import { State } from "../state/stateObject";
/**
 * Determines if the given state matches the matchCriteria
 *
 * @hidden
 *
 * @param state a State Object to test against
 * @param criterion
 * - If a string, matchState uses the string as a glob-matcher against the state name
 * - If an array (of strings), matchState uses each string in the array as a glob-matchers against the state name
 *   and returns a positive match if any of the globs match.
 * - If a function, matchState calls the function with the state and returns true if the function's result is truthy.
 * @returns {boolean}
 */
export declare function matchState(state: State, criterion: HookMatchCriterion): boolean;
/** @hidden */
export declare class EventHook implements IEventHook {
    callback: HookFn;
    matchCriteria: HookMatchCriteria;
    priority: number;
    bind: any;
    _deregistered: boolean;
    constructor(matchCriteria: HookMatchCriteria, callback: HookFn, options?: HookRegOptions);
    private static _matchingNodes(nodes, criterion);
    /**
     * Determines if this hook's [[matchCriteria]] match the given [[TreeChanges]]
     *
     * @returns an IMatchingNodes object, or null. If an IMatchingNodes object is returned, its values
     * are the matching [[PathNode]]s for each [[HookMatchCriterion]] (to, from, exiting, retained, entering)
     */
    matches(treeChanges: TreeChanges): IMatchingNodes;
}
/**
 * Mixin class acts as a Transition Hook registry.
 *
 * Holds the registered [[HookFn]] objects.
 * Exposes functions to register new hooks.
 *
 * This is a Mixin class which can be applied to other objects.
 *
 * The hook registration functions are [[onBefore]], [[onStart]], [[onEnter]], [[onRetain]], [[onExit]], [[onFinish]], [[onSuccess]], [[onError]].
 *
 * This class is mixed into both the [[TransitionService]] and every [[Transition]] object.
 * Global hooks are added to the [[TransitionService]].
 * Since each [[Transition]] is itself a `HookRegistry`, hooks can also be added to individual Transitions
 * (note: the hook criteria still must match the Transition).
 */
export declare class HookRegistry implements IHookRegistry {
    static mixin(source: HookRegistry, target: IHookRegistry): void;
    private _transitionEvents;
    getHooks: (name: string) => IEventHook[];
    /** @inheritdoc */
    onBefore: IHookRegistration;
    /** @inheritdoc */
    onStart: IHookRegistration;
    /** @inheritdoc */
    onEnter: IHookRegistration;
    /** @inheritdoc */
    onRetain: IHookRegistration;
    /** @inheritdoc */
    onExit: IHookRegistration;
    /** @inheritdoc */
    onFinish: IHookRegistration;
    /** @inheritdoc */
    onSuccess: IHookRegistration;
    /** @inheritdoc */
    onError: IHookRegistration;
}
