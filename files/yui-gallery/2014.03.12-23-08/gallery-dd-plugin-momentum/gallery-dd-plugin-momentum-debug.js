YUI.add('gallery-dd-plugin-momentum', function (Y, NAME) {

    /**
     * Plugin for the DD utility that adds momentum to dragged elements.
     * @class DDMomentumPlugin
     */
    function DDMomentumPlugin(config) {
        DDMomentumPlugin.superclass.constructor.apply(this, arguments);
    }

    DDMomentumPlugin.NAME = "DDMomentumPlugin";
    DDMomentumPlugin.NS = "as";
    DDMomentumPlugin.ATTRS = {};

    Y.extend(DDMomentumPlugin, Y.Plugin.Base, {
        initializer: function (config) {
            // RequestAnimationFrame shim ala Paul Irish & MDN.
            if (!window.requestAnimationFrame) {

                window.requestAnimationFrame = (function () {
                    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                }());
            }

            this.publish("end");

            /* Instance attributes that do not need to fire 'change' events */
            // max velocity to allow in px per animation frame
            this._maxVelocity = config.maxVelocity || 3;
            // min velocity to require or else end the slide in px per animation frame
            // use typeof to avoid accidental match on 0
            this._minVelocity = typeof config.minVelocity !== "undefined" ? config.minVelocity : 0.2;
            // amount of drag to apply at each frame of animation,
            // 1 == no drag, 0 == infinite drag
            this._drag = typeof config.drag !== "undefined" ? config.drag : 0.92;
            // time-ordered list of drag deltas
            this._deltas = [];
            // how many drag deltas to use to calculate mouse velocity at drag end
            this._deltasToCount = config.deltasToCount || 5;
            // the node to animate
            this._node = config.host.get("dragNode");
            // total pixel offset over the slide
            this._totalDeltaX = 0;
            this._totalDeltaY = 0;
            // drag start position to calculate drag distance
            this._dragStartXY = [];
            // total offset from drag, excluding slide
            this._totalDragOffset = [0, 0];
            // duration of the last set of drag deltas
            this._duration = 0;
            // velocity of the mouse at release time
            this._velocity = 0;
            // flag to indicate delegate drag instead of normal drag
            this._delegate = config.host.name === "delegate";

            /* Event listener references for easy cleanup later */
            this._listenDrag = null;
            this._listenDragEnd = null;
            this._listenDragStart = null;

            this._attachListeners();
        },

        destructor: function () {
            this._detachListeners();
        },

        /**
         * Set up listeners on external elements.
         * @method _attachListeners
         */
        _attachListeners: function () {
            this._listenDragStart = this.afterHostEvent("drag:start", this._handleDragStart, this);
            this._listenDrag = this.afterHostEvent("drag:drag", this._handleDrag, this);
            this._listenDragEnd = this.afterHostEvent("drag:end", this._handleDragEnd, this);
        },

        /**
         * Clean up listeners we have on exterior elements.
         * @method _detachListeners
         */
        _detachListeners: function () {
            Y.detach(this._listenDragStart);
            Y.detach(this._listenDrag);
            Y.detach(this._listenDragEnd);
        },

        /**
         * Reset deltas and get the dragged node if using
         * delegate drag.
         * @method _handleDragStart
         */
        _handleDragStart: function (e) {
            this._velocityXY = [0, 0];
            this._deltas = [];
            this._totalDragOffset = [0, 0];
            this._totalDeltaX = 0;
            this._totalDeltaY = 0;
            this._dragStartXY = [e.pageX, e.pageY];

            // for delegate dragging _node will be undefined
            // at instantiation. Set it here
            if(this._delegate){
                this._node = this.get("host").get("currentNode");
            }
        },


        /**
         * Update the array of drag deltas.
         * @method _handleDrag
         */
        _handleDrag: function (e) {
            e.timeStamp = new Date().getTime();

            // fill the array of deltas
            if (this._deltas.length < this._deltasToCount) {

                this._deltas.push(e);

            } else {
                // remove the first entry
                this._deltas.shift();
                // add a new last entry
                this._deltas.push(e);

            }
        },

        /**
         * Check state and fire the animation if everything is okay.
         * @method _handleDragEnd
         */
        _handleDragEnd: function (e) {
            var startVelocity = [];

            this._totalDragOffset = [
            (e.pageX - this._dragStartXY[0]), (e.pageY - this._dragStartXY[1])];

            // bail if the drag was too short to get a good trajectory and velocity
            if (this._deltas.length !== this._deltasToCount) {
                return;
            }

            // bail if the user stopped moving the mouse more 
            // than 100MS prior to letting go
            if ((new Date().getTime() - this._deltas[this._deltasToCount - 1].timeStamp) > 100) {
                Y.log("[DDMomentumPlugin] end without momentum");
                this.fire("end", {
                    "deltaX": this._totalDragOffset[0],
                    "deltaY": this._totalDragOffset[1]
                });
                return;
            }

            // everything looks okay, get the direction, speed and go
            this._figureDeltaDuration();

            this._figureVelocity();

            this._runFrame({
                "velocityXY": this._velocityXY,
                "scope": this,
                "timeStamp": new Date()
            });
        },

        /**
         * Computes the duration of the final set of deltas so we
         * can accurately track mouse velocity when the user let go.
         * @method _figureDeltaDuration
         */
        _figureDeltaDuration: function () {
            this._duration = this._deltas[(this._deltasToCount - 1)].timeStamp - this._deltas[0].timeStamp;
        },

        /**
         * Computes the velocity of the mouse when the user let go.
         * @method _figureVelocity
         */
        _figureVelocity: function () {
            var avgX = 0,
                avgY = 0,
                i;

            for (i = 0; i < this._deltasToCount; i++) {
                avgX += this._deltas[i].info.delta[0];
                avgY += this._deltas[i].info.delta[1];
            }

            avgX = this._clampVelocity(avgX / this._duration);
            avgY = this._clampVelocity(avgY / this._duration);

            this._velocityXY = [avgX, avgY];
        },

        /**
         * Modifies the current velocity by applying the drag
         * delta to it.
         * @method _applyDrag
         */
        _applyDrag: function (currVelocityXY, drag) {
            var toReturn = [
            Math.abs(currVelocityXY[0] * drag),
            Math.abs(currVelocityXY[1] * drag)];

            if (currVelocityXY[0] < 0) {
                toReturn[0] *= -1;
            }

            if (currVelocityXY[1] < 0) {
                toReturn[1] *= -1;
            }

            return toReturn;
        },

        /**
         * Clamps the velocity to be within the allowed range.
         * @method _clampVelocity
         */
        _clampVelocity: function (potentialVelocity) {
            var clamped;

            clamped = Math.abs(potentialVelocity);

            clamped = Math.max(Math.min(clamped, this._maxVelocity), this._minVelocity);

            if (potentialVelocity < 0) {
                clamped = clamped * -1;
            }

            return clamped;
        },

        /**
         * Move the sliding element one frame's worth of animation and
         * prepare values for the next frame.
         * @method _runFrame
         */
        _runFrame: function (config) {
            var t = config.scope,
                elapsed,
                now = new Date(),
                dx,
                dy;

            elapsed = now - config.timeStamp;

            dx = config.velocityXY[0] * elapsed;
            dy = config.velocityXY[1] * elapsed;

            config.timeStamp = now;

            if (Math.abs(config.velocityXY[0]) >= 0) {
                t._totalDeltaX += Math.floor(dx);
                t._node.setStyle("left", Math.floor((parseInt(t._node.getStyle("left"), 10) + dx)) + "px");
            }

            if (Math.abs(config.velocityXY[1]) >= 0) {
                t._totalDeltaY += Math.floor(dy);
                t._node.setStyle("top", Math.floor((parseInt(t._node.getStyle("top"), 10) + dy)) + "px");
            }

            // Halt check
            if (Math.abs(config.velocityXY[0]) >= t._minVelocity || Math.abs(config.velocityXY[1]) >= t._minVelocity) {
                config.velocityXY = t._applyDrag(config.velocityXY, t._drag);
                window.requestAnimationFrame(function () {
                    t._runFrame(config);
                });
            } else {
                Y.log("[DDMomentumPlugin] end momentum");

                t.fire("end", {
                    "deltaX": t._totalDragOffset[0] + t._totalDeltaX,
                    "deltaY": t._totalDragOffset[1] + t._totalDeltaY
                });
            }
        }
    });
    
    Y.DDMomentumPlugin = DDMomentumPlugin;


}, 'gallery-2013.05.15-21-12', {"skinnable": "false", "requires": ["dd", "plugin"]});
