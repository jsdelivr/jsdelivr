import { RawParams, ParamDeclaration } from "../params/interface";
import { ParamType } from "./type";
import { ParamTypes } from "./paramTypes";
export declare enum DefType {
    PATH = 0,
    SEARCH = 1,
    CONFIG = 2,
}
export declare class Param {
    id: string;
    type: ParamType;
    location: DefType;
    array: boolean;
    squash: (boolean | string);
    replace: any;
    isOptional: boolean;
    dynamic: boolean;
    config: any;
    constructor(id: string, type: ParamType, config: ParamDeclaration, location: DefType, paramTypes: ParamTypes);
    isDefaultValue(value: any): boolean;
    /**
     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
     * default value, which may be the result of an injectable function.
     */
    value(value?: any): any;
    isSearch(): boolean;
    validates(value: any): boolean;
    toString(): string;
    /** Creates a new [[Param]] from a CONFIG block */
    static fromConfig(id: string, type: ParamType, config: any, paramTypes: ParamTypes): Param;
    /** Creates a new [[Param]] from a url PATH */
    static fromPath(id: string, type: ParamType, config: any, paramTypes: ParamTypes): Param;
    /** Creates a new [[Param]] from a url SEARCH */
    static fromSearch(id: string, type: ParamType, config: any, paramTypes: ParamTypes): Param;
    static values(params: Param[], values?: RawParams): RawParams;
    /**
     * Finds [[Param]] objects which have different param values
     *
     * Filters a list of [[Param]] objects to only those whose parameter values differ in two param value objects
     *
     * @param params: The list of Param objects to filter
     * @param values1: The first set of parameter values
     * @param values2: the second set of parameter values
     *
     * @returns any Param objects whose values were different between values1 and values2
     */
    static changed(params: Param[], values1?: RawParams, values2?: RawParams): Param[];
    /**
     * Checks if two param value objects are equal (for a set of [[Param]] objects)
     *
     * @param params The list of [[Param]] objects to check
     * @param values1 The first set of param values
     * @param values2 The second set of param values
     *
     * @returns true if the param values in values1 and values2 are equal
     */
    static equals(params: Param[], values1?: {}, values2?: {}): boolean;
    /** Returns true if a the parameter values are valid, according to the Param definitions */
    static validates(params: Param[], values?: RawParams): boolean;
}
