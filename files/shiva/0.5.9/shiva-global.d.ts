/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> {
    /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
    then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<TResult>;
    then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected?: (reason: any) => T | PromiseLike<T>): Promise<T>;
    catch(onrejected?: (reason: any) => void): Promise<T>;

    // [Symbol.toStringTag]: "Promise";
}

interface PromiseConstructor {
    /** 
      * A reference to the prototype. 
      */
    prototype: Promise<any>;

    /**
     * Creates a new Promise.
     * @param executor A callback used to initialize the promise. This callback is passed two arguments: 
     * a resolve callback used resolve the promise with a value or the result of another promise, 
     * and a reject callback used to reject the promise with a provided reason or error.
     */
    new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises 
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>, T10 | PromiseLike<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    all<T1, T2, T3, T4, T5, T6, T7>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    all<T1, T2, T3, T4, T5, T6>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    all<T1, T2, T3, T4, T5>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>, T5 | PromiseLike<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    all<T1, T2, T3, T4>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike <T4>]): Promise<[T1, T2, T3, T4]>;
    all<T1, T2, T3>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]): Promise<[T1, T2, T3]>;
    all<T1, T2>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
    all<TAll>(values: Iterable<TAll | PromiseLike<TAll>>): Promise<TAll[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved 
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject(reason: any): Promise<void>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject<T>(reason: any): Promise<T>;

    /**
      * Creates a new resolved promise for the provided value.
      * @param value A promise.
      * @returns A promise whose internal state matches the provided promise.
      */
    resolve<T>(value: T | PromiseLike<T>): Promise<T>;

    /**
     * Creates a new resolved promise .
     * @returns A resolved promise.
     */
    resolve(): Promise<void>;

    // [Symbol.species]: Function;
}

declare var Promise: PromiseConstructor;

