/*
 mClass 1.0.3

 Copyright 2013-2015 Edwin Martin <edwin@bitstorm.org>

 https://github.com/edwinm/mClass

 License: MIT
*/
'use strict';function mClass(d){function c(){a.extends&&a.extends._definition.construct&&a.extends._definition.construct.apply(this,arguments);a.construct&&a.construct.apply(this,arguments)}function e(){this.constructor=c;for(b in a.public)this[b]=a.public[b];this._super=a.extends&&a.extends._definition.public}function f(){this.constructor=a.extends}var b,a=d;"function"==typeof d&&(a=d());a.extends&&a.extends._definition.public&&(f.prototype=a.extends.prototype,e.prototype=new f);c.prototype=new e;
if(a.extends&&a.extends._definition.static)for(b in a.extends._definition.static)c[b]=a.extends._definition.static[b];for(b in a.static)c[b]=a.static[b];c._definition=a;c._super=a.extends&&a.extends._definition.public;return c};
