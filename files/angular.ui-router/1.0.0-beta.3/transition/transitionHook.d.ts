/** @module transition */ /** for typedoc */
import { TransitionHookOptions, IEventHook, HookResult } from "./interface";
import { Transition } from "./transition";
import { State } from "../state/stateObject";
/** @hidden */
export declare class TransitionHook {
    private transition;
    private stateContext;
    private eventHook;
    private options;
    constructor(transition: Transition, stateContext: State, eventHook: IEventHook, options: TransitionHookOptions);
    private isSuperseded;
    invokeHook(): Promise<HookResult>;
    /**
     * This method handles the return value of a Transition Hook.
     *
     * A hook can return false (cancel), a TargetState (redirect),
     * or a promise (which may later resolve to false or a redirect)
     *
     * This also handles "transition superseded" -- when a new transition
     * was started while the hook was still running
     */
    handleHookResult(result: HookResult): Promise<any>;
    toString(): string;
    /**
     * Given an array of TransitionHooks, runs each one synchronously and sequentially.
     *
     * Returns a promise chain composed of any promises returned from each hook.invokeStep() call
     */
    static runSynchronousHooks(hooks: TransitionHook[], swallowExceptions?: boolean): Promise<any>;
}
