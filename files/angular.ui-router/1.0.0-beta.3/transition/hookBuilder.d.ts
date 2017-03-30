import { TransitionOptions, TransitionHookOptions, TreeChanges } from "./interface";
import { Transition } from "./transition";
import { TransitionHook } from "./transitionHook";
import { State } from "../state/stateObject";
import { TransitionService } from "./transitionService";
/**
 * This class returns applicable TransitionHooks for a specific Transition instance.
 *
 * Hooks (IEventHook) may be registered globally, e.g., $transitions.onEnter(...), or locally, e.g.
 * myTransition.onEnter(...).  The HookBuilder finds matching IEventHooks (where the match criteria is
 * determined by the type of hook)
 *
 * The HookBuilder also converts IEventHooks objects to TransitionHook objects, which are used to run a Transition.
 *
 * The HookBuilder constructor is given the $transitions service and a Transition instance.  Thus, a HookBuilder
 * instance may only be used for one specific Transition object. (side note: the _treeChanges accessor is private
 * in the Transition class, so we must also provide the Transition's _treeChanges)
 *
 */
export declare class HookBuilder {
    private $transitions;
    private transition;
    private baseHookOptions;
    treeChanges: TreeChanges;
    transitionOptions: TransitionOptions;
    toState: State;
    fromState: State;
    constructor($transitions: TransitionService, transition: Transition, baseHookOptions: TransitionHookOptions);
    getOnBeforeHooks: () => TransitionHook[];
    getOnStartHooks: () => TransitionHook[];
    getOnExitHooks: () => TransitionHook[];
    getOnRetainHooks: () => TransitionHook[];
    getOnEnterHooks: () => TransitionHook[];
    getOnFinishHooks: () => TransitionHook[];
    getOnSuccessHooks: () => TransitionHook[];
    getOnErrorHooks: () => TransitionHook[];
    asyncHooks(): any[];
    /**
     * Returns an array of newly built TransitionHook objects.
     *
     * - Finds all IEventHooks registered for the given `hookType` which matched the transition's [[TreeChanges]].
     * - Finds [[PathNode]] (or `PathNode[]`) to use as the TransitionHook context(s)
     * - For each of the [[PathNode]]s, creates a TransitionHook
     *
     * @param hookType the name of the hook registration function, e.g., 'onEnter', 'onFinish'.
     * @param matchingNodesProp selects which [[PathNode]]s from the [[IMatchingNodes]] object to create hooks for.
     * @param getLocals a function which accepts a [[PathNode]] and returns additional locals to provide to the hook as injectables
     * @param sortHooksFn a function which compares two HookTuple and returns <1, 0, or >1
     * @param options any specific Transition Hook Options
     */
    private _buildNodeHooks(hookType, matchingNodesProp, sortHooksFn, options?);
    /**
     * Finds all IEventHooks from:
     * - The Transition object instance hook registry
     * - The TransitionService ($transitions) global hook registry
     *
     * which matched:
     * - the eventType
     * - the matchCriteria (to, from, exiting, retained, entering)
     *
     * @returns an array of matched [[IEventHook]]s
     */
    private _matchingHooks(hookName, treeChanges);
}
