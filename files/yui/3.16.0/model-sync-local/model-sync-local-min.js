YUI.add("model-sync-local",function(e,t){function n(){}n._NON_ATTRS_CFG=["root"],n._hasLocalStorage=function(){var t=e.config.win.localStorage,n=e.guid();try{return t.setItem(n,n),t.removeItem(n),!0}catch(r){return!1}}(),n._data=n._data||{},n._store=n._store||{},n.prototype={root:"",storage:null,initializer:function(t){var r,i;t||(t={}),"root"in t&&(this.root=t.root||""),!this.root&&this.model&&this.model.prototype.root&&(this.root=this.model.prototype.root),n._hasLocalStorage&&(this.storage=e.config.win.localStorage,r=this.storage.getItem(this.root)),r?(n._store[this.root]=r.split("|")||[],e.Array.each(n._store[this.root],function(t){n._data[t]=e.JSON.parse(this.storage.getItem(t))},this)):n._store[this.root]||(n._store[this.root]=[])},sync:function(e,t,n){t||(t={});var r,i;try{switch(e){case"read":this._isYUIModelList?r=this._index(t):r=this._show(t);break;case"create":r=this._create(t);break;case"update":r=this._update(t);break;case"delete":r=this._destroy(t)}}catch(s){i=s.message}r?n(null,r):i?n(i):n("Data not found in LocalStorage")},generateID:function(t){return e.guid(t+"_")},_index:function(){var t=n._store[this.root],r=e.Array.map(t,function(e){return n._data[e]});return r},_show:function(){return n._data[this.get("id")]||null},_create:function(){var e=this.toJSON();return e.id=this.generateID(this.root),n._data[e.id]=e,this.storage&&this.storage.setItem(e.id,e),n._store[this.root].push(e.id),this._save(),e},_update:function(){var t=this.toJSON(),r=this.get("id");return n._data[r]=t,this.storage&&this.storage.setItem(r,t),e.Array.indexOf(n._store[this.root],r)===-1&&n._store[this.root].push(r),this._save(),t},_destroy:function(){var t=this.get("id"),r=this.storage;if(!n._data[t])return;return delete n._data[t],r&&r.removeItem(t),n._store[this.root]=e.Array.filter(n._store[this.root],function(e){return e.id!=t}),this._save(),this.toJSON()},_save:function(){n._hasLocalStorage&&this.storage&&this.storage.setItem(this.root,n._store[this.root].join("|"))}},e.namespace("ModelSync").Local=n},"@VERSION@",{requires:["model","json-stringify"]});
