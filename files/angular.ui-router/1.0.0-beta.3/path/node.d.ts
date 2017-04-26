import { State } from "../state/stateObject";
import { RawParams } from "../params/interface";
import { Param } from "../params/param";
import { Resolvable } from "../resolve/resolvable";
import { ViewConfig } from "../view/interface";
/**
 * A node in a [[TreeChanges]] path
 *
 * For a [[TreeChanges]] path, this class holds the stateful information for a single node in the path.
 * Each PathNode corresponds to a state being entered, exited, or retained.
 * The stateful information includes parameter values and resolve data.
 */
export declare class PathNode {
    /** The state being entered, exited, or retained */
    state: State;
    /** The parameters declared on the state */
    paramSchema: Param[];
    /** The parameter values that belong to the state */
    paramValues: {
        [key: string]: any;
    };
    /** The individual (stateful) resolvable objects that belong to the state */
    resolvables: Resolvable[];
    /** The state's declared view configuration objects */
    views: ViewConfig[];
    /** Creates a copy of a PathNode */
    constructor(state: PathNode);
    /** Creates a new (empty) PathNode for a State */
    constructor(state: State);
    /** Sets [[paramValues]] for the node, from the values of an object hash */
    applyRawParams(params: RawParams): PathNode;
    /** Gets a specific [[Param]] metadata that belongs to the node */
    parameter(name: string): Param;
    /**
     * @returns true if the state and parameter values for another PathNode are
     * equal to the state and param values for this PathNode
     */
    equals(node: PathNode, keys?: string[]): boolean;
    /** Returns a clone of the PathNode */
    static clone(node: PathNode): PathNode;
    /**
     * Returns a new path which is a subpath of the first path which matched the second path.
     *
     * The new path starts from root and contains any nodes that match the nodes in the second path.
     * Nodes are compared using their state property and parameter values.
     *
     * @param pathA the first path
     * @param pathB the second path
     * @param ignoreDynamicParams don't compare dynamic parameter values
     */
    static matching(pathA: PathNode[], pathB: PathNode[], ignoreDynamicParams?: boolean): PathNode[];
}