interface Iterable<T> {
    // [Symbol.iterator](): Iterator<T>;
}
/// <reference path="typings/promise.d.ts" />
declare module shiva {
    class Properties {
        static style(object: any, vars: StyleDeclaration): void;
    }
}
declare module shiva {
    class Event {
        private _type;
        private _target;
        private _data;
        private _sourceEvent;
        constructor(type: string, targetObj: any, data?: any, sourceEvent?: any);
        target: Container;
        type: string;
        data: any;
        sourceEvent: any;
    }
    class EventDispatcher {
        private _listeners;
        hasEventListener(type: string, listener: Function): Boolean;
        addEventListener(scope: any, typeStr: string, listenerFunc: Function, data?: any, useCapture?: boolean, scopedEventListener?: Function): void;
        removeEventListener(typeStr: string, listenerFunc: Function): {};
        dispatchEvent(evt: Event): void;
    }
}
declare module shiva {
    class Container extends EventDispatcher {
        static TRANSITION_COMPLETE: string;
        private _element;
        private transitions;
        constructor(config?: ContainerConfig);
        addToBody(): void;
        style(vars: StyleDeclaration): void;
        className(...names: string[]): void;
        addChild(child: Container): void;
        removeChild(child: Container): void;
        to(config: TransitionToConfig): Promise<Container>;
        private convertTransitionStyleToObject(style);
        private convertTransitionObjectToString(transition);
        private removeCompletedTransitionsAndReapply(toVars);
        fromTo(config: TransitionFromToConfig): Promise<Container>;
        private camelToHyphen(camel);
        private hyphenToCamel(hyphen);
        addEventListener(scope: any, typeStr: string, listenerFunc: Function, data?: any, useCapture?: boolean): void;
        removeEventListener(typeStr: string, listenerFunc: Function): {};
        preventDefault(e: any): void;
        width: number;
        height: number;
        y: number;
        x: number;
        alpha: number;
        hide(): void;
        show(): void;
        fillContainer(): void;
        centreHorizontal(): void;
        centreHorizontalText(): void;
        private shadow();
        private dimensionsPolyfill();
        value: string;
        id: string;
        element: HTMLElement;
        innerHtml: string;
        href: string;
    }
}
declare module shiva {
    class Anchor extends Container {
        constructor(config: AnchorConfig);
    }
}
declare module shiva {
    interface AnchorConfig extends ContainerConfig {
        href?: any;
    }
}
declare module shiva {
    class Button extends Container {
        static CLICK: string;
        private enabled;
        private config;
        private icon;
        constructor(config: ButtonConfig);
        update(config: ButtonConfig): void;
        over(): void;
        out(): void;
        click(e: MouseEvent): void;
        disable(): void;
        select(): void;
        enable(): void;
        data: string;
        private overWithEnable(e);
        private outWithEnable(e);
    }
}
declare module shiva {
    interface ButtonConfig extends HoverStyleDeclaration {
        id?: string;
        href?: string;
        target?: string;
        style?: ButtonIconConfig;
        text?: string;
        data?: any;
        icon?: ButtonIconConfig;
        type?: string;
    }
}
declare module shiva {
    interface ButtonIconConfig extends ButtonConfig {
        code?: string;
        align?: string;
    }
}
declare module shiva {
    class CheckBox extends Container {
        static CLICK: string;
        private enabled;
        constructor(config?: InputConfig);
        checked: boolean;
    }
}
declare module shiva {
    interface ContainerConfig extends StyleDeclaration {
        root?: boolean;
        id?: string;
        type?: string;
        style?: StyleDeclaration;
        text?: string;
        data?: any;
    }
}
declare module shiva {
    class Dimensions {
        width: number;
        height: number;
        constructor(width: number, height: number);
    }
}
declare module shiva {
    class Ease {
        static Linear: string;
        static Ease: string;
        static EaseIn: string;
        static EaseOut: string;
        static EaseInOut: string;
    }
}
declare module shiva {
    interface HoverStyleDeclaration extends StyleDeclaration {
        backgroundColorHover?: string;
        colorHover?: string;
        durationIn?: number;
        durationOut?: number;
    }
}
declare module shiva {
    class Image extends Container {
        static COMPLETE: string;
        static ERROR: string;
        constructor(config: ImageConfig);
        load(path: string): void;
    }
}
declare module shiva {
    interface ImageConfig {
        path?: any;
        style?: StyleDeclaration;
    }
}
declare module shiva {
    interface InputConfig {
        id?: string;
        style?: InputConfig;
        checked?: boolean;
    }
}
declare module shiva {
    class Loader extends EventDispatcher {
        static COMPLETE: string;
        static ERROR: string;
        static GET: string;
        static PUT: string;
        static POST: string;
        static UPDATE: string;
        private http;
        private resolve;
        private reject;
        constructor();
        load(url: string, method: string, params?: any, headers?: Array<any>, cache?: boolean): Promise<any>;
        private concatParams(params);
        private setRequestHeader(header);
        private handleResponse();
    }
}
declare module shiva {
    class LoaderEvent extends Event {
        private _response;
        private _status;
        private _httpMetaData;
        constructor(type: string, targetObj: any, response: any, status: any, httpMetaData: any, data?: any, sourceEvent?: any);
        response: Container;
        status: string;
        httpMetaData: any;
    }
}
declare module shiva {
    class Observer {
        private static observers;
        static addEventListener(scope: any, type: string, callback: Function): void;
        static removeEventListener(type: string, callback: Function): void;
        static dispatchEvent(evt: shiva.Event): void;
    }
}
declare module shiva {
    interface Page extends Container {
        wake(): any;
        sleep(): any;
    }
}
declare module shiva {
    class Pages extends Container {
        private currentPage;
        private config;
        private pages;
        private currentPageName;
        private zIndex;
        private delayTimeout;
        constructor(config: PagesConfig);
        update(pageName: string): void;
    }
}
declare module shiva {
    interface PagesConfig {
        id?: string;
        style?: StyleDeclaration;
        delayTransition?: number;
        pages: {};
    }
}
declare module shiva {
    class RadioButton extends Container {
        static CLICK: string;
        private enabled;
        constructor(config?: InputConfig);
        checked: boolean;
    }
}
declare module shiva {
    class Resize {
        static proportionalOutside(objectWidth: number, objectHeight: number, areaWidth: number, areaHeight: number): {
            height: number;
            width: number;
        };
        static proportionalInside(objectWidth: number, objectHeight: number, areaWidth: number, areaHeight: number): Object;
    }
}
declare module shiva {
    class Select extends Container {
        static CHANGE: string;
        constructor(config: SelectConfig);
        value: string;
        selectedIndex: number;
    }
}
declare module shiva {
    interface SelectConfig extends ContainerConfig {
        name?: string;
        options: string[];
    }
}
declare module shiva {
    interface StyleDeclaration {
        alignContent?: string;
        alignItems?: string;
        alignSelf?: string;
        alignmentBaseline?: string;
        animation?: string;
        animationDelay?: string;
        animationDirection?: string;
        animationDuration?: string;
        animationFillMode?: string;
        animationIterationCount?: string;
        animationName?: string;
        animationPlayState?: string;
        animationTimingFunction?: string;
        backfaceVisibility?: string;
        background?: string;
        backgroundAttachment?: string;
        backgroundClip?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundOrigin?: string;
        backgroundPosition?: string;
        backgroundPositionX?: string;
        backgroundPositionY?: string;
        backgroundRepeat?: string;
        backgroundSize?: string;
        baselineShift?: string;
        border?: string;
        borderBottom?: string;
        borderBottomColor?: string;
        borderBottomLeftRadius?: string;
        borderBottomRightRadius?: string;
        borderBottomStyle?: string;
        borderBottomWidth?: string;
        borderCollapse?: string;
        borderColor?: string;
        borderImage?: string;
        borderImageOutset?: string;
        borderImageRepeat?: string;
        borderImageSlice?: string;
        borderImageSource?: string;
        borderImageWidth?: string;
        borderLeft?: string;
        borderLeftColor?: string;
        borderLeftStyle?: string;
        borderLeftWidth?: string;
        borderRadius?: string;
        borderRight?: string;
        borderRightColor?: string;
        borderRightStyle?: string;
        borderRightWidth?: string;
        borderSpacing?: string;
        borderStyle?: string;
        borderTop?: string;
        borderTopColor?: string;
        borderTopLeftRadius?: string;
        borderTopRightRadius?: string;
        borderTopStyle?: string;
        borderTopWidth?: string;
        borderWidth?: string;
        bottom?: string;
        boxShadow?: string;
        boxSizing?: string;
        breakAfter?: string;
        breakBefore?: string;
        breakInside?: string;
        captionSide?: string;
        clear?: string;
        clip?: string;
        clipPath?: string;
        clipRule?: string;
        color?: string;
        colorInterpolationFilters?: string;
        columnCount?: any;
        columnFill?: string;
        columnGap?: any;
        columnRule?: string;
        columnRuleColor?: any;
        columnRuleStyle?: string;
        columnRuleWidth?: any;
        columnSpan?: string;
        columnWidth?: any;
        columns?: string;
        content?: string;
        counterIncrement?: string;
        counterReset?: string;
        cssFloat?: string;
        cssText?: string;
        cursor?: string;
        direction?: string;
        display?: string;
        dominantBaseline?: string;
        emptyCells?: string;
        enableBackground?: string;
        fill?: string;
        fillOpacity?: string;
        fillRule?: string;
        filter?: string;
        flex?: string;
        flexBasis?: string;
        flexDirection?: string;
        flexFlow?: string;
        flexGrow?: string;
        flexShrink?: string;
        flexWrap?: string;
        floodColor?: string;
        floodOpacity?: string;
        font?: string;
        fontFamily?: string;
        fontFeatureSettings?: string;
        fontSize?: string;
        fontSizeAdjust?: string;
        fontStretch?: string;
        fontStyle?: string;
        fontVariant?: string;
        fontWeight?: string;
        glyphOrientationHorizontal?: string;
        glyphOrientationVertical?: string;
        height?: any;
        imeMode?: string;
        justifyContent?: string;
        kerning?: string;
        left?: string;
        length?: number;
        letterSpacing?: string;
        lightingColor?: string;
        lineHeight?: string;
        listStyle?: string;
        listStyleImage?: string;
        listStylePosition?: string;
        listStyleType?: string;
        margin?: any;
        marginBottom?: string;
        marginLeft?: string;
        marginRight?: string;
        marginTop?: string;
        marker?: string;
        markerEnd?: string;
        markerMid?: string;
        markerStart?: string;
        mask?: string;
        maxHeight?: string;
        maxWidth?: string;
        minHeight?: string;
        minWidth?: string;
        msContentZoomChaining?: string;
        msContentZoomLimit?: string;
        msContentZoomLimitMax?: any;
        msContentZoomLimitMin?: any;
        msContentZoomSnap?: string;
        msContentZoomSnapPoints?: string;
        msContentZoomSnapType?: string;
        msContentZooming?: string;
        msFlowFrom?: string;
        msFlowInto?: string;
        msFontFeatureSettings?: string;
        msGridColumn?: any;
        msGridColumnAlign?: string;
        msGridColumnSpan?: any;
        msGridColumns?: string;
        msGridRow?: any;
        msGridRowAlign?: string;
        msGridRowSpan?: any;
        msGridRows?: string;
        msHighContrastAdjust?: string;
        msHyphenateLimitChars?: string;
        msHyphenateLimitLines?: any;
        msHyphenateLimitZone?: any;
        msHyphens?: string;
        msImeAlign?: string;
        msOverflowStyle?: string;
        msScrollChaining?: string;
        msScrollLimit?: string;
        msScrollLimitXMax?: any;
        msScrollLimitXMin?: any;
        msScrollLimitYMax?: any;
        msScrollLimitYMin?: any;
        msScrollRails?: string;
        msScrollSnapPointsX?: string;
        msScrollSnapPointsY?: string;
        msScrollSnapType?: string;
        msScrollSnapX?: string;
        msScrollSnapY?: string;
        msScrollTranslation?: string;
        msTextCombineHorizontal?: string;
        msTextSizeAdjust?: any;
        msTouchAction?: string;
        msTouchSelect?: string;
        msUserSelect?: string;
        msWrapFlow?: string;
        msWrapMargin?: any;
        msWrapThrough?: string;
        opacity?: string;
        order?: string;
        orphans?: string;
        outline?: string;
        outlineColor?: string;
        outlineStyle?: string;
        outlineWidth?: string;
        overflow?: string;
        overflowX?: string;
        overflowY?: string;
        padding?: string;
        paddingBottom?: string;
        paddingLeft?: string;
        paddingRight?: string;
        paddingTop?: string;
        pageBreakAfter?: string;
        pageBreakBefore?: string;
        pageBreakInside?: string;
        parentRule?: CSSRule;
        perspective?: string;
        perspectiveOrigin?: string;
        pointerEvents?: string;
        position?: string;
        quotes?: string;
        right?: string;
        rubyAlign?: string;
        rubyOverhang?: string;
        rubyPosition?: string;
        stopColor?: string;
        stopOpacity?: string;
        stroke?: string;
        strokeDasharray?: string;
        strokeDashoffset?: string;
        strokeLinecap?: string;
        strokeLinejoin?: string;
        strokeMiterlimit?: string;
        strokeOpacity?: string;
        strokeWidth?: string;
        tableLayout?: string;
        textAlign?: string;
        textAlignLast?: string;
        textAnchor?: string;
        textDecoration?: string;
        textFillColor?: string;
        textIndent?: string;
        textJustify?: string;
        textKashida?: string;
        textKashidaSpace?: string;
        textOverflow?: string;
        textShadow?: string;
        textTransform?: string;
        textUnderlinePosition?: string;
        top?: string;
        touchAction?: string;
        transform?: string;
        transformOrigin?: string;
        transformStyle?: string;
        transition?: string;
        transitionDelay?: string;
        transitionDuration?: string;
        transitionProperty?: string;
        transitionTimingFunction?: string;
        unicodeBidi?: string;
        verticalAlign?: string;
        visibility?: string;
        webkitAlignContent?: string;
        webkitAlignItems?: string;
        webkitAlignSelf?: string;
        webkitAnimation?: string;
        webkitAnimationDelay?: string;
        webkitAnimationDirection?: string;
        webkitAnimationDuration?: string;
        webkitAnimationFillMode?: string;
        webkitAnimationIterationCount?: string;
        webkitAnimationName?: string;
        webkitAnimationPlayState?: string;
        webkitAnimationTimingFunction?: string;
        webkitAppearance?: string;
        webkitBackfaceVisibility?: string;
        webkitBackground?: string;
        webkitBackgroundAttachment?: string;
        webkitBackgroundClip?: string;
        webkitBackgroundColor?: string;
        webkitBackgroundImage?: string;
        webkitBackgroundOrigin?: string;
        webkitBackgroundPosition?: string;
        webkitBackgroundPositionX?: string;
        webkitBackgroundPositionY?: string;
        webkitBackgroundRepeat?: string;
        webkitBackgroundSize?: string;
        webkitBorderBottomLeftRadius?: string;
        webkitBorderBottomRightRadius?: string;
        webkitBorderImage?: string;
        webkitBorderImageOutset?: string;
        webkitBorderImageRepeat?: string;
        webkitBorderImageSlice?: string;
        webkitBorderImageSource?: string;
        webkitBorderImageWidth?: string;
        webkitBorderRadius?: string;
        webkitBorderTopLeftRadius?: string;
        webkitBorderTopRightRadius?: string;
        webkitBoxAlign?: string;
        webkitBoxDirection?: string;
        webkitBoxFlex?: string;
        webkitBoxOrdinalGroup?: string;
        webkitBoxOrient?: string;
        webkitBoxPack?: string;
        webkitBoxSizing?: string;
        webkitColumnBreakAfter?: string;
        webkitColumnBreakBefore?: string;
        webkitColumnBreakInside?: string;
        webkitColumnCount?: any;
        webkitColumnGap?: any;
        webkitColumnRule?: string;
        webkitColumnRuleColor?: any;
        webkitColumnRuleStyle?: string;
        webkitColumnRuleWidth?: any;
        webkitColumnSpan?: string;
        webkitColumnWidth?: any;
        webkitColumns?: string;
        webkitFilter?: string;
        webkitFlex?: string;
        webkitFlexBasis?: string;
        webkitFlexDirection?: string;
        webkitFlexFlow?: string;
        webkitFlexGrow?: string;
        webkitFlexShrink?: string;
        webkitFlexWrap?: string;
        webkitJustifyContent?: string;
        webkitOrder?: string;
        webkitPerspective?: string;
        webkitPerspectiveOrigin?: string;
        webkitTapHighlightColor?: string;
        webkitTextFillColor?: string;
        webkitTextSizeAdjust?: any;
        webkitTransform?: string;
        webkitTransformOrigin?: string;
        webkitTransformStyle?: string;
        webkitTransition?: string;
        webkitTransitionDelay?: string;
        webkitTransitionDuration?: string;
        webkitTransitionProperty?: string;
        webkitTransitionTimingFunction?: string;
        webkitUserSelect?: string;
        webkitWritingMode?: string;
        whiteSpace?: string;
        widows?: string;
        width?: any;
        wordBreak?: string;
        wordSpacing?: string;
        wordWrap?: string;
        writingMode?: string;
        zIndex?: string;
        zoom?: string;
        y?: number;
        x?: number;
        alpha?: number;
        webkitBoxShadow?: string;
        float?: string;
    }
}
declare module shiva {
    class Styles {
        static button: {
            fontSize: string;
            fontFamily: string;
            fontWeight: string;
            fontColourOver: number;
            fontColourOut: number;
            letterSpacing: string;
            backgroundColor: string;
            backgroundColorHover: string;
            cornerRadius: string;
            durationOut: number;
            durationIn: number;
            padding: string;
            textAlign: string;
            whiteSpace: string;
            msTouchAction: string;
            touchAction: string;
            cursor: string;
            webkitUserSelect: string;
            mozUserSelect: string;
            msUserSelect: string;
            userSelect: string;
            backgroundImage: string;
            border: string;
            borderColor: string;
            color: string;
            colorHover: string;
            text: string;
        };
        static caret: {
            width: string;
            height: string;
            borderLeftWidth: string;
            borderLeftStyle: string;
            borderLeftColor: string;
            borderRightWidth: string;
            borderRightStyle: string;
            borderRightColor: string;
            borderTopWidth: string;
            borderTopStyle: string;
            borderTopColor: string;
            display: string;
            verticalAlign: string;
            marginLeft: string;
        };
        static drop: {
            fontFamily: string;
            fontSize: string;
            backgroundColor: string;
            backgroundColorHover: string;
            colorHover: string;
            color: string;
            durationIn: number;
            durationOut: number;
            listStyle: string;
            zIndex: string;
            position: string;
            marginTop: string;
            minWidth: string;
            border: string;
            webkitBoxShadow: string;
            boxShadow: string;
            fontWeight: string;
            paddingLeft: string;
            durationExpand: string;
            durationContract: string;
        };
    }
}
declare module shiva {
    class Transition {
        private callback;
        private data;
        constructor();
        then(callback: Function, data?: any): Transition;
        execute(): void;
        printCallback(): Transition;
    }
}
declare module shiva {
    interface TransitionFromToConfig extends TransitionToConfig {
        fromVars: StyleDeclaration;
    }
}
declare module shiva {
    interface TransitionToConfig {
        duration: number;
        toVars: StyleDeclaration;
        ease?: Ease;
        delay?: number;
        immediateRender?: boolean;
        resolve?: Function;
    }
}
declare module shiva {
    class Window {
        static scrollY(): number;
        static scrollX(): number;
        static height: number;
        static width: number;
    }
}
declare module shiva {
    interface DropConfig extends HoverStyleDeclaration {
        durationExpand?: number;
        durationContract?: number;
    }
}
declare module shiva {
    class DropDown extends Container {
        static CHANGE: string;
        private button;
        private unorderedList;
        private scopedEventHandler;
        private items;
        private dropConfig;
        constructor(config: DropDownConfig);
        private itemClicked(e);
        itemOver(e: shiva.Event): void;
        itemOut(e: shiva.Event): void;
        private buttonClicked(e);
        private closeDrop(e);
        private hideList();
        disable(): void;
        enable(): void;
    }
}
declare module shiva {
    interface DropDownConfig extends ContainerConfig {
        options: string[];
        button?: ButtonConfig;
        drop?: DropConfig;
        caret?: StyleDeclaration;
    }
}