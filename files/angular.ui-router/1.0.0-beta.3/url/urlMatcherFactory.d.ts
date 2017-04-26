import { UrlMatcher } from "./urlMatcher";
import { ParamTypes } from "../params/paramTypes";
import { ParamTypeDefinition } from "../params/interface";
/**
 * Factory for [[UrlMatcher]] instances.
 *
 * The factory is available to ng1 services as
 * `$urlMatcherFactor` or ng1 providers as `$urlMatcherFactoryProvider`.
 */
export declare class UrlMatcherFactory {
    paramTypes: ParamTypes;
    constructor();
    /**
     * Defines whether URL matching should be case sensitive (the default behavior), or not.
     *
     * @param value `false` to match URL in a case sensitive manner; otherwise `true`;
     * @returns the current value of caseInsensitive
     */
    caseInsensitive(value: boolean): boolean;
    /**
     * Defines whether URLs should match trailing slashes, or not (the default behavior).
     *
     * @param value `false` to match trailing slashes in URLs, otherwise `true`.
     * @returns the current value of strictMode
     */
    strictMode(value: boolean): boolean;
    /**
     * Sets the default behavior when generating or matching URLs with default parameter values.
     *
     * @param value A string that defines the default parameter URL squashing behavior.
     *    - `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
     *    - `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
     *             parameter is surrounded by slashes, squash (remove) one slash from the URL
     *    - any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
     *             the parameter value from the URL and replace it with this string.
     * @returns the current value of defaultSquashPolicy
     */
    defaultSquashPolicy(value: string): string | boolean;
    /**
     * Creates a [[UrlMatcher]] for the specified pattern.
     *
     * @param pattern  The URL pattern.
     * @param config  The config object hash.
     * @returns The UrlMatcher.
     */
    compile(pattern: string, config?: {
        [key: string]: any;
    }): UrlMatcher;
    /**
     * Returns true if the specified object is a [[UrlMatcher]], or false otherwise.
     *
     * @param object  The object to perform the type check against.
     * @returns `true` if the object matches the `UrlMatcher` interface, by
     *          implementing all the same methods.
     */
    isMatcher(object: any): boolean;
    /**
     * Creates and registers a custom [[ParamType]] object
     *
     * A [[ParamType]] can be used to generate URLs with typed parameters.
     *
     * @param name  The type name.
     * @param definition The type definition. See [[ParamTypeDefinition]] for information on the values accepted.
     * @param definitionFn A function that is injected before the app runtime starts.
     *        The result of this function should be a [[ParamTypeDefinition]].
     *        The result is merged into the existing `definition`.
     *        See [[ParamType]] for information on the values accepted.
     *
     * @returns - if a type was registered: the [[UrlMatcherFactory]]
     *   - if only the `name` parameter was specified: the currently registered [[ParamType]] object, or undefined
     *
     * Note: Register custom types *before using them* in a state definition.
     *
     * See [[ParamTypeDefinition]] for examples
     */
    type(name: string, definition?: ParamTypeDefinition, definitionFn?: () => ParamTypeDefinition): any;
    /** @hidden */
    $get(): this;
}
