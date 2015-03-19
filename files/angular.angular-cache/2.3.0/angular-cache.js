/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache-2.3.0.js
 * @version 2.3.0 - [Homepage]{@link http://jmdobry.github.io/angular-cache/}
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-cache>
 * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 *
 * @overview angular-cache is a caching system that improves upon the capabilities of the
 * $cacheFactory provided by AngularJS.
 */
(function (window, angular, undefined) {
	'use strict';

	angular.module('jmdobry.binary-heap', []);

	/**
	 * @desc Provider for the BinaryHeap.
	 */
	function BinaryHeapProvider() {
		this.$get = function () {
			/**
			 * @method bubbleUp
			 * @param {array} heap The heap.
			 * @param {function} weightFunc The weight function.
			 * @param {number} n The index of the element to bubble up.
			 */
			function bubbleUp(heap, weightFunc, n) {
				var element = heap[n],
					weight = weightFunc(element);
				// When at 0, an element can not go up any further.
				while (n > 0) {
					// Compute the parent element's index, and fetch it.
					var parentN = Math.floor((n + 1) / 2) - 1,
						parent = heap[parentN];
					// If the parent has a lesser weight, things are in order and we
					// are done.
					if (weight >= weightFunc(parent)) {
						break;
					} else {
						heap[parentN] = element;
						heap[n] = parent;
						n = parentN;
					}
				}
			}

			/**
			 * @method bubbleDown
			 * @param {array} heap The heap.
			 * @param {function} weightFunc The weight function.
			 * @param {number} n The index of the element to sink down.
			 */
			function bubbleDown(heap, weightFunc, n) {
				var length = heap.length,
					node = heap[n],
					nodeWeight = weightFunc(node);

				while (true) {
					var child2N = (n + 1) * 2,
						child1N = child2N - 1;
					var swap = null;
					if (child1N < length) {
						var child1 = heap[child1N],
							child1Weight = weightFunc(child1);
						// If the score is less than our node's, we need to swap.
						if (child1Weight < nodeWeight) {
							swap = child1N;
						}
					}
					// Do the same checks for the other child.
					if (child2N < length) {
						var child2 = heap[child2N],
							child2Weight = weightFunc(child2);
						if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
							swap = child2N;
						}
					}

					if (swap === null) {
						break;
					} else {
						heap[n] = heap[swap];
						heap[swap] = node;
						n = swap;
					}
				}
			}

			/**
			 * @class BinaryHeap
			 * @desc BinaryHeap implementation of a priority queue.
			 * @param {function} weightFunc Function that returns the value that should be used for node value comparison.
			 * @example
			 * angular.module('app').controller(function (BinaryHeap) {
             *      var bHeap = new BinaryHeap(function (x) {
             *          return x.value;
             *      });
             * );
             */
			function BinaryHeap(weightFunc) {
				if (weightFunc && !angular.isFunction(weightFunc)) {
					throw new Error('BinaryHeap(weightFunc): weightFunc: must be a function!');
				}
				weightFunc = weightFunc || function (x) {
					return x;
				};
				this.weightFunc = weightFunc;
				this.heap = [];
			}

			/**
			 * @method BinaryHeap.push
			 * @desc Push an element into the binary heap.
			 * @param {*} node The element to push into the binary heap.
			 */
			BinaryHeap.prototype.push = function (node) {
				this.heap.push(node);
				bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
			};

			/**
			 * @method BinaryHeap.peek
			 * @desc Return, but do not remove, the minimum element in the binary heap.
			 * @returns {*}
			 */
			BinaryHeap.prototype.peek = function () {
				return this.heap[0];
			};

			/**
			 * @method BinaryHeap.pop
			 * @desc Remove and return the minimum element in the binary heap.
			 * @returns {*}
			 */
			BinaryHeap.prototype.pop = function () {
				var front = this.heap[0],
					end = this.heap.pop();
				if (this.heap.length > 0) {
					this.heap[0] = end;
					bubbleDown(this.heap, this.weightFunc, 0);
				}
				return front;
			};

			/**
			 * @method BinaryHeap.remove
			 * @desc Remove the first node in the priority queue that satisfies angular.equals comparison with
			 * the given node.
			 * @param {*} node The node to remove.
			 * @returns {*} The removed node.
			 */
			BinaryHeap.prototype.remove = function (node) {
				var length = this.heap.length;
				for (var i = 0; i < length; i++) {
					if (angular.equals(this.heap[i], node)) {
						var removed = this.heap[i],
							end = this.heap.pop();
						if (i !== length - 1) {
							this.heap[i] = end;
							bubbleUp(this.heap, this.weightFunc, i);
							bubbleDown(this.heap, this.weightFunc, i);
						}
						return removed;
					}
				}
				return null;
			};

			/**
			 * @method BinaryHeap.removeAll
			 * @desc Remove all nodes from this BinaryHeap.
			 */
			BinaryHeap.prototype.removeAll = function () {
				this.heap = [];
			};

			/**
			 * @method BinaryHeap.size
			 * @desc Return the size of the priority queue.
			 * @returns {number} The size of the priority queue.
			 */
			BinaryHeap.prototype.size = function () {
				return this.heap.length;
			};

			return BinaryHeap;
		};
	}

	angular.module('jmdobry.binary-heap').provider('BinaryHeap', BinaryHeapProvider);

	/**
	 * @desc Provides an $AngularCacheFactoryProvider, which gives you the ability to use an
	 *       $angularCacheFactory. The $angularCacheFactory produces AngularCache objects, which
	 *       the same abilities as the cache objects that come with Angular, except with some added
	 *       functionality.
	 */
	angular.module('jmdobry.angular-cache', ['ng', 'jmdobry.binary-heap']);

	/**
	 * @class $AngularCacheFactoryProvider
	 * @desc Provider for the $angularCacheFactory.
	 * @see {@link http://docs.angularjs.org/api/ng.$cacheFactory|ng.$cacheFactory}
	 */
	function $AngularCacheFactoryProvider() {

		var cacheDefaults,
			DEFAULTS = function () {
				return {
					capacity: Number.MAX_VALUE,
					maxAge: null,
					deleteOnExpire: 'none',
					onExpire: null,
					cacheFlushInterval: null,
					recycleFreq: 1000,
					storageMode: 'none',
					storageImpl: null,
					verifyIntegrity: true,
					disabled: false
				};
			};

		/**
		 * @method _validateNumberOption
		 * @desc Validates the given number option.
		 * @param {number} option The number option to check.
		 * @param {function} cb Callback function
		 */
		function _validateNumberOption(option, cb) {
			if (!angular.isNumber(option)) {
				cb('must be a number!');
			} else if (option < 0) {
				cb('must be greater than zero!');
			} else {
				cb(null);
			}
		}

		/**
		 * @method $AngularCacheFactoryProvider.setCacheDefaults
		 * @desc Set the default configuration for all caches created by $angularCacheFactory.
		 * @param {object} options
		 */
		this.setCacheDefaults = function (options) {
			var errStr = '$angularCacheFactoryProvider.setCacheDefaults(options): ';
			options = options || {};

			if (!angular.isObject(options)) {
				throw new Error(errStr + 'options: must be an object!');
			}

			if ('disabled' in options) {
				options.disabled = options.disabled === true;
			}

			if ('capacity' in options) {
				_validateNumberOption(options.capacity, function (err) {
					if (err) {
						throw new Error(errStr + 'capacity: ' + err);
					}
				});
			}

			if ('deleteOnExpire' in options) {
				if (!angular.isString(options.deleteOnExpire)) {
					throw new Error(errStr + 'deleteOnExpire: must be a string!');
				} else if (options.deleteOnExpire !== 'none' && options.deleteOnExpire !== 'passive' && options.deleteOnExpire !== 'aggressive') {
					throw new Error(errStr + 'deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
				}
			}

			if ('maxAge' in options) {
				_validateNumberOption(options.maxAge, function (err) {
					if (err) {
						throw new Error(errStr + 'maxAge: ' + err);
					}
				});
			}

			if ('recycleFreq' in options) {
				_validateNumberOption(options.recycleFreq, function (err) {
					if (err) {
						throw new Error(errStr + 'recycleFreq: ' + err);
					}
				});
			}

			if ('cacheFlushInterval' in options) {
				_validateNumberOption(options.cacheFlushInterval, function (err) {
					if (err) {
						throw new Error(errStr + 'cacheFlushInterval: ' + err);
					}
				});
			}

			if ('storageMode' in options) {
				if (!angular.isString(options.storageMode)) {
					throw new Error(errStr + 'storageMode: must be a string!');
				} else if (options.storageMode !== 'none' && options.storageMode !== 'localStorage' && options.storageMode !== 'sessionStorage') {
					throw new Error(errStr + 'storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
				}
				if ('storageImpl' in options) {
					if (!angular.isObject(options.storageImpl)) {
						throw new Error(errStr + 'storageImpl: must be an object!');
					} else if (!('setItem' in options.storageImpl) || typeof options.storageImpl.setItem !== 'function') {
						throw new Error(errStr + 'storageImpl: must implement "setItem(key, value)"!');
					} else if (!('getItem' in options.storageImpl) || typeof options.storageImpl.getItem !== 'function') {
						throw new Error(errStr + 'storageImpl: must implement "getItem(key)"!');
					} else if (!('removeItem' in options.storageImpl) || typeof options.storageImpl.removeItem !== 'function') {
						throw new Error(errStr + 'storageImpl: must implement "removeItem(key)"!');
					}
				}
			}

			if ('onExpire' in options) {
				if (typeof options.onExpire !== 'function') {
					throw new Error(errStr + 'onExpire: must be a function!');
				}
			}

			cacheDefaults = angular.extend({}, DEFAULTS(), options);
		};

		// Initialize cacheDefaults with the defaults
		this.setCacheDefaults({});

		/**
		 * @ignore
		 */
		this.$get = ['$window', 'BinaryHeap', function ($window, BinaryHeap) {
			var caches = {};

			/**
			 * Stringify a number.
			 * @param {number|*} number The number to be stringified.
			 * @returns {*} number or a string.
			 * @private
			 */
			function _stringifyNumber(number) {
				if (number && angular.isNumber(number)) {
					return number.toString();
				}
				return number;
			}

			/**
			 * @method _keySet
			 * @desc Returns an object of the keys of the given collection.
			 * @param {object} collection The collection from which to get the set of keys.
			 * @returns {object} A hash of the keys of the given collection.
			 */
			function _keySet(collection) {
				var keySet = {}, key;
				for (key in collection) {
					if (collection.hasOwnProperty(key)) {
						keySet[key] = key;
					}
				}
				return keySet;
			}

			/**
			 * @method _keys
			 * @desc Returns an array of the keys of the given collection.
			 * @param {object} collection The collection from which to get the keys.
			 * @returns {array} An array of the keys of the given collection.
			 */
			function _keys(collection) {
				var keys = [], key;
				for (key in collection) {
					if (collection.hasOwnProperty(key)) {
						keys.push(key);
					}
				}
				return keys;
			}

			/**
			 * @class AngularCache
			 * @desc Instantiated via <code>$angularCacheFactory(cacheId[, options])</code>
			 * @param {string} cacheId The id of the new cache.
			 * @param {object} [options] See [Configuration Options]{@link https://github.com/jmdobry/angular-cache#configuration}.
			 */
			function AngularCache(cacheId, options) {
				var config = angular.extend({}, { id: cacheId }),
					data = {},
					expiresHeap = new BinaryHeap(function (x) {
						return x.expires;
					}),
					lruHeap = new BinaryHeap(function (x) {
						return x.accessed;
					}),
					prefix = 'angular-cache.caches.' + cacheId,
					cacheDirty = false,
					self = this,
					storage = null;

				options = options || {};

				/**
				 * @method _setCapacity
				 * @desc Set the capacity for this cache.
				 * @param {number} capacity The new capacity for this cache.
				 */
				function _setCapacity(capacity) {
					_validateNumberOption(capacity, function (err) {
						if (err) {
							throw new Error('capacity: ' + err);
						} else {
							config.capacity = capacity;
							while (lruHeap.size() > config.capacity) {
								self.remove(lruHeap.peek().key, { verifyIntegrity: false });
							}
						}
					});
				}

				/**
				 * @method _setDeleteOnExpire
				 * @desc Set the deleteOnExpire setting for this cache.
				 * @param {string} deleteOnExpire The new deleteOnExpire for this cache.
				 */
				function _setDeleteOnExpire(deleteOnExpire) {
					if (!angular.isString(deleteOnExpire)) {
						throw new Error('deleteOnExpire: must be a string!');
					} else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
						throw new Error('deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
					} else {
						config.deleteOnExpire = deleteOnExpire;
					}
				}

				/**
				 * @method _setMaxAge
				 * @desc Set the maxAge for this cache.
				 * @param {number} maxAge The new maxAge for this cache.
				 */
				function _setMaxAge(maxAge) {
					var keys = _keys(data);
					if (maxAge === null) {
						if (config.maxAge) {
							for (var i = 0; i < keys.length; i++) {
								var key = keys[i];
								if (!('maxAge' in data[key])) {
									delete data[key].expires;
									expiresHeap.remove(data[key]);
								}
							}
						}
						config.maxAge = maxAge;
					} else {
						_validateNumberOption(maxAge, function (err) {
							if (err) {
								throw new Error('maxAge: ' + err);
							} else {
								if (maxAge !== config.maxAge) {
									config.maxAge = maxAge;
									var now = new Date().getTime();
									for (var i = 0; i < keys.length; i++) {
										var key = keys[i];
										if (!('maxAge' in data[key])) {
											expiresHeap.remove(data[key]);
											data[key].expires = data[key].created + config.maxAge;
											expiresHeap.push(data[key]);
											if (data[key].expires < now) {
												self.remove(key, { verifyIntegrity: false });
											}
										}
									}
								}
							}
						});
					}
				}

				/**
				 * @method _flushExpired
				 * @desc Remove expired items from the expiresHeap.
				 * @private
				 */
				function _flushExpired() {
					var now = new Date().getTime(),
						item = expiresHeap.peek();

					while (item && item.expires && item.expires < now) {
						self.remove(item.key, { verifyIntegrity: false });
						if (config.onExpire) {
							config.onExpire(item.key, item.value);
						}
						item = expiresHeap.peek();
					}
				}

				/**
				 * @method _setRecycleFreq
				 * @desc Set the recycleFreq setting for this cache.
				 * @param {number} recycleFreq The new recycleFreq for this cache.
				 */
				function _setRecycleFreq(recycleFreq) {
					if (recycleFreq === null) {
						if (config.recycleFreqId) {
							clearInterval(config.recycleFreqId);
							delete config.recycleFreqId;
						}
						config.recycleFreq = cacheDefaults.recycleFreq;
						config.recycleFreqId = setInterval(_flushExpired, config.recycleFreq);
					} else {
						_validateNumberOption(recycleFreq, function (err) {
							if (err) {
								throw new Error('recycleFreq: ' + err);
							} else {
								config.recycleFreq = recycleFreq;
								if (config.recycleFreqId) {
									clearInterval(config.recycleFreqId);
								}
								config.recycleFreqId = setInterval(_flushExpired, config.recycleFreq);
							}
						});
					}
				}

				/**
				 * @method _setCacheFlushInterval
				 * @desc Set the cacheFlushInterval for this cache.
				 * @param {number} cacheFlushInterval The new cacheFlushInterval for this cache.
				 */
				function _setCacheFlushInterval(cacheFlushInterval) {
					if (cacheFlushInterval === null) {
						if (config.cacheFlushIntervalId) {
							clearInterval(config.cacheFlushIntervalId);
							delete config.cacheFlushIntervalId;
						}
						config.cacheFlushInterval = cacheFlushInterval;
					} else {
						_validateNumberOption(cacheFlushInterval, function (err) {
							if (err) {
								throw new Error('cacheFlushInterval: ' + err);
							} else {
								if (cacheFlushInterval !== config.cacheFlushInterval) {
									if (config.cacheFlushIntervalId) {
										clearInterval(config.cacheFlushIntervalId);
									}
									config.cacheFlushInterval = cacheFlushInterval;
									config.cacheFlushIntervalId = setInterval(self.removeAll, config.cacheFlushInterval);
								}
							}
						});
					}
				}

				/**
				 * @method _setStorageMode
				 * @desc Configure the cache to use localStorage.
				 * @param {string} storageMode "localStorage"|"sessionStorage"|null
				 * @param {object} storageImpl The storage polyfill/replacement to use.
				 */
				function _setStorageMode(storageMode, storageImpl) {
					var keys, i;
					if (!angular.isString(storageMode)) {
						throw new Error('storageMode: must be a string!');
					} else if (storageMode !== 'none' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
						throw new Error('storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
					}
					if ((config.storageMode === 'localStorage' || config.storageMode === 'sessionStorage') &&
						(storageMode !== config.storageMode)) {
						keys = _keys(data);
						for (i = 0; i < keys.length; i++) {
							storage.removeItem(prefix + '.data.' + keys[i]);
						}
						storage.removeItem(prefix + '.keys');
					}
					config.storageMode = storageMode;
					if (storageImpl) {
						if (!angular.isObject(storageImpl)) {
							throw new Error('storageImpl: must be an object!');
						} else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
							throw new Error('storageImpl: must implement "setItem(key, value)"!');
						} else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
							throw new Error('storageImpl: must implement "getItem(key)"!');
						} else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
							throw new Error('storageImpl: must implement "removeItem(key)"!');
						}
						storage = storageImpl;
					} else if (config.storageMode === 'localStorage') {
						storage = $window.localStorage;
					} else if (config.storageMode === 'sessionStorage') {
						storage = $window.sessionStorage;
					}

					if (config.storageMode !== 'none' && storage) {
						if (!cacheDirty) {
							_loadCacheConfig();
						} else {
							keys = _keys(data);
							for (i = 0; i < keys.length; i++) {
								_syncToStorage(keys[i]);
							}
						}
					}
				}

				/**
				 * @method _setOptions
				 * @desc Configure this cache with the given options.
				 * @param {object} cacheOptions New configuration options for the cache.
				 * @param {boolean} [strict] If true then any existing configuration will be reset to default before
				 * applying the new options, otherwise only the options specified in the options hash will be altered.
				 * @param {object} [options] Configuration.
				 */
				function _setOptions(cacheOptions, strict, options) {
					cacheOptions = cacheOptions || {};
					options = options || {};
					strict = !!strict;
					if (!angular.isObject(cacheOptions)) {
						throw new Error('AngularCache.setOptions(cacheOptions, strict, options): cacheOptions: must be an object!');
					}

					_verifyIntegrity(options.verifyIntegrity);

					if (strict) {
						cacheOptions = angular.extend({}, cacheDefaults, cacheOptions);
					}

					if ('disabled' in cacheOptions) {
						config.disabled = cacheOptions.disabled === true;
					}
					if ('verifyIntegrity' in cacheOptions) {
						config.verifyIntegrity = cacheOptions.verifyIntegrity === true;
					}
					if ('capacity' in cacheOptions) {
						_setCapacity(cacheOptions.capacity);
					}

					if ('deleteOnExpire' in cacheOptions) {
						_setDeleteOnExpire(cacheOptions.deleteOnExpire);
					}

					if ('maxAge' in cacheOptions) {
						_setMaxAge(cacheOptions.maxAge);
					}

					if ('recycleFreq' in cacheOptions) {
						_setRecycleFreq(cacheOptions.recycleFreq);
					}

					if ('cacheFlushInterval' in cacheOptions) {
						_setCacheFlushInterval(cacheOptions.cacheFlushInterval);
					}

					if ('storageMode' in cacheOptions) {
						_setStorageMode(cacheOptions.storageMode, cacheOptions.storageImpl);
					}

					if ('onExpire' in cacheOptions) {
						if (cacheOptions.onExpire !== null && typeof cacheOptions.onExpire !== 'function') {
							throw new Error('onExpire: must be a function!');
						}
						config.onExpire = cacheOptions.onExpire;
					}

					cacheDirty = true;
				}

				/**
				 * @method _loadCacheConfig
				 * @desc If storageMode is set, attempt to load previous cache configuration from localStorage.
				 */
				function _loadCacheConfig() {
					var keys = angular.fromJson(storage.getItem(prefix + '.keys'));
					storage.removeItem(prefix + '.keys');
					if (keys && keys.length) {
						for (var i = 0; i < keys.length; i++) {
							var data = angular.fromJson(storage.getItem(prefix + '.data.' + keys[i])) || {},
								maxAge = data.maxAge || config.maxAge,
								deleteOnExpire = data.deleteOnExpire || config.deleteOnExpire;
							if (maxAge && ((new Date().getTime() - data.created) > maxAge) && deleteOnExpire === 'aggressive') {
								storage.removeItem(prefix + '.data.' + keys[i]);
							} else {
								var options = {
									created: data.created
								};
								if (data.expires) {
									options.expires = data.expires;
								}
								if (data.accessed) {
									options.accessed = data.accessed;
								}
								if (data.maxAge) {
									options.maxAge = data.maxAge;
								}
								if (data.deleteOnExpire) {
									options.deleteOnExpire = data.deleteOnExpire;
								}
								self.put(keys[i], data.value, options);
							}
						}
						_syncToStorage(null);
					}
				}

				/**
				 * @method _syncToStorage
				 * @desc If storageMode is set, sync to localStorage.
				 * @param {string} key The identifier of the item to sync.
				 */
				function _syncToStorage(key) {
					if (config.storageMode !== 'none' && storage) {
						storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
						if (key) {
							storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
						}
					}
				}

				function _verifyIntegrity(verifyIntegrity) {
					if (verifyIntegrity || (verifyIntegrity !== false && config.verifyIntegrity)) {
						if (config.storageMode !== 'none' && storage) {
							var keys = _keys(data);
							storage.setItem(prefix + '.keys', angular.toJson(keys));
							for (var i = 0; i < keys.length; i++) {
								storage.setItem(prefix + '.data.' + keys[i], angular.toJson(data[keys[i]]));
							}
						}
					}
				}

				function _saveKeysToStorage(keys) {
					if (config.storageMode !== 'none' && storage) {
						var keysToSave = keys || _keys(data);
						storage.setItem(prefix + '.keys', angular.toJson(keysToSave));
					}
				}

				function _saveItemToStorage(key) {
					if (config.storageMode !== 'none' && storage) {
						storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
					}
				}

				function _removeAllFromStorage() {
					if (config.storageMode !== 'none' && storage) {
						var keys = _keys(data);
						for (var i = 0; i < keys.length; i++) {
							storage.removeItem(prefix + '.data.' + keys[i]);
						}
						storage.setItem(prefix + '.keys', angular.toJson([]));
					}
				}

				/**
				 * @method AngularCache.put
				 * @desc Add a key-value pair to the cache.
				 * @param {string} key The identifier for the item to add to the cache.
				 * @param {*} value The value of the item to add to the cache.
				 * @param {object} [options] {{ maxAge: {number}, deleteOnExpire: {string} }}
				 * @returns {*} value The value of the item added to the cache.
				 */
				this.put = function (key, value, options) {
					if (config.disabled) {
						return;
					}
					options = options || {};

					key = _stringifyNumber(key);

					if (!angular.isString(key)) {
						throw new Error('AngularCache.put(key, value, options): key: must be a string!');
					} else if (options && !angular.isObject(options)) {
						throw new Error('AngularCache.put(key, value, options): options: must be an object!');
					} else if (options.maxAge && options.maxAge !== null) {
						_validateNumberOption(options.maxAge, function (err) {
							if (err) {
								throw new Error('AngularCache.put(key, value, options): maxAge: ' + err);
							}
						});
					} else if (options.deleteOnExpire && !angular.isString(options.deleteOnExpire)) {
						throw new Error('AngularCache.put(key, value, options): deleteOnExpire: must be a string!');
					} else if (options.deleteOnExpire && options.deleteOnExpire !== 'none' && options.deleteOnExpire !== 'passive' && options.deleteOnExpire !== 'aggressive') {
						throw new Error('AngularCache.put(key, value, options): deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
					} else if (angular.isUndefined(value)) {
						return;
					}

					var now = new Date().getTime(),
						deleteOnExpire, item;

					_verifyIntegrity(options.verifyIntegrity);

					if (data[key]) {
						expiresHeap.remove(data[key]);
						lruHeap.remove(data[key]);
					} else {
						data[key] = { key: key };
					}

					item = data[key];
					item.value = value;
					item.created = (parseInt(options.created, 10)) || item.created || now;
					item.accessed = (parseInt(options.accessed, 10)) || now;

					if (options.deleteOnExpire) {
						item.deleteOnExpire = options.deleteOnExpire;
					}
					if (options.maxAge) {
						item.maxAge = options.maxAge;
					}

					if (item.maxAge || config.maxAge) {
						item.expires = item.created + (item.maxAge || config.maxAge);
					}

					deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

					if (item.expires && deleteOnExpire === 'aggressive') {
						expiresHeap.push(item);
					}

					// Sync with localStorage, etc.
					_saveKeysToStorage();
					_saveItemToStorage(key);

					lruHeap.push(item);

					if (lruHeap.size() > config.capacity) {
						this.remove(lruHeap.peek().key, { verifyIntegrity: false });
					}

					return value;
				};

				/**
				 * @method AngularCache.get
				 * @desc Retrieve the item from the cache with the specified key.
				 * @param {string|Array} key The key of the item to retrieve or an array of keys of items to retrieve.
				 * @param {object} [options] Configuration.
				 * @returns {*} The value of the item in the cache with the specified key.
				 */
				this.get = function (key, options) {
					if (config.disabled) {
						return;
					}
					if (angular.isArray(key)) {
						var keys = key,
							values = [];

						angular.forEach(keys, function (key) {
							var value = self.get(key, options);
							if (angular.isDefined(value)) {
								values.push(value);
							}
						});

						return values;
					} else {
						key = _stringifyNumber(key);
					}

					options = options || {};
					if (!angular.isString(key)) {
						throw new Error('AngularCache.get(key, options): key: must be a string!');
					} else if (options && !angular.isObject(options)) {
						throw new Error('AngularCache.get(key, options): options: must be an object!');
					} else if (options.onExpire && !angular.isFunction(options.onExpire)) {
						throw new Error('AngularCache.get(key, options): onExpire: must be a function!');
					} else if (!(key in data)) {
						return;
					}

					_verifyIntegrity(options.verifyIntegrity);

					var item = data[key],
						value = item.value,
						now = new Date().getTime(),
						deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

					lruHeap.remove(item);
					item.accessed = now;
					lruHeap.push(item);

					if (deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
						this.remove(key, { verifyIntegrity: false });

						if (config.onExpire) {
							config.onExpire(key, item.value, (options.onExpire));
						} else if (options.onExpire) {
							options.onExpire(key, item.value);
						}
						value = undefined;
					}

					_saveItemToStorage(key);

					return value;
				};

				/**
				 * @method AngularCache.remove
				 * @desc Remove the item with the specified key from the cache.
				 * @param {string} key The key of the item to remove.
				 * @param {object} [options] Configuration.
				 */
				this.remove = function (key, options) {
					options = options || {};
					_verifyIntegrity(options.verifyIntegrity);
					lruHeap.remove(data[key]);
					expiresHeap.remove(data[key]);
					if (config.storageMode !== 'none' && storage) {
						storage.removeItem(prefix + '.data.' + key);
					}
					delete data[key];
					_saveKeysToStorage();
				};

				/**
				 * @method AngularCache.removeAll
				 * @desc Clear the cache.
				 */
				this.removeAll = function () {
					_removeAllFromStorage();
					lruHeap.removeAll();
					expiresHeap.removeAll();
					data = {};
				};

				/**
				 * @method AngularCache.removeExpired
				 * @desc Remove all expired items from the cache.
				 * @param {object} [options] Configuration.
				 * @returns {object|array} Object or array of removed items.
				 */
				this.removeExpired = function (options) {
					options = options || {};
					var now = new Date().getTime(),
						keys = _keys(data),
						expired = {};

					for (var i = 0; i < keys.length; i++) {
						if (data[keys[i]] && data[keys[i]].expires && data[keys[i]].expires < now) {
							expired[keys[i]] = data[keys[i]].value;
						}
					}
					for (var key in expired) {
						self.remove(key);
					}
					_verifyIntegrity(options.verifyIntegrity);
					if (options.asArray) {
						var expiredArray = [];
						for (key in expired) {
							expiredArray.push(expired[key]);
						}
						return expiredArray;
					} else {
						return expired;
					}
				};

				/**
				 * @method AngularCache.destroy
				 * @desc Completely destroy the cache.
				 */
				this.destroy = function () {
					if (config.cacheFlushIntervalId) {
						clearInterval(config.cacheFlushIntervalId);
					}
					if (config.recycleFreqId) {
						clearInterval(config.recycleFreqId);
					}
					this.removeAll();
					if (config.storageMode !== 'none' && storage) {
						storage.removeItem(prefix + '.keys');
						storage.removeItem(prefix);
					}
					storage = null;
					data = null;
					lruHeap = null;
					expiresHeap = null;
					config = null;
					prefix = null;
					self = null;
					var methodKeys = _keys(this);

					// Prevent this cache from being used after it has been destroyed
					for (var i = 0; i < methodKeys.length; i++) {
						if (this.hasOwnProperty(methodKeys[i])) {
							delete this[methodKeys[i]];
						}
					}

					caches[cacheId] = null;
					delete caches[cacheId];
				};

				/**
				 * @method AngularCache.info
				 * @desc Return an object containing information about the cache.
				 * @param {string} [key] The key of the item about which to retrieve information.
				 * @returns {object} stats Object containing information about this cache or the item with the
				 * specified key.
				 */
				this.info = function (key) {
					if (key) {
						if (data[key]) {
							var info = {
								created: data[key].created,
								accessed: data[key].accessed,
								expires: data[key].expires,
								maxAge: data[key].maxAge || config.maxAge,
								deleteOnExpire: data[key].deleteOnExpire || config.deleteOnExpire,
								isExpired: false
							};
							if (info.maxAge) {
								info.isExpired = (new Date().getTime() - info.created) > info.maxAge;
							}
							return info;
						} else {
							return data[key];
						}
					} else {
						return angular.extend({}, config, { size: lruHeap && lruHeap.size() || 0 });
					}
				};

				/**
				 * @method AngularCache.keySet
				 * @desc Return the set of the keys of all items in the cache.
				 * @returns {object} The set of the keys of all items currently in this cache.
				 */
				this.keySet = function () {
					return _keySet(data);
				};

				/**
				 * @method AngularCache.keys
				 * @desc Return an array of the keys of all items in the cache.
				 * @returns {array} An array of the keys of all items in the cache.
				 */
				this.keys = function () {
					return _keys(data);
				};

				/**
				 * @method AngularCache.setOptions
				 * @desc Configure this cache with the given options.
				 * @param {object} cacheOptions
				 * @param {boolean} [strict] If true then any existing configuration will be reset to defaults before
				 * applying the new options, otherwise only the options specified in the hash will be altered.
				 * @param {object} [options] Configuration.
				 */
				this.setOptions = _setOptions;

				// Initialize this cache with the default and given options
				_setOptions(options, true, { verifyIntegrity: false });
			}

			/**
			 * @class AngularCacheFactory
			 * @param {string} cacheId The id of the new cache.
			 * @param  {object} [options] See [Configuration Options]{@link https://github.com/jmdobry/angular-cache#configuration}.
			 * @returns {AngularCache}
			 */
			function angularCacheFactory(cacheId, options) {
				if (cacheId in caches) {
					throw new Error('cacheId ' + cacheId + ' taken!');
				} else if (!angular.isString(cacheId)) {
					throw new Error('cacheId must be a string!');
				}

				caches[cacheId] = new AngularCache(cacheId, options);
				return caches[cacheId];
			}

			/**
			 * @method AngularCacheFactory.info
			 * @desc Return an object containing information about all caches in $angularCacheFactory.
			 * @returns {object} An object containing information about all caches of this factory.
			 */
			angularCacheFactory.info = function () {
				var keys = _keys(caches);
				var info = {
					size: keys.length,
					caches: {}
				};
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					info.caches[key] = caches[key].info();
				}
				info.cacheDefaults = angular.extend({}, cacheDefaults);
				return info;
			};

			/**
			 * @method AngularCacheFactory.get
			 * @desc Return the cache with the specified cacheId.
			 * @param {string} cacheId The id of the desired cache.
			 * @returns {AngularCache} The cache with the specified cachedId.
			 */
			angularCacheFactory.get = function (cacheId) {
				if (!angular.isString(cacheId)) {
					throw new Error('$angularCacheFactory.get(cacheId): cacheId: must be a string!');
				}
				return caches[cacheId];
			};

			/**
			 * @method AngularCacheFactory.keySet
			 * @desc Return the set of keys of all current caches owned by angularCacheFactory.
			 * @returns {object} The set of keys associated with all current caches owned by this
			 * angularCacheFactory.
			 */
			angularCacheFactory.keySet = function () {
				return _keySet(caches);
			};

			/**
			 * @method AngularCacheFactory.keys
			 * @desc Return an array of the keys of all caches owned by angularCacheFactory.
			 * @returns {array} An array of the keys associated with all current caches owned by
			 * this angularCacheFactory.
			 */
			angularCacheFactory.keys = function () {
				return _keys(caches);
			};

			/**
			 * @method AngularCacheFactory.removeAll
			 * @desc Destroy all caches in $angularCacheFactory.
			 */
			angularCacheFactory.removeAll = function () {
				var keys = _keys(caches);
				for (var i = 0; i < keys.length; i++) {
					caches[keys[i]].destroy();
				}
			};

			/**
			 * @method AngularCacheFactory.clearAll
			 * @desc Clears the contents of every cache in $angularCacheFactory.
			 */
			angularCacheFactory.clearAll = function () {
				var keys = _keys(caches);
				for (var i = 0; i < keys.length; i++) {
					caches[keys[i]].removeAll();
				}
			};

			/**
			 * @method AngularCacheFactory.enableAll
			 * @desc Enable any disabled caches.
			 */
			angularCacheFactory.enableAll = function () {
				var keys = _keys(caches);
				for (var i = 0; i < keys.length; i++) {
					caches[keys[i]].setOptions({ disabled: false });
				}
			};

			/**
			 * @method AngularCacheFactory.disableAll
			 * @desc Disable all caches.
			 */
			angularCacheFactory.disableAll = function () {
				var keys = _keys(caches);
				for (var i = 0; i < keys.length; i++) {
					caches[keys[i]].setOptions({ disabled: true });
				}
			};

			return angularCacheFactory;
		}];
	}

	// Register the new provider with Angular.
	angular.module('jmdobry.angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
