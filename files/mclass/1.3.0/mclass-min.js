/*
 mClass 1.3.0

 @copyright Copyright 2013-2015 Edwin Martin

 @see {@link https://github.com/edwinm/mClass|mClass}

 @license MIT
*/
function mClass(a){function c(){a["extends"]&&a["extends"]._definition.construct&&a["extends"]._definition.construct.apply(this,arguments);a.construct&&a.construct.apply(this,arguments)}function d(){this.constructor=c;for(b in a.augments)for(var d in a.augments[b])this[d]=a.augments[b][d];for(b in a["public"])this[b]=a["public"][b];this._super=a["extends"]&&a["extends"]._definition["public"]}function e(){this.constructor=a["extends"]}var b;"function"==typeof a&&(a=a());a["extends"]&&a["extends"]._definition["public"]&&
(e.prototype=a["extends"].prototype,d.prototype=new e);c.prototype=new d;if(a["extends"]&&a["extends"]._definition["static"])for(b in a["extends"]._definition["static"])c[b]=a["extends"]._definition["static"][b];for(b in a["static"])c[b]=a["static"][b];c._definition=a;c._super=a["extends"]&&a["extends"]._definition["public"];return c}"function"===typeof define&&define.amd?define("mClass",function(){return mClass}):"object"===typeof module&&module.exports&&(module.exports=mClass);
