import { ParamTypeDefinition } from "./interface";
export declare class ParamTypes {
    types: any;
    enqueue: boolean;
    typeQueue: any[];
    private defaultTypes;
    constructor();
    type(name: string, definition?: ParamTypeDefinition, definitionFn?: () => ParamTypeDefinition): any;
    _flushTypeQueue(): void;
}
