import { PathNode } from "../path/node";
import { ActiveUIView, ViewContext, ViewConfig } from "./interface";
import { _ViewDeclaration } from "../state/interface";
export declare type ViewConfigFactory = (path: PathNode[], decl: _ViewDeclaration) => ViewConfig | ViewConfig[];
/**
 * The View service
 */
export declare class ViewService {
    private uiViews;
    private viewConfigs;
    private _rootContext;
    private _viewConfigFactories;
    constructor();
    rootContext(context?: ViewContext): ViewContext;
    viewConfigFactory(viewType: string, factory: ViewConfigFactory): void;
    createViewConfig(path: PathNode[], decl: _ViewDeclaration): ViewConfig[];
    /**
     * De-registers a ViewConfig.
     *
     * @param viewConfig The ViewConfig view to deregister.
     */
    deactivateViewConfig(viewConfig: ViewConfig): void;
    activateViewConfig(viewConfig: ViewConfig): void;
    sync: () => void;
    /**
     * Allows a `ui-view` element to register its canonical name with a callback that allows it to
     * be updated with a template, controller, and local variables.
     *
     * @param {String} name The fully-qualified name of the `ui-view` object being registered.
     * @param {Function} configUpdatedCallback A callback that receives updates to the content & configuration
     *                   of the view.
     * @return {Function} Returns a de-registration function used when the view is destroyed.
     */
    registerUIView(uiView: ActiveUIView): () => void;
    /**
     * Returns the list of views currently available on the page, by fully-qualified name.
     *
     * @return {Array} Returns an array of fully-qualified view names.
     */
    available(): any[];
    /**
     * Returns the list of views on the page containing loaded content.
     *
     * @return {Array} Returns an array of fully-qualified view names.
     */
    active(): any[];
    /**
     * Normalizes a view's name from a state.views configuration block.
     *
     * @param context the context object (state declaration) that the view belongs to
     * @param rawViewName the name of the view, as declared in the [[StateDeclaration.views]]
     *
     * @returns the normalized uiViewName and uiViewContextAnchor that the view targets
     */
    static normalizeUIViewTarget(context: ViewContext, rawViewName?: string): {
        uiViewName: string;
        uiViewContextAnchor: string;
    };
}
