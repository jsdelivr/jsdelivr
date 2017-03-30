export declare class MatcherConfig {
    _isCaseInsensitive: boolean;
    _isStrictMode: boolean;
    _defaultSquashPolicy: (boolean | string);
    caseInsensitive(value?: boolean): boolean;
    strictMode(value?: boolean): boolean;
    defaultSquashPolicy(value?: (boolean | string)): (boolean | string);
}
export declare let matcherConfig: MatcherConfig;
