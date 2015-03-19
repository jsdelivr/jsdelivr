/*!
 * jQuery Data Link plugin v1.0.0pre
 * http://github.com/jquery/jquery-datalink
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function( $, undefined ){

var oldcleandata = $.cleanData,
	links = [],
	fnSetters = {
		val: "val",
		html: "html",
		text: "text"
	},
	eventNameSetField = "setField",
	eventNameChangeField = "changeField";

function getLinks(obj) {
	var data = $.data( obj ),
		cache,
		fn = data._getLinks || (cache={s:[], t:[]}, data._getLinks = function() { return cache; });
	return fn();
}

function bind(obj, wrapped, handler) {
	wrapped.bind( obj.nodeType ? "change" : eventNameChangeField, handler );
}
function unbind(obj, wrapped, handler) {
	wrapped.unbind( obj.nodeType ? "change" : eventNameChangeField, handler );
}

$.extend({
	cleanData: function( elems ) {
		for ( var j, i = 0, elem; (elem = elems[i]) != null; i++ ) {
			// remove any links with this element as the source
			// or the target.
			var links = $.data( elem, "_getLinks" );
			if ( links ) {
				links = links();
				// links this element is the source of
				var self = $(elem);
				$.each(links.s, function() {
					unbind( elem, self, this.handler );
					if ( this.handlerRev ) {
						unbind( this.target, $(this.target), this.handlerRev );
					}
				});
				// links this element is the target of
				$.each(links.t, function() {
					unbind( this.source, $(this.source), this.handler );
					if ( this.handlerRev ) {
						unbind( elem, self, this.handlerRev );
					}
				});
				links.s = [];
				links.t = [];
			}
		}
		oldcleandata( elems );
	},
	convertFn: {
		"!": function(value) {
			return !value;
		}
	},
	setField: function(target, field, value) {
		if ( target.nodeType ) {
			var setter = fnSetters[ field ] || "attr";
			$(target)[setter](value);
		} else {
			var parts = field.split(".");
			parts[1] = parts[1] ? "." + parts[1] : "";

				var $this = $( target ),
					args = [ parts[0], value ];

			$this.triggerHandler( eventNameSetField + parts[1] + "!", args );
			if ( value !== undefined ) {
				target[ field ] = value;
			}
			$this.triggerHandler( eventNameChangeField + parts[1] + "!", args );
		}
	}
});

function getMapping(ev, changed, newvalue, map) {
	var target = ev.target,
		isSetData = ev.type === eventNameChangeField,
		mappedName,
		convert,
		name;
	if ( isSetData ) {
		name = changed;
		if ( ev.namespace ) {
			name += "." + ev.namespace;
		}
	} else {
		name = (target.name || target.id);
	}

	if ( !map ) {
		mappedName = name;
	} else {
		var m = map[ name ];
		if ( !m ) {
			return null;
		}
		mappedName = m.name;
		convert = m.convert;
		if ( typeof convert === "string" ) {
			convert = $.convertFn[ convert ];
		}
	}
	return {
		name: mappedName,
		convert: convert,
		value: isSetData ? newvalue : $(target).val()
	};
}

$.extend($.fn, {
	link: function(target, mapping) {
		var self = this;
		if ( !target ) {
			return self;
		}
		function matchByName(name) {
			var selector = "[name=" + name + "], [id=" + name +"]";
			// include elements in this set that match as well a child matches
			return self.filter(selector).add(self.find(selector));
		}
		if ( typeof target === "string" ) {
			target = $( target, this.context || null )[ 0 ];
		}
		var hasTwoWay = !mapping,
			map,
			mapRev,
			handler = function(ev, changed, newvalue) {
				// a dom element change event occurred, update the target
				var m = getMapping( ev, changed, newvalue, map );
				if ( m ) {
					var name = m.name,
						value = m.value,
						convert = m.convert;
					if ( convert ) {
						value = convert( value, ev.target, target );
					}
					if ( value !== undefined ) {
						$.setField( target, name, value );
					}
				}
			},
			handlerRev = function(ev, changed, newvalue) {
				// a change or changeData event occurred on the target,
				// update the corresponding source elements
				var m = getMapping( ev, changed, newvalue, mapRev );
				if ( m ) {
					var name = m.name,
						value = m.value,
						convert = m.convert;
					// find elements within the original selector
					// that have the same name or id as the field that updated
					matchByName(name).each(function() {
						newvalue = value;
						if ( convert ) {
							newvalue = convert( newvalue, target, this );
						}
						if ( newvalue !== undefined ) {
							$.setField( this, "val", newvalue );
						}
					});
				}

			};
		if ( mapping ) {
			$.each(mapping, function(n, v) {
				var name = v,
					convert,
					convertBack,
					twoWay;
				if ( $.isPlainObject( v ) ) {
					name = v.name || n;
					convert = v.convert;
					convertBack = v.convertBack;
					twoWay = v.twoWay !== false;
					hasTwoWay |= twoWay;
				} else {
					hasTwoWay = twoWay = true;
				}
				if ( twoWay ) {
					mapRev = mapRev || {};
					mapRev[ n ] = {
						name: name,
						convert: convertBack
					};
				}
				map = map || {};
				map[ name ] = { name: n, convert: convert, twoWay: twoWay };
			});
		}

		// associate the link with each source and target so it can be
		// removed automaticaly when _either_ side is removed.
		self.each(function() {
			bind( this, $(this), handler );
			var link = {
				handler: handler,
				handlerRev: hasTwoWay ? handlerRev : null,
				target: target,
				source: this
			};
			getLinks( this ).s.push( link );
			if ( target.nodeType ) {
				getLinks( target ).t.push( link );
			}
		});
		if ( hasTwoWay ) {
			bind( target, $(target), handlerRev );
		}
		return self;
	},
	unlink: function(target) {
		this.each(function() {
			var self = $(this),
				links = getLinks( this ).s;
			for (var i = links.length-1; i >= 0; i--) {
				var link = links[ i ];
				if ( link.target === target ) {
					// unbind the handlers
					//wrapped.unbind( obj.nodeType ? "change" : "changeData", handler );
					unbind( this, self, link.handler );
					if ( link.handlerRev ) {
						unbind( link.target, $(link.target), link.handlerRev );
					}
					// remove from source links
					links.splice( i, 1 );
					// remove from target links
					var targetLinks = getLinks( link.target ).t,
						index = $.inArray( link, targetLinks );
					if ( index !== -1 ) {
						targetLinks.splice( index, 1 );
					}
				}
			}
		});
	},
	setField: function(field, value) {
		return this.each(function() {
			$.setField( this, field, value );
		});
	}
});

})(jQuery);
