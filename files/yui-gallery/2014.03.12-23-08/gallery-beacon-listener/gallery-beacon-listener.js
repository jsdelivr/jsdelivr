YUI.add('gallery-beacon-listener', function (Y, NAME) {

"use strict";
/**
 * @example
 *	var picListener = new Y.BeaconListener({
 *		beacons:'.pic-beacon' //listen for all pic-beacons in the viewport
 *	});
 *
 *	picListener.on('found', function(e){
 *		e.beacon.src = e.beacon.getData('img-src');
 *
 *		new Y.Anim({
 *			node:e.beacon,
 *			from: {
 *				opacity: 0
 *			},
 *			to: {
 *				opacity: 1
 *			}
 *		}).run();
 *	});
 *
 *	picListener.start();
 *
 * @module gallery-beacon-listener
 * @class BeaconListener
 * @author Kris Kelly
 * @description Beacon listeners are simple classes that will periodically check for an element or elements within their defined region
 */


	var
		MIN_TIMER_VAL = 1,
		EVENT_TYPE_FOUND = 'beaconlistener:found',
		EVENT_TYPE_LOST = 'beaconlistener:lost',
		Lang = Y.Lang,
		DOM = Y.DOM,
		TOP = 'top',
		RIGHT = 'right',
		BOTTOM = 'bottom',
		LEFT = 'left';


	Y.BeaconListener = Y.Base.create('beaconListener', Y.Base, [], {
		_isListening: false,
		_timerHandle: null,
		_pollInterval: 100,
		_region: null,//a cache of the region for this listener
		_beaconList: null,
		_beaconStates: [],
		_beaconDOMNodes: [],
		_fullyInside: false,

		/**
		 * Constructor for the listener class
		 * @private
		 * @param {object} config
		 * @return null
		 * @method initializer
		 *****************/
		initializer: function(config){
			config = config || {
				beacons: '.beacon',
				region: null
			};
			var me = this,
				beacons = config.beacons,
				region = config.region;

			me.publish(EVENT_TYPE_FOUND, {
				context: me,
				broadcast: true,
				emitFacade: true
			});

			me.publish(EVENT_TYPE_LOST, {
				context: me,
				broadcast: true,
				emitFacade: true
			});

			//LISTEN TO
			me.after('beaconlistener:beaconsChange', me._handleBeaconsChange);
			if ( beacons ){
				me._handleBeaconsChange();
			}
			//REGION
			me.after('beaconlistener:regionChange', me._handleRegionChange);
			if ( region ){
				me._handleRegionChange();
			}

			//poll interval
			me.after('beaconlistener:pollIntervalChange', me._handlePollIntervalChange);

			Y.on('windowresize', function(){ me._handleRegionChange();  });

			me.after('beaconlistener:fullyInsideChange', me._handleFullyInsideChange);

			me._handleFullyInsideChange();//force setting of internal property

			if (me.get('autoStart')){
				me.start();
				//fire off a check now
				Y.later(
					me.get('pollInterval'),
					me,
					me.check,
					null,
					false
				);
			}
		},

		/**
		* Stop listening for beacons
		*
		* @method stop
		*****************/
		stop: function(){
			var me = this;
			if (me._isListening === true && me._timerHandle !== null){
				me._timerHandle.cancel();
				me._timerHandle = null;
				me._isListening = false;
			}
		},

		/**
		 * Start listening for beacons
		 *
		 * @method start
		 *****************/
		start: function(){
			var me = this;
			if (
				Lang.isUndefined( me._timerHandler )
				&& !Lang.isUndefined( me._beaconList )
				&& me._beaconList !== null
			){
				me._isListening = true;
				me._timerHandle = Y.later(
					me.get('pollInterval'),
					me,
					me.check,
					null,
					true
				);
			}
		},

		/**
		 * Check for beacons in the region
		 *
		 * @method check
		 *****************/
		check: function(){
			var me = this,
				region = me._region,
				testMethod;

			if (region === null){
				testMethod = DOM.inViewportRegion;
			} else {
				me._handleRegionChange();//since the scroll pos can change the region
				region = me._region;
				testMethod = DOM.inRegion;
			}

			me._beaconList.each(function(node, index){
				var testNode = me._beaconDOMNodes[index], inRegion, args;

				if (region === null){
					args = [testNode, me._fullyInside];
				} else {
					args = [testNode, region, me._fullyInside];
				}

				inRegion = testMethod.apply(me, args);

				if ( inRegion && !me._beaconStates[index] ){
					//if we encounter a beacon and it wasn't previously in the region
					me._beaconStates[index] = true;
					me.fire( EVENT_TYPE_FOUND, {listener: me, beacon: node} );

				} else if ( !inRegion && me._beaconStates[index]){
					//if we encounter a beacon and it was in the region
					me._beaconStates[index] = false;
					me.fire( EVENT_TYPE_LOST, {listener: me, beacon: node} );
				}
			});
		},

		/**
		 * Check if the listener is listening
		 *
		 * @method isListening
		 **********************/
		isListening: function(){
			return this._isListening;
		},

		/**
		 * @private
		 * @method _handleFullyInsideChange
		 **********************/
		_handleFullyInsideChange: function(){
			var me = this;
			//store the fullyInside property internally
			me._fullyInside = me.get('fullyInside');
		},

		/**
		 * @private
		 * @method _handleRegionChange
		 *****************/
		_handleRegionChange: function(){
			var me = this,
				region = me.get('region');
			me.recalcRegion(region);
		},

		/**
		 * Recalculate the region
		 * The the region is a valid object then the current region will be overwritten
		 *
		 * @param region (optional)
		 * @method recalcRegion
		 *****************/
		recalcRegion: function(region){
			var me = this,
				newRegion;

			if ( Y.Lang.isUndefined( region ) ){
				region = me._region;
			}

			if ( Lang.isObject( region ) ){
				if (
					Lang.isNumber( region[TOP] )
					&& Lang.isNumber( region[RIGHT] )
					&& Lang.isNumber( region[BOTTOM] )
					&& Lang.isNumber( region[LEFT] )
				) {
					me._region = region;
					return;
				} else {
					region = Y.one( region );

					if ( region ){
						if (region.getDOMNode){
							newRegion = DOM.region(region.getDOMNode());
						} else {
							newRegion = DOM.region(region);
						}

						if (newRegion){
							me._region = newRegion;
							return;
						}
					}
				}
			}
			//defult to the viewport
			me._region = null;
		},

		/**
		 * @private
		 * @method _handleBeaconsChange
		 *****************/
		_handleBeaconsChange: function(){
			var me = this,
				beacons = me.get('beacons');

			me._beaconStates = [];
			me._beaconDOMNodes = [];
			me._beaconList = me._getList(beacons);

			if ( me._beaconList && me._beaconList.size() > 0 ){
				me._beaconList.each(function(node, index){
					me._beaconStates[index] = false;
					me._beaconDOMNodes[index] = node.getDOMNode();
				});
			}

		},

		/**
		 * @private
		 * @return NodeList|null
		 * @method _getList
		 *****************/
		_getList: function(val){
			var temp;

			if ( Lang.isString( val ) ){ //assume it's a selector
				return Y.all(val);
			}

			if ( Lang.isObject( val ) && val.nodes ) {//if it's a nodelist
				return val;
			}

			temp = Y.one( val );
			if (temp){
				return new Y.NodeList(temp);
			}
			return null;
		},

		/**
		 * @private
		 * @method _handlePollIntervalChange
		 *****************/
		_handlePollIntervalChange: function(){
			var me = this;
			me._pollInterval = me.get('pollInterval');
		}
	}, {
		ATTRS: {
			/**
			* Number of milliseconds between checks
			*
			* @attribute pollInterval
			* @type Integer
			*/
			"pollInterval": {
				value:100,
				validator: function( val ){
					return ( Lang.isNumber(val) && val > MIN_TIMER_VAL );
				}
			},
			/**
			* Defines the region within which the listener will check for beacons.
			*
			* @attribute region
			* @type Node|Object|null
			*/
			"region": { //can be a node or region object
				value: null, //if region is null then the viewport will be used
				validator: function(val){
					return ( val === null || Y.one( val ) );
				}
			},
			/**
			* A selector, Node or NodeList that will be used to determine the beacons this listener observes
			*
			* @attribute beacons
			* @type String|Node|NodeList
			*/
			"beacons": {
				value: '.beacon',
				validator: function(val){
					return (!Lang.isUndefined(val) && val !== null);
				}
			},
			/**
			* If true, then the beacon must be fully contained within the region
			*
			* @attribute fullyInside
			* @type Boolean
			*/
			"fullyInside": {
				value:false,
				validator: function( val ){
					return Lang.isBoolean(val);
				}
			},
			/**
			* If true, the start method will be called as soon as the class is initialised
			*
			* @attribute autoStart
			* @type Boolean
			*/
			"autoStart": {
				value:false,
				validator: function( val ){
					return Lang.isBoolean(val);
				}
			}
		}
	});



}, 'gallery-2013.06.20-02-07', {"requires": ["node", "event-custom", "event-resize", "base-build", "dom"]});
