/** @module ng1 */ /** */
import { State } from "../../state/stateObject";
import { ViewConfig } from "../../view/interface";
import { Ng1ViewDeclaration } from "../interface";
import { ViewConfigFactory } from "../../view/view";
import { PathNode } from "../../path/node";
import { TemplateFactory } from "../templateFactory";
import { ResolveContext } from "../../resolve/resolveContext";
import { RawParams } from "../../params/interface";
export declare const ng1ViewConfigFactory: ViewConfigFactory;
/**
 * This is a [[StateBuilder.builder]] function for angular1 `views`.
 *
 * When the [[StateBuilder]] builds a [[State]] object from a raw [[StateDeclaration]], this builder
 * handles the `views` property with logic specific to angular-ui-router (ng1).
 *
 * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object
 * and applies the state-level configuration to a view named `$default`.
 */
export declare function ng1ViewsBuilder(state: State): {
    [key: string]: Ng1ViewDeclaration;
};
export declare class Ng1ViewConfig implements ViewConfig {
    path: PathNode[];
    viewDecl: Ng1ViewDeclaration;
    $id: number;
    loaded: boolean;
    controller: Function;
    template: string;
    locals: any;
    constructor(path: PathNode[], viewDecl: Ng1ViewDeclaration);
    load(): Promise<this>;
    /**
     * Checks a view configuration to ensure that it specifies a template.
     *
     * @return {boolean} Returns `true` if the configuration contains a valid template, otherwise `false`.
     */
    hasTemplate(): boolean;
    getTemplate(params: RawParams, $factory: TemplateFactory, context: ResolveContext): any;
    /**
     * Gets the controller for a view configuration.
     *
     * @returns {Function|Promise.<Function>} Returns a controller, or a promise that resolves to a controller.
     */
    getController(context: ResolveContext): (String | Function | Promise<Function | String>);
}
