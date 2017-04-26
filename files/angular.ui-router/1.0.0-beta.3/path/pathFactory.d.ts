/** @module path */ /** for typedoc */
import { Predicate } from "../common/common";
import { TreeChanges } from "../transition/interface";
import { State } from "../state/stateObject";
import { TargetState } from "../state/targetState";
import { PathNode } from "../path/node";
import { ViewService } from "../view/view";
/**
 * This class contains functions which convert TargetStates, Nodes and paths from one type to another.
 */
export declare class PathFactory {
    constructor();
    /** Given a PathNode[], create an TargetState */
    static makeTargetState(path: PathNode[]): TargetState;
    static buildPath(targetState: TargetState): PathNode[];
    /** Given a fromPath: PathNode[] and a TargetState, builds a toPath: PathNode[] */
    static buildToPath(fromPath: PathNode[], targetState: TargetState): PathNode[];
    /**
     * Creates ViewConfig objects and adds to nodes.
     *
     * On each [[PathNode]], creates ViewConfig objects from the views: property of the node's state
     */
    static applyViewConfigs($view: ViewService, path: PathNode[], states: State[]): void;
    /**
     * Given a fromPath and a toPath, returns a new to path which inherits parameters from the fromPath
     *
     * For a parameter in a node to be inherited from the from path:
     * - The toPath's node must have a matching node in the fromPath (by state).
     * - The parameter name must not be found in the toKeys parameter array.
     *
     * Note: the keys provided in toKeys are intended to be those param keys explicitly specified by some
     * caller, for instance, $state.transitionTo(..., toParams).  If a key was found in toParams,
     * it is not inherited from the fromPath.
     */
    static inheritParams(fromPath: PathNode[], toPath: PathNode[], toKeys?: string[]): PathNode[];
    /**
     * Computes the tree changes (entering, exiting) between a fromPath and toPath.
     */
    static treeChanges(fromPath: PathNode[], toPath: PathNode[], reloadState: State): TreeChanges;
    /**
     * Return a subpath of a path, which stops at the first matching node
     *
     * Given an array of nodes, returns a subset of the array starting from the first node,
     * stopping when the first node matches the predicate.
     *
     * @param path a path of [[PathNode]]s
     * @param predicate a [[Predicate]] fn that matches [[PathNode]]s
     * @returns a subpath up to the matching node, or undefined if no match is found
     */
    static subPath(path: PathNode[], predicate: Predicate<PathNode>): PathNode[];
    /** Gets the raw parameter values from a path */
    static paramValues: (path: PathNode[]) => {};
}
