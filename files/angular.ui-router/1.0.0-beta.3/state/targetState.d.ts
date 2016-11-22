/** @module state */ /** for typedoc */
import { StateDeclaration, StateOrName } from "./interface";
import { ParamsOrArray } from "../params/interface";
import { TransitionOptions } from "../transition/interface";
import { State } from "./stateObject";
/**
 * @ngdoc object
 * @name ui.router.state.type:TargetState
 *
 * @description
 * Encapsulate the desired target of a transition.
 * Wraps an identifier for a state, a set of parameters, and transition options with the definition of the state.
 *
 * @param {StateOrName} _identifier  An identifier for a state. Either a fully-qualified path, or the object
 *            used to define the state.
 * @param {IState} _definition The `State` object definition.
 * @param {ParamsOrArray} _params Parameters for the target state
 * @param {TransitionOptions} _options Transition options.
 */
export declare class TargetState {
    private _identifier;
    private _definition;
    private _options;
    private _params;
    constructor(_identifier: StateOrName, _definition?: State, _params?: ParamsOrArray, _options?: TransitionOptions);
    name(): string | State | StateDeclaration;
    identifier(): StateOrName;
    params(): ParamsOrArray;
    $state(): State;
    state(): StateDeclaration;
    options(): TransitionOptions;
    exists(): boolean;
    valid(): boolean;
    error(): string;
    toString(): string;
}
