/** @module url */ /** for typedoc */
import { IInjectable } from "../common/common";
import { UrlMatcher } from "./urlMatcher";
import { $InjectorLike, LocationServices } from "../common/coreservices";
import { UrlMatcherFactory } from "./urlMatcherFactory";
import { StateParams } from "../params/stateParams";
/**
 * Manages rules for client-side URL
 *
 * This class manages the router rules for what to do when the URL changes.
 */
export declare class UrlRouterProvider {
    /** @hidden */
    rules: Function[];
    /** @hidden */
    otherwiseFn: ($injector: $InjectorLike, $location: LocationServices) => string;
    /** @hidden */
    interceptDeferred: boolean;
    /** @hidden */
    private $urlMatcherFactory;
    /** @hidden */
    private $stateParams;
    constructor($urlMatcherFactory: UrlMatcherFactory, $stateParams: StateParams);
    /**
     * Registers a url handler function.
     *
     * Registers a low level url handler (a `rule`). A rule detects specific URL patterns and returns
     * a redirect, or performs some action.
     *
     * If a rule returns a string, the URL is replaced with the string, and all rules are fired again.
     *
     * @example
     * ```js
     *
     * var app = angular.module('app', ['ui.router.router']);
     *
     * app.config(function ($urlRouterProvider) {
     *   // Here's an example of how you might allow case insensitive urls
     *   $urlRouterProvider.rule(function ($injector, $location) {
     *     var path = $location.path(),
     *         normalized = path.toLowerCase();
     *
     *     if (path !== normalized) {
     *       return normalized;
     *     }
     *   });
     * });
     * ```
     *
     * @param rule
     * Handler function that takes `$injector` and `$location` services as arguments.
     * You can use them to detect a url and return a different url as a string.
     *
     * @return [[$urlRouterProvider]] (`this`)
     */
    rule(rule: ($injector: $InjectorLike, $location: LocationServices) => string): UrlRouterProvider;
    /**
     * Remove a rule previously registered
     *
     * @param rule the matcher rule that was previously registered using [[rule]]
     * @return true if the rule was found (and removed)
     */
    removeRule(rule: any): boolean;
    /**
     * Defines the path or behavior to use when no url can be matched.
     *
     * @example
     * ```js
     *
     * var app = angular.module('app', ['ui.router.router']);
     *
     * app.config(function ($urlRouterProvider) {
     *   // if the path doesn't match any of the urls you configured
     *   // otherwise will take care of routing the user to the
     *   // specified url
     *   $urlRouterProvider.otherwise('/index');
     *
     *   // Example of using function rule as param
     *   $urlRouterProvider.otherwise(function ($injector, $location) {
     *     return '/a/valid/url';
     *   });
     * });
     * ```
     *
     * @param rule
     * The url path you want to redirect to or a function rule that returns the url path or performs a `$state.go()`.
     * The function version is passed two params: `$injector` and `$location` services, and should return a url string.
     *
     * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
     */
    otherwise(rule: string | (($injector: $InjectorLike, $location: LocationServices) => string)): UrlRouterProvider;
    /**
     * Registers a handler for a given url matching.
     *
     * If the handler is a string, it is
     * treated as a redirect, and is interpolated according to the syntax of match
     * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
     *
     * If the handler is a function, it is injectable.
     * It gets invoked if `$location` matches.
     * You have the option of inject the match object as `$match`.
     *
     * The handler can return
     *
     * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
     *   will continue trying to find another one that matches.
     * - **string** which is treated as a redirect and passed to `$location.url()`
     * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
     *
     * @example
     * ```js
     *
     * var app = angular.module('app', ['ui.router.router']);
     *
     * app.config(function ($urlRouterProvider) {
     *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
     *     if ($state.$current.navigable !== state ||
     *         !equalForKeys($match, $stateParams) {
     *      $state.transitionTo(state, $match, false);
     *     }
     *   });
     * });
     * ```
     *
     * @param what A pattern string to match, compiled as a [[UrlMatcher]].
     * @param handler The path (or function that returns a path) that you want to redirect your user to.
     * @param ruleCallback [optional] A callback that receives the `rule` registered with [[UrlMatcher.rule]]
     *
     * Note: the handler may also invoke arbitrary code, such as `$state.go()`
     */
    when(what: (RegExp | UrlMatcher | string), handler: string | IInjectable, ruleCallback?: (rule: any) => void): UrlRouterProvider;
    /**
     * Disables monitoring of the URL.
     *
     * Call this method before UI-Router has bootstrapped.
     * It will stop UI-Router from performing the initial url sync.
     *
     * This can be useful to perform some asynchronous initialization before the router starts.
     * Once the initialization is complete, call [[listen]] to tell UI-Router to start watching and synchronizing the URL.
     *
     * @example
     * ```js
     *
     * var app = angular.module('app', ['ui.router']);
     *
     * app.config(function ($urlRouterProvider) {
     *   // Prevent $urlRouter from automatically intercepting URL changes;
     *   $urlRouterProvider.deferIntercept();
     * })
     *
     * app.run(function (MyService, $urlRouter, $http) {
     *   $http.get("/stuff").then(function(resp) {
     *     MyService.doStuff(resp.data);
     *     $urlRouter.listen();
     *     $urlRouter.sync();
     *   });
     * });
     * ```
     *
     * @param defer Indicates whether to defer location change interception. Passing
     *        no parameter is equivalent to `true`.
     */
    deferIntercept(defer: any): void;
}
export declare class UrlRouter {
    /** @hidden */
    private location;
    /** @hidden */
    private listener;
    /** @hidden */
    private urlRouterProvider;
    /** @hidden */
    constructor(urlRouterProvider: UrlRouterProvider);
    /**
     * Checks the current URL for a matching rule
     *
     * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
     * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
     * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
     * with the transition by calling `$urlRouter.sync()`.
     *
     * @example
     * ```js
     *
     * angular.module('app', ['ui.router'])
     *   .run(function($rootScope, $urlRouter) {
     *     $rootScope.$on('$locationChangeSuccess', function(evt) {
     *       // Halt state change from even starting
     *       evt.preventDefault();
     *       // Perform custom logic
     *       var meetsRequirement = ...
     *       // Continue with the update and state transition if logic allows
     *       if (meetsRequirement) $urlRouter.sync();
     *     });
     * });
     * ```
     */
    sync(): void;
    /**
     * Starts listening for URL changes
     *
     * Call this sometime after calling [[deferIntercept]] to start monitoring the url.
     * This causes [[UrlRouter]] to start listening for changes to the URL, if it wasn't already listening.
     */
    listen(): Function;
    /**
     * Internal API.
     */
    update(read?: boolean): void;
    /**
     * Internal API.
     *
     * Pushes a new location to the browser history.
     *
     * @param urlMatcher
     * @param params
     * @param options
     */
    push(urlMatcher: UrlMatcher, params: StateParams, options: {
        replace?: (string | boolean);
    }): void;
    /**
     * Builds and returns a URL with interpolated parameters
     *
     * @example
     * ```js
     *
     * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
     *   person: "bob"
     * });
     * // $bob == "/about/bob";
     * ```
     *
     * @param urlMatcher The [[UrlMatcher]] object which is used as the template of the URL to generate.
     * @param params An object of parameter values to fill the matcher's required parameters.
     * @param options Options object. The options are:
     *
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     *
     * @returns Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
     */
    href(urlMatcher: UrlMatcher, params: any, options: {
        absolute: boolean;
    }): string;
}
