/** @module transition */ /** for typedoc */
import { IHookRegistry, TransitionOptions, HookMatchCriteria, HookRegOptions, TransitionStateHookFn, TransitionHookFn } from "./interface";
import { Transition } from "./transition";
import { TargetState } from "../state/targetState";
import { PathNode } from "../path/node";
import { IEventHook } from "./interface";
import { ViewService } from "../view/view";
import { UIRouter } from "../router";
/**
 * The default [[Transition]] options.
 *
 * Include this object when applying custom defaults:
 * let reloadOpts = { reload: true, notify: true }
 * let options = defaults(theirOpts, customDefaults, defaultOptions);
 */
export declare let defaultTransOpts: TransitionOptions;
/**
 * This class provides services related to Transitions.
 *
 * - Most importantly, it allows global Transition Hooks to be registered.
 * - It allows the default transition error handler to be set.
 * - It also has a factory function for creating new [[Transition]] objects, (used internally by the [[StateService]]).
 *
 * At bootstrap, [[UIRouter]] creates a single instance (singleton) of this class.
 */
export declare class TransitionService implements IHookRegistry {
    private _router;
    /** @hidden */
    $view: ViewService;
    /**
     * This object has hook de-registration functions for the built-in hooks.
     * This can be used by third parties libraries that wish to customize the behaviors
     *
     * @hidden
     */
    _deregisterHookFns: {
        redirectTo: Function;
        onExit: Function;
        onRetain: Function;
        onEnter: Function;
        eagerResolve: Function;
        lazyResolve: Function;
        loadViews: Function;
        activateViews: Function;
        updateUrl: Function;
        lazyLoad: Function;
    };
    constructor(_router: UIRouter);
    /** @hidden */
    private registerTransitionHooks();
    /** @inheritdoc */
    onBefore(matchCriteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onStart(matchCriteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onExit(matchCriteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onRetain(matchCriteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onEnter(matchCriteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onFinish(matchCriteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onSuccess(matchCriteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onError(matchCriteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @hidden */
    getHooks: (hookName: string) => IEventHook[];
    /**
     * Creates a new [[Transition]] object
     *
     * This is a factory function for creating new Transition objects.
     * It is used internally by the [[StateService]] and should generally not be called by application code.
     *
     * @param fromPath the path to the current state (the from state)
     * @param targetState the target state (destination)
     * @returns a Transition
     */
    create(fromPath: PathNode[], targetState: TargetState): Transition;
}
