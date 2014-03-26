YUI.add('gallery-widget-inherit-css', function(Y) {

/**
 * @module gallery-widget-inherit-css
 */
(function (Y) {
    'use strict';
    
    var _Do = Y.Do,
        _Widget = Y.Widget,
        
        _AlterReturn = _Do.AlterReturn,
        
        _getClassName = Y.ClassNameManager.getClassName,
        
        _getSuperclassClassName = function () {
            var superclass = this.constructor.superclass,
                superclassClassName,
                superclassConstructor = superclass.constructor,
                superclassCssPrefix = superclassConstructor.CSS_PREFIX || _getClassName(superclassConstructor.NAME.toLowerCase());
            
            superclassClassName = superclassConstructor !== _Widget && _getSuperclassClassName.apply(superclass, arguments) || [];
            
            superclassClassName.push(superclass.getClassName.apply({
                _cssPrefix: superclassCssPrefix
            }, arguments));
            
            return superclassClassName;
        };

    /**
     * Allows a Widget subclass to inherit css from the superclass.
     * @class WidgetInheritCss
     * @constructor
     */
    Y.WidgetInheritCss = function () {
        _Do.after(function () {
            return new _AlterReturn('Added superclass class.', _Do.originalRetVal + ' ' + _getSuperclassClassName.apply(this, arguments).join(' '));
        }, this, 'getClassName', this);
    };
}(Y));


}, 'gallery-2012.03.23-18-00' ,{requires:['classnamemanager', 'event-custom', 'widget'], skinnable:false});
