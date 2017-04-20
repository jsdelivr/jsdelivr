/** @module core */ /** */
import { UrlMatcherFactory } from "./url/urlMatcherFactory";
import { UrlRouterProvider } from "./url/urlRouter";
import { UrlRouter } from "./url/urlRouter";
import { TransitionService } from "./transition/transitionService";
import { ViewService } from "./view/view";
import { StateRegistry } from "./state/stateRegistry";
import { StateService } from "./state/stateService";
import { UIRouterGlobals } from "./globals";
/**
 * The master class used to instantiate an instance of UI-Router.
 *
 * This class instantiates and wires the global UI-Router services.
 *
 * After instantiating a new instance of the Router class, configure it for your app.  For instance, register
 * your app states with the [[stateRegistry]] (and set url options using ...).  Then, tell UI-Router to monitor
 * the URL by calling `urlRouter.listen()` ([[URLRouter.listen]])
 */
export declare class UIRouter {
    viewService: ViewService;
    transitionService: TransitionService;
    globals: UIRouterGlobals;
    urlMatcherFactory: UrlMatcherFactory;
    urlRouterProvider: UrlRouterProvider;
    urlRouter: UrlRouter;
    stateRegistry: StateRegistry;
    stateService: StateService;
    constructor();
}
