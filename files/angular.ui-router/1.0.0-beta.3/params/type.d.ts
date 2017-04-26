import { ParamTypeDefinition } from "./interface";
/**
 * A class that implements Custom Parameter Type functionality.
 *
 * This class has naive implementations for all the [[ParamTypeDefinition]] methods.
 *
 * An instance of this class is created when a custom [[ParamTypeDefinition]] object is registered with the [[UrlMatcherFactory.type]].
 *
 * Used by [[UrlMatcher]] when matching or formatting URLs, or comparing and validating parameter values.
 *
 * @example
 * ```
 *
 * {
 *   decode: function(val) { return parseInt(val, 10); },
 *   encode: function(val) { return val && val.toString(); },
 *   equals: function(a, b) { return this.is(a) && a === b; },
 *   is: function(val) { return angular.isNumber(val) && isFinite(val) && val % 1 === 0; },
 *   pattern: /\d+/
 * }
 * ```
 */
export declare class ParamType implements ParamTypeDefinition {
    pattern: RegExp;
    name: string;
    raw: boolean;
    dynamic: boolean;
    /**
     * @param def  A configuration object which contains the custom type definition.  The object's
     *        properties will override the default methods and/or pattern in `ParamType`'s public interface.
     * @returns a new ParamType object
     */
    constructor(def: ParamTypeDefinition);
    /** @inheritdoc */
    is(val: any, key?: string): boolean;
    /** @inheritdoc */
    encode(val: any, key?: string): (string | string[]);
    /** @inheritdoc */
    decode(val: string, key?: string): any;
    /** @inheritdoc */
    equals(a: any, b: any): boolean;
    $subPattern(): string;
    toString(): string;
    /** Given an encoded string, or a decoded object, returns a decoded object */
    $normalize(val: any): any;
    /**
     * Wraps an existing custom ParamType as an array of ParamType, depending on 'mode'.
     * e.g.:
     * - urlmatcher pattern "/path?{queryParam[]:int}"
     * - url: "/path?queryParam=1&queryParam=2
     * - $stateParams.queryParam will be [1, 2]
     * if `mode` is "auto", then
     * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
     * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
     */
    $asArray(mode: (boolean | "auto"), isSearch: boolean): any;
}
