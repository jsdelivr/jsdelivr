YUI.add('gallery-aui-data-set', function(A) {

var Lang = A.Lang;

var DataSet = function() {
	DataSet.superclass.constructor.apply(this, arguments);
};

DataSet.NAME = 'dataset';

DataSet.ATTRS = {
	keys: {
		getter: function(value) {
			var instance = this;

			return instance.keys;
		}
	},

	first: {
		getter: function() {
			var instance = this;

			var values = instance.values;

			return values[0];
		}
	},

	includeFunctions: {
		value: false
	},

	items: {
		value: null,
		getter: function() {
			var instance = this;

			return instance.collection || {};
		}
	},

	last: {
		getter: function() {
			var instance = this;

			var values = instance.values;

			return values[values.length - 1];
		}
	},

	getKey: {
		lazyAdd: false,
		value: null,
		getter: function(value) {
			var instance = this;

			return value || instance.getKey;
		},
		setter: function(value) {
			var instance = this;

			if (Lang.isFunction(value)) {
				instance.getKey = value;
			}

			return instance.getKey;
		}
	},

	values: {
		getter: function(value) {
			var instance = this;

			return instance.values;
		},
		readOnly: true
	}
};

A.extend(
	DataSet,
	A.Base,
	{
		initializer: function() {
			var instance = this;

			instance.collection = {};
			instance.keys = [];
			instance.values = [];

			instance.length = 0;

			instance.publish(
				'add',
				{
					defaultFn: instance._defaultAddFn
				}
			);

			instance.publish(
				'clear',
				{
					defaultFn: instance._defaultClearFn
				}
			);

			instance.publish(
				'remove',
				{
					defaultFn: instance._defaultRemoveFn
				}
			);

			instance.publish(
				'replace',
				{
					defaultFn: instance._defaultReplaceFn
				}
			);

			instance.publish(
				'sort',
				{
					defaultFn: instance._defaultSortFn
				}
			);
		},

		add: function(key, obj) {
			var instance = this;

			if (arguments.length == 1) {
				obj = key;
				key = instance.getKey(obj);
			}

			if (!Lang.isNull(key) && !Lang.isUndefined(key)) {
				var prevVal = instance.collection[key];

				if (!Lang.isUndefined(prevVal)) {
					return instance.replace(key, obj);
				}
			}

			var length = instance.length;

			instance.fire(
				'add',
				{
					index: length,
					attrName: key,
					item: obj,
					newVal: obj
				}
			);
		},

		addAll: function(obj) {
			var instance = this;

			var args = arguments;
			var length = args.length;

			if (length == 1) {
				args = obj;
			}

			if (length > 1 || Lang.isArray(obj)) {
				length = args.length;

				for (var i = 0; i < length; i++) {
					instance.add(args[i]);
				}
			}
			else {
				for (var i in obj) {
					var item = obj[i];

					instance.add(i, item);
				}
			}
		},

		clear: function() {
			var instance = this;

			instance.fire('clear');
		},

		clone: function() {
			var instance = this;

			var clone = new DataSet();

			var keys = instance.keys;
			var values = instance.values;

			var length = values.length;

			for (var i = 0; i < length; i++) {
				clone.add(keys[i], values[i]);
			}

			clone.set('getKey', instance.get('getKey'));

			return clone;
		},

		contains: function(obj) {
			var instance = this;

			return instance.indexOf(obj) > -1;
		},

		containsKey: function(key) {
			var instance = this;

			return !(Lang.isUndefined(instance.collection[key]));
		},

		each: function(fn, context) {
			var instance = this;

			return instance._each(instance.values, fn, context);
		},

		eachKey: function(fn, context) {
			var instance = this;

			var keys = instance.keys;

			return instance._each(keys, fn, context);
		},

		filter: function(fn, context) {
			var instance = this;

			var filtered = new DataSet();

			filtered.set('getKey', instance.get('getKey'));

			var collection = instance.collection;
			var keys = instance.keys;
			var values = instance.values;

			context = context || instance;

			var filteredDataSet = filtered.collection;
			var filteredValues = filtered.values;

			var length = values.length;
			var item;

			for (var i = 0; i < length; i++) {
				item = values[i];

				if (fn.call(context, item, i, collection)) {
					filtered.add(keys[i], item);
				}
			}

			filtered.length = filteredValues.length;

			return filtered;
		},

		filterBy: function(key, value, startsWith, caseSensitive) {
			var instance = this;

			if (Lang.isUndefined(value) ||
			 	Lang.isNull(value) ||
				((Lang.isArray(value) ||
					Lang.isString(value)) && !value.length)) {

				return instance.clone();
			}

			value = instance._generateRegEx(value, startsWith, caseSensitive);

			var keyFilter = A.bind(instance._keyFilter, instance, key, value);

			return instance.filter(keyFilter);
		},

		find: function(fn, context) {
			var instance = this;

			return A.Array.find(instance.values, fn, context);
		},

		findIndex: function(fn, context, start) {
			var instance = this;

			var collection = instance.collection;
			var values = instance.values;
			var length = instance.length;

			start = start || 0;

			for (var i = start; i < length; i++) {
				if (fn.call(context, values[i], i, collection)) {
					return i;
				}
			}

			return -1;
		},

		findIndexBy: function(key, value, start, startsWith, caseSensitive) {
			var instance = this;

			if (Lang.isUndefined(value) ||
			 	Lang.isNull(value) ||
				((Lang.isArray(value) ||
					Lang.isString(value)) && !value.length)) {

				return -1;
			}

			value = instance._generateRegEx(value, startsWith, caseSensitive);

			var keyFilter = A.bind(instance._keyFilter, instance, key, value);

			return instance.findIndex(keyFilter, null, start);
		},

		getKey: function(obj) {
			var instance = this;

			return (obj.get && obj.get('id')) || obj.id;
		},

		indexOf: function(obj) {
			var instance = this;

			return A.Array.indexOf(instance.values, obj);
		},

		indexOfKey: function(key) {
			var instance = this;

			return A.Array.indexOf(instance.keys, key);
		},

		insert: function(index, key, obj) {
			var instance = this;

			if (arguments.length == 2) {
				obj = arguments[1];
				key = instance.getKey(obj);
			}

			if (instance.containsKey(key)) {
				instance.removeKey(key);
			}

			instance.fire(
				'add',
				{
					index: index,
					attrName: key,
					item: obj,
					newVal: obj
				}
			);
		},

		invoke: function(method, args) {
			var instance = this;

			var values = instance.values;
			var length = values.length;

			if (!args) {
				args = [];
			}
			else {
				args = [].concat(args);
			}

			for (var i = 0; i < length; i++) {
				var item = values[i];
				var itemMethod = item && item[method];

				if (Lang.isFunction(itemMethod)) {
					itemMethod.apply(item, args);
				}
			}

			return instance;
		},

		item: function(key) {
			var instance = this;

			var item;

			if (Lang.isNumber(key)) {
				var values = instance.values;

				item = values[key];
			}
			else {
				item = instance.collection[key];
			}

			return item;
		},

		keySort: function(direction, fn) {
			var instance = this;

			instance.fire(
				'sort',
				{
					direction: direction,
					fn: fn || instance._keySorter,
					type: 'key'
				}
			);
		},

		remove: function(obj) {
			var instance = this;

			var index = instance.indexOf(obj);

			return instance.removeAt(index);
		},

		removeAt: function(index) {
			var instance = this;

			if (index < instance.length && index >= 0) {
				var obj = instance.values[index];
				var key = instance.keys[index];

				instance.fire(
					'remove',
					{
						index: index,
						attrName: key,
						item: obj,
						prevVal: obj
					}
				);
			}
		},

		removeKey: function(key) {
			var instance = this;

			var index = instance.indexOfKey(key);

			return instance.removeAt(index);
		},

		replace: function(key, obj) {
			var instance = this;

			if (arguments.length == 1) {
				obj = key;
				key = instance.getKey(obj);
			}

			var prevVal = instance.collection[key];

			if (Lang.isUndefined(key) || Lang.isNull(key) || Lang.isUndefined(prevVal)) {
				return instance.add(key, obj);
			}

			var index = instance.indexOfKey(key);

			instance.fire(
				'replace',
				{
					attrName: key,
					index: index,
					item: obj,
					prevVal: prevVal,
					newVal: obj
				}
			);
		},

		size: function() {
			var instance = this;

			return instance.length;
		},

		slice: function(start, end) {
			var instance = this;

			var values = instance.values;

			return values.slice.apply(values, arguments);
		},

		sort: function(direction, fn) {
			var instance = this;

			instance.fire(
				'sort',
				{
					direction: direction,
					fn: fn,
					type: 'value'
				}
			);
		},

		_defaultAddFn: function(event) {
			var instance = this;

			var key = event.attrName;
			var obj = event.item;
			var index = event.index;

			if (!Lang.isNull(key) && !Lang.isUndefined(key)) {
				if (instance.get('includeFunctions') || !Lang.isFunction(obj)) {
					instance.collection[key] = obj;
				}
			}

			instance.keys.splice(index, 0, key);
			instance.values.splice(index, 0, obj);

			++instance.length;
		},

		_defaultClearFn: function(event) {
			var instance = this;

			instance.collection = {};
			instance.keys = [];
			instance.values = [];
			instance.length = 0;
		},

		_defaultRemoveFn: function(event) {
			var instance = this;

			var index = event.index;
			var obj = event.item;
			var key = event.attrName;

			var collection = instance.collection;
			var keys = instance.keys;

			instance.values.splice(index, 1);

			if (!Lang.isUndefined(key)) {
				delete collection[key];
			}

			keys.splice(index, 1);

			instance.length--;
		},

		_defaultReplaceFn: function(event) {
			var instance = this;

			var key = event.attrName;
			var obj = event.item;

			instance.collection[key] = obj;
		},

		_defaultSortFn: function(event) {
			var instance = this;

			instance._sortBy(event.type, event.direction, event.fn);
		},

		_each: function(arr, fn, context) {
			var instance = this;

			var values = arr.slice(0);
			var length = values.length;

			context = context || instance;

			for (var i = 0; i < length; i++) {
				if (fn.call(context, values[i], i, values) === false) {
					return false;
				}
			}

			return true;
		},

		_generateRegEx: function(value, startsWith, caseSensitive) {
			var instance = this;

			if (!(value instanceof RegExp)) {
				value = String(value);

				var regExBuffer = [];

				if (startsWith !== false) {
					regExBuffer.push('^');
				}

				regExBuffer.push(value);

				var options;

				if (!caseSensitive) {
					options = 'i';
				}

				value = new RegExp(regExBuffer.join(''), options);
			}

			return value;
		},

		_keyFilter: function(key, value, item, index, collection) {
			var instance = this;

			return item && value.test(item[key]);
		},

		_keySorter: function(a, b) {
			var instance = this;

			var keyA = String(a).toLowerCase();
			var keyB = String(b).toLowerCase();

			var returnValue = 0;

			if (keyA > keyB) {
				returnValue = 1;
			}
			else if (keyA < keyB) {
				returnValue = -1;
			}

			return returnValue;
		},

		_sortBy: function(property, direction, fn) {
			var instance = this;

			var asc = 1;
			var tempValues = [];
			var keys = instance.keys;
			var values = instance.values;

			var length = values.length;

			fn = fn || A.Array.numericSort;

			if (String(direction).toLowerCase() == 'desc') {
				asc = -1;
			}

			for (var i = 0; i < length; i++) {
				tempValues.push(
					{
						key: keys[i],
						value: values[i],
						index: i
					}
				);
			}

			tempValues.sort(
				function(a, b) {
					var value = fn(a[property], b[property]) * asc;

					if (value === 0) {
						value = 1;

						if (a.index < b.index) {
							value = -1;
						}
					}

					return value;
				}
			);

			length = tempValues.length;

			var collection = {};

			for (var i = 0; i < length; i++) {
				var item = tempValues[i];
				var key = item.key;
				var value = item.value;

				collection[key] = value;
				keys[i] = key;
				values[i] = value;
			}

			instance.collection = collection;
		}
	}
);

A.DataSet = DataSet;


}, 'gallery-2010.08.18-17-12' ,{requires:['oop','collection','base'], skinnable:false});
