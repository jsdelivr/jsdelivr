import { StateOrName } from "./interface";
import { State } from "./stateObject";
export declare class StateMatcher {
    private _states;
    constructor(_states: {
        [key: string]: State;
    });
    isRelative(stateName: string): boolean;
    find(stateOrName: StateOrName, base?: StateOrName): State;
    resolvePath(name: string, base: StateOrName): string;
}
