import { StateDeclaration } from "./interface";
import { State } from "./stateObject";
import { StateBuilder } from "./stateBuilder";
import { StateService } from "./stateService";
import { UrlRouterProvider } from "../url/urlRouter";
import { StateRegistryListener } from "./stateRegistry";
export declare class StateQueueManager {
    states: {
        [key: string]: State;
    };
    builder: StateBuilder;
    $urlRouterProvider: UrlRouterProvider;
    listeners: StateRegistryListener[];
    queue: State[];
    private $state;
    constructor(states: {
        [key: string]: State;
    }, builder: StateBuilder, $urlRouterProvider: UrlRouterProvider, listeners: StateRegistryListener[]);
    register(config: StateDeclaration): any;
    flush($state: StateService): {
        [key: string]: State;
    };
    autoFlush($state: StateService): void;
    attachRoute($state: StateService, state: State): void;
}
