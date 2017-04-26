import { Ng1ViewDeclaration } from "./interface";
import { IInjectable } from "../common/common";
import { ResolveContext } from "../resolve/resolveContext";
import { RawParams } from "../params/interface";
/**
 * Service which manages loading of templates from a ViewConfig.
 */
export declare class TemplateFactory {
    /**
     * Creates a template from a configuration object.
     *
     * @param config Configuration object for which to load a template.
     * The following properties are search in the specified order, and the first one
     * that is defined is used to create the template:
     *
     * @param params  Parameters to pass to the template function.
     * @param context The resolve context associated with the template's view
     *
     * @return {string|object}  The template html as a string, or a promise for
     * that string,or `null` if no template is configured.
     */
    fromConfig(config: Ng1ViewDeclaration, params: any, context: ResolveContext): any;
    /**
     * Creates a template from a string or a function returning a string.
     *
     * @param template html template as a string or function that returns an html template as a string.
     * @param params Parameters to pass to the template function.
     *
     * @return {string|object} The template html as a string, or a promise for that
     * string.
     */
    fromString(template: (string | Function), params?: RawParams): any;
    /**
     * Loads a template from the a URL via `$http` and `$templateCache`.
     *
     * @param {string|Function} url url of the template to load, or a function
     * that returns a url.
     * @param {Object} params Parameters to pass to the url function.
     * @return {string|Promise.<string>} The template html as a string, or a promise
     * for that string.
     */
    fromUrl(url: (string | Function), params: any): Promise<string>;
    /**
     * Creates a template by invoking an injectable provider function.
     *
     * @param provider Function to invoke via `locals`
     * @param {Function} injectFn a function used to invoke the template provider
     * @return {string|Promise.<string>} The template html as a string, or a promise
     * for that string.
     */
    fromProvider(provider: IInjectable, params: any, context: ResolveContext): Promise<any>;
}
