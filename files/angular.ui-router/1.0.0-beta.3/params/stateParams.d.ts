/** @module params */ /** for typedoc */
import { Obj } from "../common/common";
import { State } from "../state/stateObject";
export declare class StateParams {
    [key: string]: any;
    constructor(params?: Obj);
    /**
     * Merges a set of parameters with all parameters inherited between the common parents of the
     * current state and a given destination state.
     *
     * @param {Object} newParams The set of parameters which will be composited with inherited params.
     * @param {Object} $current Internal definition of object representing the current state.
     * @param {Object} $to Internal definition of object representing state to transition to.
     */
    $inherit(newParams: Obj, $current: State, $to: State): any;
}
