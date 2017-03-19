import { IInjectable } from "./common";
/**
 * Returns a string shortened to a maximum length
 *
 * If the string is already less than the `max` length, return the string.
 * Else return the string, shortened to `max - 3` and append three dots ("...").
 *
 * @param max the maximum length of the string to return
 * @param str the input string
 */
export declare function maxLength(max: number, str: string): string;
/**
 * Returns a string, with spaces added to the end, up to a desired str length
 *
 * If the string is already longer than the desired length, return the string.
 * Else returns the string, with extra spaces on the end, such that it reaches `length` characters.
 *
 * @param length the desired length of the string to return
 * @param str the input string
 */
export declare function padString(length: number, str: string): string;
export declare function kebobString(camelCase: string): string;
export declare function functionToString(fn: Function): any;
export declare function fnToString(fn: IInjectable): any;
export declare function stringify(o: any): string;
/** Returns a function that splits a string on a character or substring */
export declare const beforeAfterSubstr: (char: string) => (str: string) => string[];
