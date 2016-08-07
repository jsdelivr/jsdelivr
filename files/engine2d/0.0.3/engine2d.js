/**
 * Engine2D game engine v0.0.3
 * License: http://git.io/vlp11
 * @author jackdalton
 */

/**
 * Engine2D namespace
 * 
 * @namespace
 */
var Engine2D = {
    TYPE: {
        RECT: 1,
        CIRCLE: 2
    },
    /**
     * Engine2D game scene constructor.
     * 
     * @constructor
     * @this {GameScene}
     */
    GameScene: function() {
        var self = this;
        self.objects = {};
        /**
         * Checks whether a game object ID is valid or not.
         * 
         * @private
         * @param {string} objectId - ID to validate.
         * @returns {boolean} - Whether the generated object ID is valid or not.
         */
        var isValidID = function(objectId) {
            var pass;
            for (var i in self.objects) {
                if (self.objects[i].id == objectId) pass = true;
            }
            if (!!pass)
                return true;
            else
                return false;
        };
        /**
         * Adds game object to scene.
         *
         * @param {Object} gameObject - Valid Engine2D game object to add to scene.
         * @memberof Engine2D.GameScene
         */
        self.addObject = function(gameObject) {
            var pass;
            for (var i in Engine2D.TYPE) {
                if (gameObject.type == Engine2D.TYPE[i]) pass = true;
            }
            if (!!pass)
                self.objects[gameObject.id] = gameObject;
            else
                throw new TypeError("\"" + gameObject.type + "\" is not a valid Engine2D game object type.");
        };
        /**
         * Disables a game object.
         * 
         * @param {string} objectId - ID of desired object in the scene to disable.
         * @memberof Engine2D.GameScene
         */
        self.disableObject = function(objectId) {
            if (isValidID(objectId))
                self.objects[objectId].alive = false;
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
        /**
         * Enables a game object.
         * 
         * @param {string} objectId - ID of desired object in the scene to enable.
         * @memberof Engine2D.GameScene
         */
        self.enableObject = function(objectId) {
            if (isValidID(objectId))
                self.objects[objectId].alive = true;
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
        /**
         * Permanently destroys a game object.
         * 
         * @param {string} objectId - ID of desired object in the scene to destroy.
         * @memberof Engine2D.GameScene
         */
        self.destroyObject = function(objectId) {
            if (isValidID(objectId))
                delete self.objects[objectId];
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
    },
    /**
     * Engine2D rectangle constructor.
     * 
     * @constructor
     * @this {Rect}
     * @param {Object} options - An object specifying various aspects of a rectangle.
     */
    Rect: function(options) {
        var self = this;
        options = options || {};
        self.id = options.id || Engine2D.randomID();
        self.type = Engine2D.TYPE.RECT;
        self.alive = options.alive || true;
        self.size = {}, self.position = {};
        self.size.width = options.width || 0;
        self.size.height = options.height || 0;
        self.position.x = options.x || 0;
        self.position.y = options.y || 0;
    },
    /**
     * Engine2D circle constructor.
     * 
     * @constructor
     * @this {Circle}
     * @param {Object} options - An object specifying various aspects of a circle.
     */
    Circle: function(options) {
        var self = this;
        options = options || {};
        self.id = options.id || Engine2D.randomID();
        self.type = Engine2D.TYPE.CIRCLE;
        self.alive = options.alive || true;
        self.size = {}, self.position = {};
        self.size.radius = options.radius || 0;
        self.position.x = options.x || 0;
        self.position.y = options.y || 0;
    },
    /**
     * Used to generate random object IDs for Engine2D game objects.
     * 
     * @returns {string} - Randomly generated object ID.
     */
    randomID: function() {
        var opts = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", out = "";
        var i = 0;
        while (i < 5) {
            i++;
            out += opts[Math.floor(Math.random() * opts.length)];
        }
        return out;
    }
};

typeof module !==  "undefined" ? module.exports = Engine2D : window.Engine2D = Engine2D;