/*!
 * persisto.js
 *
 * Persistent, editable objects for Javascript.
 *
 * Copyright (c) 2016, Martin Wendt (http://wwWendt.de)
 * Released under the MIT license
 *
 * @version 1.0.0
 * @date 2016-08-11T21:56
 */

;(function($, window, document, undefined) {

/*globals console */

"use strict";

/*******************************************************************************
 * Private functions and variables
 */

var MAX_INT = 9007199254740991;

/* Return current time stamp. */
function _getNow() {
	return new Date().getTime();
}

/**
 * A persistent plain object or array.
 */
window.PersistentObject = function(namespace, opts) {

	var prevValue,
		self = this,
		dfd = $.Deferred(),
		stamp = _getNow();

	if ( typeof namespace !== "string" ) { $.error("Missing required argument: namespace"); }

	this.opts = $.extend({
		remote: null,          // URL for GET/PUT, ajax options, or callback
		init: {},              // default value if no data is found in localStorage
		commitDelay: 500,      // commit changes after 0.5 seconds of inactivity
		maxCommitDelay: 3000,  // commit changes max. 3 seconds after first change
		pushDelay: 5000,       // push commits after 5 seconds of inactivity
		maxPushDelay: 30000,   // push commits max. 30 seconds after first change
		debug: 2,              // 0:quiet, 1:normal, 2:verbose
		createParents: true,   // set() creates intermediate parent objects for children
		storage: window.localStorage,
		// form: {},
		// Events
		change: $.noop,
		commit: $.noop,
		conflict: $.noop,
		error: $.noop,
		pull: $.noop,
		push: $.noop,
		update: $.noop
	}, opts);

	this.debugLevel = 1;  // Set to 1 by 'grunt build'
	this._checkTimer = null;
	this.namespace = namespace;
	this.storage = this.opts.storage;
	this._data = this.opts.init;

	this.offline = undefined;
	this.phase = null;
	this.uncommittedSince = null;
	this.unpushedSince = null;
	this.lastUpdate = 0;
	this.lastPull = 0;
	this.commitCount = 0;
	this.pushCount = 0;
	this.lastModified = stamp;

	this.ready = dfd.promise;

	// _data contains the default value. Now load from persistent storage if any
	prevValue = this.storage ? this.storage.getItem(this.namespace) : null;

	if ( this.opts.remote ) {
		// Try to pull, then resolve
		this.pull().done(function() {
			// self.debug("init from remote", this._data);
			self.offline = false;
			dfd.resolve();
		}).fail(function() {
			self.offline = true;
			if ( prevValue != null ) {
				console.warn(self + ": could not init from remote; falling back to storage.");
				// self._data = JSON.parse(prevValue);
				self._data = $.extend({}, self.opts.init, JSON.parse(prevValue));
			} else {
				console.warn(self + ": could not init from remote; falling back default.");
			}
			dfd.resolve();
		});
	} else if ( prevValue != null ) {
		this.update();
		// We still extend from opts.init, in case some fields where missing
		this._data = $.extend({}, this.opts.init, this._data);
		// this.debug("init from storage", this._data);
		dfd.resolve();
		// this.lastUpdate = stamp;
		// this.setDirty();
	} else {
		// this.debug("init to default", this._data);
		dfd.resolve();
	}
};

window.PersistentObject.prototype = {
	/** @type {string} */
	version: "1.0.0",      // Set to semver by 'grunt release'

	/* Trigger commit/push according to current settings. */
	_invalidate: function(hint, deferredCall) {
		var self = this,
			prevChange = this.lastModified,
			now = _getNow(),
			nextCommit = 0,
			nextPush = 0,
			nextCheck = 0;

		if ( this._checkTimer ) {
			clearTimeout(this._checkTimer);
			this._checkTimer = null;
		}

		if ( !deferredCall ) {
			// this.debug("_invalidate(" + hint + ")");
			this.lastModified = now;
			if ( !this.uncommittedSince ) { this.uncommittedSince = now; }
			if ( !this.unpushedSince ) { this.unpushedSince = now; }
			this.opts.change(hint);
		} else {
			this.debug("_invalidate recursive()");
		}

		if ( this.storage ) {
			// If we came here by a deferred timer (or delay is 0), commit
			// immedialtely
			if ( ((now - prevChange) >= this.opts.commitDelay) ||
				((now - this.uncommittedSince) >= this.opts.maxCommitDelay) ) {

				this.debug("_invalidate: force commit",
					((now - prevChange) >= this.opts.commitDelay),
					((now - this.uncommittedSince) >= this.opts.maxCommitDelay));
				this.commit();
			} else {
				// otherwise schedule next check
				nextCommit = Math.min(
					now + this.opts.commitDelay + 1,
					this.uncommittedSince + this.opts.maxCommitDelay + 1 );
			}
		}

		if ( this.opts.remote ) {
			if ( ((now - prevChange) >= this.opts.pushDelay) ||
				((now - this.unpushedSince) >= this.opts.maxPushDelay) ) {

				this.debug("_invalidate: force push", ((now - prevChange) >= this.opts.pushDelay),
					((now - this.unpushedSince) >= this.opts.maxPushDelay));
				this.push();
			} else {
				nextPush = Math.min(
					now + this.opts.pushDelay + 1,
					this.unpushedSince + this.opts.maxPushDelay + 1 );
			}
		}
		if ( nextCommit || nextPush ) {
			nextCheck = Math.min(
				nextCommit || MAX_INT,
				nextPush || MAX_INT);
			// this.debug("Defer update:", nextCheck - now)
			this.debug("_invalidate defer (" + hint + ") by " + (nextCheck - now) + "ms" );
			this._checkTimer = setTimeout(function() {
				self._checkTimer = null; // no need to call clearTimeout in the handler...
				self._invalidate.call(self, null, true);
			}, nextCheck - now);
		}
	},
	/* Load data from localStorage. */
	_update: function(objData) {
		if ( this.uncommittedSince ) {
			console.warn("Updating an uncommitted object.");
			if ( this.conflict(objData, this._data) === false ) {
				return;
			}
		}
		this._data = objData;
		// this.dirty = false;
		this.lastUpdate = _getNow();
	},
	/* */
	toString: function() {
		return "PersistentObject('" + this.namespace + "')";
	},
	/* */
	debug: function() {
		if ( this.opts.debug >= 1 ) {
			Array.prototype.unshift.call(arguments, this.toString());
			console.log.apply(window.console, arguments);
		}
	},
	/** Return true if there are uncommited or unpushed modifications. */
	isDirty: function() {
		return !!(
			(this.storage && this.uncommittedSince) ||
			(this.opts.remote && this.unpushedSince));
	},
	/** Return true if initial pull has completed. */
	isReady: function() {
		return this.ready.state !== "pending";
	},
	/** Access object property (`key` supports dot notation). */
	get: function(key) {
		var i,
			cur = this._data,
			parts = ("" + key)                 // convert to string
				.replace(/\[(\w+)\]/g, ".$1")  // convert indexes to properties
				.replace(/^\./, "")            // strip a leading dot
				.split(".");

		// NOTE: this is slower (tested on Safari):
		// return key.split(".").reduce(function(prev, curr) {
		// 	return prev[curr];
		// }, this._data);

		for (i = 0; i < parts.length; i++) {
			cur = cur[parts[i]];
			if ( cur === undefined && i < (parts.length - 1) ) {
				$.error("The property '" + key +
					"' could not be accessed because parent '" +
					parts.slice(0, i + 1).join(".") +
					"' does not exist");
			}
		}
		return cur;
	},
	/* Modify object property and set the `dirty` flag (`key` supports dot notation). */
	_setOrRemove: function(key, value, remove) {
		var i, parent,
			cur = this._data,
			parts = ("" + key)                 // convert to string
				.replace(/\[(\w+)\]/g, ".$1")  // convert indexes to properties
				.replace(/^\./, "")            // strip a leading dot
				.split("."),
			lastPart = parts.pop();

		for (i = 0; i < parts.length; i++) {
			parent = cur;
			cur = parent[parts[i]];
			// Create intermediate parent objects properties if required
			if ( cur === undefined ) {
				if ( this.opts.createParents ) {
					cur = parent[parts[i]] = {};
					this.debug("Creating intermediate property '" + parts[i] + "'");
				} else {
					$.error("The property '" + key +
						"' could not be set because parent '" +
						parts.slice(0, i + 1).join(".") +
						"' does not exist");
				}
			}
		}
		if ( cur[lastPart] !== value ) {
			if ( remove === true ) {
				delete cur[lastPart];
				this._invalidate("remove");
			} else {
				cur[lastPart] = value;
				this._invalidate("set");
			}
		}
	},
	/** Modify object property and set the `dirty` flag (`key` supports dot notation). */
	set: function(key, value) {
		return this._setOrRemove(key, value, false);
	},
	/** Delete object property and set the `dirty` flag (`key` supports dot notation). */
	remove: function(key) {
		return this._setOrRemove(key, undefined, true);
	},
	/** Replace data object with a new instance. */
	reset: function(obj) {
		this._data = obj || {};
		this._invalidate("reset");
	},
	/** Flag object as modified, so that commit / push will be scheduled. */
	setDirty: function(flag) {
		if ( flag === false ) {
		} else {
			this._invalidate("explicit");
		}
	},
	/** Load data from localStorage. */
	update: function() {
		if ( this.phase ) {
			$.error(this + ": Trying to update while '" + this.phase + "' is pending.");
		}
		if ( this.opts.debug >= 2 && console.time ) { console.time(this + ".update"); }
		var data = this.storage.getItem(this.namespace);
		data = JSON.parse(data);
		this._update(data);
		if ( this.opts.debug >= 2 && console.time ) { console.timeEnd(this + ".update"); }
	},
	/** Write data to localStorage. */
	commit: function() {
		var data;
		if ( this.phase ) {
			$.error(this + ": Trying to commit while '" + this.phase + "' is pending.");
		}
		if ( this.opts.debug >= 2 && console.time ) { console.time(this + ".commit"); }
		// try { data = JSON.stringify(this._data); } catch(e) { }
		data = JSON.stringify(this._data);
		this.storage.setItem(this.namespace, data);
		// this.dirty = false;
		this.uncommittedSince = null;
		this.commitCount += 1;
		// this.lastCommit = _getNow();
		if ( this.opts.debug >= 2 && console.time ) { console.timeEnd(this + ".commit"); }
		return data;
	},
	/** Download, then update data from the cloud. */
	pull: function() {
		var self = this;

		if ( this.phase ) {
			$.error(this + ": Trying to pull while '" + this.phase + "' is pending.");
		}
		if ( this.opts.debug >= 2 && console.time ) { console.time(this + ".pull"); }
		this.phase = "pull";
		// return $.get(this.opts.remote, function(objData) {
		return $.ajax({
			type: "GET",
			url: this.opts.remote
		}).done(function(objData) {
			var strData = objData;
			if ( $.isArray(objData) || $.isPlainObject(objData) ) {
				strData = JSON.stringify(objData);
			} else {
				objData = JSON.parse(objData);
			}
			self.storage.setItem(self.namespace, strData);
			self._update(objData);
			self.lastPull = _getNow();
		}).fail(function() {
			self.opts.error(arguments);
		}).always(function() {
			self.phase = null;
			if ( self.opts.debug >= 2 && console.time ) { console.timeEnd(self + ".pull"); }
		});
	},
	/** Commit, then upload data to the cloud. */
	push: function() {
		var self = this,
			data = this.commit();

		if ( this.phase ) {
			$.error(this + ": Trying to push while '" + this.phase + "' is pending.");
		}
		if ( this.opts.debug >= 2 && console.time ) { console.time(self + ".push"); }
		this.phase = "push";
		if ( !this.opts.remote ) { $.error(this + ": missing remote option"); }
		return $.ajax({
			type: "PUT",
			url: this.opts.remote,
			data: data
		}).done(function() {
			// console.log("PUT", arguments);
			// self.lastPush = _getNow();
			self.unpushedSince = null;
			self.pushCount += 1;
		}).fail(function() {
			self.opts.error(arguments);
		}).always(function() {
			self.phase = null;
			if ( self.opts.debug >= 2 && console.time ) { console.timeEnd(self + ".push"); }
		});
	},
	/** Read data properties from form input elements with the same name.
	 * Supports elements of input (type: text, radio, checkbox), textarea,
	 * and select.
	 */
	readFromForm: function(form, options) {
		var self = this,
			$form = $(form),
			opts = $.extend({
				addNew: false,
				coerce: true,  // convert single checkboxes to bool (instead value)
				trim: true
			}, options);

		if ( opts.addNew ) {
			$form.find("[name]").each(function() {
				var name = $(this).attr("name");
				if ( self._data[name] === undefined ) {
					self._data[name] = null;
					self.debug("readFromForm: add field '" + name + "'");
				}
			});
		}
		$.each(this._data, function(k, v) {
			var val,
				$input = $form.find("[name='" + k + "']"),
				type = $input.attr("type");

			if ( !$input.length ) {
				self.debug("readFromForm: field not found: '" + k + "'");
				return;
			}
			if ( type === "radio") {
				val = $input.filter(":checked").val();
			} else if ( type === "checkbox" && $input.length === 1 ) {
				val = !!$input.filter(":checked").length;
			} else if ( type === "checkbox" && $input.length > 1 ) {
				val = [];
				$input.filter(":checked").each(function() {
					val.push($(this).val());
				});
			} else {
				val = $input.val();
				if ( opts.trim && typeof val === "string" ) { val = $.trim(val); }
			}
			// console.log("readFromForm: val(" + k + "): '" + val + "'");
			self.set(k, val);
		});
		// console.log("readFromForm: '" + this + "'", this._data);
	},
	/** Write data to form elements with the same name.
	 */
	writeToForm: function(form, options) {
		var $form = $(form);

		$.each(this._data, function(k, v) {
			var $input = $form.find("[name='" + k + "']"),
				type = $input.attr("type");

			if ( $input.length ) {
				if ( type === "radio" ) {
					$input.filter("[value='" + v + "']").prop("checked", true);
				} else if ( type === "checkbox" ) {
					if ( $input.length === 1 ) {
						$input.prop("checked", !!v);
					} else {
						// multi-value checkbox
						$input.each(function() {
							$(this).prop("checked", $.isArray(v) ?
								$.inArray(this.value, v) >= 0 : this.value === v);
						});
					}
				} else if ( $input.is("select") ) {
					// listbox
					$input.find("option").each(function() {
						$(this).prop("selected", $.isArray(v) ?
							$.inArray(this.value, v) >= 0 : this.value === v);
					});
				} else {
					$input.val(v);
				}
			}
		});

	}
};
// -----------------------------------------------------------------------------

}(jQuery, window, document));
